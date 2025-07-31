// app/api/directional-finder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';

import { handlerRequest, RequestType } from '@/db/handler';
import { message_error, message_success } from '@/lib/messages';
import { ResponseMessage } from '@/types/general';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { requiredKey } from '@/lib/utils';
import { UploadedFile } from '@/models/uploadedFiles.model';

const modelName = 'DirectionalFinder';

export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url!)
        const type = searchParams.get('type') as RequestType
        const session = await getServerSession(authOptions)

        if(type === "create") {
            const contentType = req.headers.get('content-type');

            if (contentType?.includes('multipart/form-data')) {
                const formData = await req.formData();

                const tipe_df = formData.get('tipe_df')?.toString();
                const teknologi = formData.get('teknologi')?.toString();
                const wilayah = formData.get('wilayah')?.toString();
                const keterangan = formData.get('keterangan')?.toString();
                const nama_satuan = formData.get('nama_satuan')?.toString();
                const files = formData.getAll('uploaded_files') as File[];

                const isValid = await requiredKey(await requiredKeyByType(type), {
                    tipe_df,
                    teknologi,
                    wilayah,
                    uploaded_files: files
                });

                if (!isValid) {
                    return NextResponse.json({ ...message_error, message: "Invalid request parameter" });
                }

                const uploadedPaths: { [key: string]: string }[] = [];

                for (const file of files) {
                    const filename = `${Date.now()}-${file.name}`;
                    uploadedPaths.push({ file_name: filename, uploaded_by: session?.user?.username });
                }

                // 1. Simpan data dulu (tanpa file)
                const body = {
                    tipe_df,
                    teknologi: teknologi?.split(','),
                    nama_satuan,
                    wilayah,
                    ...(keterangan && { keterangan }),
                    userCreate: session?.user?.username,
                    uploaded_files: uploadedPaths
                };

                const savedData = await handlerRequest({
                    body,
                    type: 'create',
                    modelName,
                    includeModel: {
                        include: [{
                            model: UploadedFile,
                            as: "uploaded_files"
                        }]
                    }
                });

                if (!savedData) {
                    return NextResponse.json({ ...message_error, message: "Gagal menyimpan data awal" });
                }

                if (files.length > 0) {
                    const uploadDir = join(process.cwd(), 'public', 'uploads');
                    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
                    let i = 0;
                    for (const file of files) {
                        const arrayBuffer = await file.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);

                        const filename = uploadedPaths[i].file_name
                        const filepath = join(uploadDir, filename);

                        await writeFile(filepath, buffer);
                        i++;
                    }
                }

                const response: ResponseMessage<any> = {
                    ...message_success,
                    content: savedData
                };

                return NextResponse.json(response);
            }
        } else {
            const body = await req.json(); 

            if (!(await requiredKey(await requiredKeyByType(type), body))) {
                return NextResponse.json({ ...message_error, message: "Invalid request parameter" })
            }

            let desiredKey: string[] = [];
            let searchKey: string[] = [];
    
            if(type === "get") {
                desiredKey = ["id", "tipe_df", "teknologi", "keterangan", "uploaded_files", "status", "tahun_pengadaan", "dateCreate", "userCreate", "dateUpdate", "wilayah", "nama_satuan"];
                searchKey = ["id", "teknologi", "tipe_df", "uploaded_files.uploaded_by", "userCreate"]
            }

            const request = await handlerRequest({
                body: {...body,
                    ...(type === "get" && { userCreate: session.user.username }),
                    ...(session.user.role !== "admin" && { filters: { ...body.filters, userCreate: session.user.username } })
                },
                type,
                modelName,
                ...(desiredKey.length && { desiredKey }),
                ...(searchKey.length && { searchKey }),
            })

            let response: ResponseMessage<any> = !request ? {...message_error} : {...message_success}
            response.content = request;
            return NextResponse.json(response)
        }

        return NextResponse.json({ ...message_error, message: 'Unsupported Content-Type' });
    } catch (err) {
        console.error('Upload error:', err);
        return NextResponse.json({ ...message_error, content: err });
    }
}

async function requiredKeyByType(type: RequestType): Promise<string[]> {
    let required: string[] = []
    switch(type) {
        case "create":
            required = ["tipe_df", "teknologi", "uploaded_files"];
            break;
        case "get":
            required = ["offset", "limit"];
            break;
        default:
    }

    return required;
}