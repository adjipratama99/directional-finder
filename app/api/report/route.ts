import { SatuanKerja } from "@/entities/SatuanKerja";
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const db = await connectDB()
        const satuanKerja = db.getRepository(SatuanKerja)

        const getSatuanKerja = await satuanKerja.find();

        const results = [];

        for await (const data of getSatuanKerja) {
            const loopingan: any = await satuanKerja.query(`
                SELECT df.tipe_df, df.teknologi, df.tahun_pengadaan
                FROM users u
                LEFT OUTER JOIN directional_finder df ON u.username = df.userCreate
                WHERE df.status = 2
                  AND u.satuan_wilayah = '${data.satuan_wilayah}'
                  AND u.wilayah = '${data.wilayah}'
                  AND u.nama_satuan = '${data.nama_satuan}'
            `);
        
            if(loopingan.length) {
                results.push({ "detail_wilayah": data, "perangkat_df": loopingan })
            }
        }
        

        return NextResponse.json(results);
        
    } catch (err) {
        console.log(err)
    }
}