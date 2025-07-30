import { message_error, message_success } from '@/lib/messages';
import { handlerRequest, RequestType } from '@/db/handler';
import { requiredKey } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseMessage } from '@/types/general';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

const modelName = "Inventory"

export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url!)
        const type = searchParams.get('type') as RequestType
        const body = await req.json(); 
        const session = await getServerSession(authOptions)
        if (!(await requiredKey(await requiredKeyByType(type), body))) {
            return NextResponse.json({ ...message_error, message: "Invalid request parameter" })
        }

        console.log(body)

        const request = await handlerRequest({
            body: {...body, userCreate: session?.user?.username,
                ...(type === "get" && { filters: {...body?.filters, status: [0, 1]} })
            },
            type,
            modelName,
            includeData: true
        })
        let response: ResponseMessage<any> = request ? {...message_success} : {...message_error, message: request ?? "Gagal update data."};
        response.content = request;
        return NextResponse.json(response)
    } catch (err) {
        console.log("error bro", err)
        let response: ResponseMessage<any> = {...message_error};
        response.content = err;
        return NextResponse.json(response)
    }
}

async function requiredKeyByType(type: RequestType): Promise<string[]> {
    let required: string[] = []
    switch(type) {
        case "create":
            required = ["nama", "tahun_pengadaan", "satuan_kerja", "teknologi", "tipe_df"];
            break;
        case "get":
            required = ["offset", "limit"];
            break;
        case "update":
            required = ["id"];
            break;
        default:
    }

    return required;
}