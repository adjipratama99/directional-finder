import { message_error, message_success } from '@/lib/messages';
import { handlerRequest, RequestType } from '@/db/handler';
import { requiredKey } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseMessage } from '@/types/general';

const modelName = "User"

export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url!)
        const type = searchParams.get('type') as RequestType
        const body = await req.json(); 
        if (!(await requiredKey(await requiredKeyByType(type), body))) {
            return NextResponse.json({ ...message_error, message: "Invalid request parameter" })
        }

        let desiredKey: string[] = [];

        if(type === "get") {
            desiredKey = ["id", "username", "status", "dateCreate", "dateUpdate", "satuan_wilayah", "wilayah", "nama_satuan"];
        }

        if(type === "update" && body.hasOwnProperty("oldPassword") && body.oldPassword) {
            const user = await handlerRequest({ body, type: "read", modelName, ...(desiredKey.length && { desiredKey }) });
            
            if(user) {
                if(user.password !== body.oldPassword) {
                    return NextResponse.json({ ...message_error, message: "Password lama tidak sama dengan yang ada di data." })
                }
            } else {
                return NextResponse.json({ ...message_error, message: "User tidak ditemukan." })
            }

            delete body.oldPassword;
        }

        const request = await handlerRequest({ body: {
            ...body,
            ...(type === "get" && { filters: {...body?.filters, status: [0, 1]} })
        }, type, modelName, ...(desiredKey.length && { desiredKey }) })
        let response: ResponseMessage<any> = request ? {...message_success} : {...message_error, message: "Gagal update data."};
        response.content = request;
        return NextResponse.json(response)
    } catch (err) {
        console.log(err)
        let response: ResponseMessage<any> = {...message_error};
        response.content = err;
        return NextResponse.json(response)
    }
}

async function requiredKeyByType(type: RequestType): Promise<string[]> {
    let required: string[] = []
    switch(type) {
        case "create":
            required = ["username", "password", "role"];
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