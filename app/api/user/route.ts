import { message_error, message_success } from '@/lib/messages';
import { handlerRequest, RequestType, requiredKey } from '@/lib/handlerRequest';
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

        const request = await handlerRequest({ body, type, modelName, ...(desiredKey.length && { desiredKey }) })
        let response: ResponseMessage<any> = {...message_success};
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
        default:
    }

    return required;
}