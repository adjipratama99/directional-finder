import { NextRequest, NextResponse } from "next/server";
import { DirectionalFinder } from "@/models/directionalFinder.model";
import { User } from "@/models/user.model";
import { message_error } from "@/lib/messages";
import { Inventory } from "@/models/inventory.model";
import { SatuanKerja } from "@/models/SatuanKerja.model";
import _ from "lodash";
import { InferAttributes, InferCreationAttributes } from "sequelize";

export type SatuanKerjaAttributes = InferAttributes<SatuanKerja>;
export type SatuanKerjaCreationAttributes = InferCreationAttributes<SatuanKerja>;

export async function POST(req: NextRequest) {
    try {
        const params = await req.json();
        let data_user: any[] = [];

        if(!params?.sumber_data) {
            return NextResponse.json({ ...message_error, message: "Invalid request parameter" })
        }

        let users: any[] = [];

        if (params.sumber_data.includes("df")) {
            users = await User.findAll({
                where: {
                    role: "user",
                    ...(params.nama_satuan && { nama_satuan: params.nama_satuan }),
                },
                include: [{
                    model: DirectionalFinder,
                    as: "directional_finder",
                    where: { status: 2 },
                    required: false,
                    attributes: ["tipe_df", "teknologi", "tahun_pengadaan"],
                }]
            });

            data_user = users.map(user => ({
                detail_wilayah: {
                    id: user.id,
                    satuan_wilayah: user.satuan_wilayah,
                    wilayah: user.wilayah,
                    nama_satuan: user.nama_satuan
                },
                perangkat_df: user.directional_finder || []
            }));
        }

        // Data inventory (diri sendiri, gak disatuin)
        let data_inventory: any[] = [];

        if (params.sumber_data.includes("inventory")) {
            const inventoryData = await Inventory.findAll({
                include: [{
                    model: SatuanKerja,
                    as: "satuan_kerja_data",
                    required: true,
                    attributes: ["id", "wilayah", "nama_satuan"],
                    ...(params.nama_satuan && {
                        where: { nama_satuan: params.nama_satuan }
                    })
                }],
                where: {
                    status: 1
                },
                attributes: [
                    "id",
                    "nama",
                    "kondisi_perangkat",
                    "satuan_kerja",
                    "keterangan",
                    "tipe_df",
                    "teknologi",
                    "tahun_pengadaan",
                    "wilayah"
                ]
            });
            
            // 🔍 Hapus duplicate berdasarkan tipe_df + teknologi + tahun_pengadaan
            const uniqueInventory = _.uniqWith(inventoryData, (a, b) => {
                return (
                    a.tipe_df === b.tipe_df &&
                    JSON.stringify(a.teknologi) === JSON.stringify(b.teknologi) &&
                    a.tahun_pengadaan === b.tahun_pengadaan &&
                    a.satuan_wilayah === b.satuan_wilayah
                );
            });
            
            // 🔄 Group by satuan_wilayah
            const groupedInventory = _.groupBy(uniqueInventory, 'satuan_wilayah');
            
            // 🚀 Format akhir
            data_inventory = Object.entries(groupedInventory).map(([wilayah, items]) => {
                const item: { [key: string]: (string|any) } = (items as any)[0]
                return ({
                    detail_wilayah: {
                        id: item?.satuan_kerja_data?.id ?? null,
                        satuan_wilayah: wilayah,
                        wilayah: item?.satuan_kerja_data?.wilayah ?? null,
                        nama_satuan: item?.satuan_kerja_data?.nama_satuan ?? null
                    },
                    inventory: (items as any).map(item => ({
                        nama: item.nama,
                        kondisi_perangkat: item.kondisi_perangkat,
                        satuan_kerja: item.satuan_kerja,
                        keterangan: item.keterangan,
                        tipe_df: item.tipe_df,
                        teknologi: item.teknologi,
                        tahun_pengadaan: item.tahun_pengadaan
                    }))
                })
            });
        }

        return NextResponse.json({
            data_user,
            data_inventory
        });

    } catch (err) {
        console.error("error", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
