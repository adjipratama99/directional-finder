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
                    as: "directional_finder",
                    where: { status: 2 },
                    required: false,
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
            perangkat_df: user.directional_finder || []
        }));

        return NextResponse.json(results ?? []);

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
