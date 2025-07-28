import { SatuanKerja } from "@/models/SatuanKerja.model";
import { NextRequest, NextResponse } from "next/server";
import { DirectionalFinder } from "@/models/directionalFinder.model";
import { User } from "@/models/user.model";

export async function POST(req: NextRequest) {
    try {
        const satuanKerjas = await SatuanKerja.findAll(); // ambil semua wilayah

        const results = [] as Array<{ detail_wilayah: SatuanKerja; perangkat_df: any[] }>;

        for (const data of satuanKerjas) {
            console.log("SatuanKerja", data)
            // cari users sesuai wilayah
            const users = await User.findAll({
                where: {
                    satuan_wilayah: data.satuan_wilayah ?? "",
                    wilayah: data.wilayah ?? "",
                    nama_satuan: data.nama_satuan ?? "",
                },
                include: [
                    {
                        model: DirectionalFinder,
                        where: { status: 2 },
                        required: false, // biar tetap dapet user meski DF kosong
                        attributes: ["tipe_df", "teknologi", "tahun_pengadaan"],
                    }
                ],
            });

            // kumpulin semua perangkat_df dari user2 tadi
            const perangkat_df = users.flatMap((user: any) => user.DirectionalFinders || []);

            if (perangkat_df.length) {
                results.push({
                    detail_wilayah: data,
                    perangkat_df
                });
            }
        }

        return NextResponse.json(results);

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
