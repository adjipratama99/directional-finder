import { SatuanKerja } from "@/models/SatuanKerja.model";
import { NextRequest, NextResponse } from "next/server";
import { DirectionalFinder } from "@/models/directionalFinder.model";
import { User } from "@/models/user.model";

export async function POST(req: NextRequest) {
    try {
        const params = await req.json();

        const users = await User.findAll({
            where: {
                role: "user",
                ...(params.nama_satuan && { nama_satuan: params.nama_satuan })
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

        const results = users.map((user: any) => ({
            detail_wilayah: {
                id: user.id,
                satuan_wilayah: user.satuan_wilayah,
                wilayah: user.wilayah,
                nama_satuan: user.nama_satuan
            },
            perangkat_df: user.DirectionalFinders || []
        }));

        return NextResponse.json(results ?? []);

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
