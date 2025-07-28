import { message_error, message_success } from '@/lib/messages';
import { handlerRequest, RequestType, requiredKey } from '@/lib/handlerRequest';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseMessage } from '@/types/general';
import { connectDB } from '@/lib/db';
import { SatuanKerja } from '@/entities/SatuanKerja';

const modelName = "SatuanKerja"

export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url!)
        const type = searchParams.get('type') as RequestType
        const body = await req.json(); 
        const db = await connectDB()
        const satuanKerja = db.getRepository(SatuanKerja)

        // Kalau isUnique true, langsung ambil unique wilayah
        if (body?.isUnique === true) {
            const uniqueWilayah = await satuanKerja
            .createQueryBuilder("satuan")
            .select("DISTINCT satuan.wilayah", "wilayah")
            .orderBy("satuan.wilayah", "ASC")
            .getRawMany();


            const results = uniqueWilayah.map(item => item.wilayah);
            const response: ResponseMessage<any> = {
                ...message_success,
                content: {
                    count: results.length,
                    results,
                },
            };

            return NextResponse.json(response);
        }

        // Validasi biasa
        if (!(await requiredKey(await requiredKeyByType(type), body))) {
            return NextResponse.json({ ...message_error, message: "Invalid request parameter" });
        }

        // Handle logic get/post/put/delete biasa
        let desiredKey: string[] = [];
        if (type === "get") {
            desiredKey = ["id", "wilayah", "nama_satuan"];
        }

        const request = await handlerRequest({
            body,
            type,
            modelName,
            ...(desiredKey.length && { desiredKey }),
        });

        const response: ResponseMessage<any> = {
            ...message_success,
            content: request,
        };

        return NextResponse.json(response);

    } catch (err) {
        console.error("POST error:", err);
        const response: ResponseMessage<any> = {
            ...message_error,
            content: err,
        };
        return NextResponse.json(response);
    }
}


async function requiredKeyByType(type: RequestType): Promise<string[]> {
    let required: string[] = []
    switch(type) {
        case "create":
            required = ["username", "password", "role"];
            break;
        case "get":
            required = [];
            break;
        default:
    }

    return required;
}