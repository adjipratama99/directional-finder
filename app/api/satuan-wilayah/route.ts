import { message_error, message_success } from '@/lib/messages'
import { handlerRequest, RequestType } from '@/db/handler'
import { requiredKey } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { getTableByModelName } from '@/db/repository'
import { Sequelize } from 'sequelize'
import { ModelStatic } from 'sequelize'

const modelName = "SatuanKerja"

export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url!)
        const type = searchParams.get('type') as RequestType
        const body = await req.json()

        const { usingNamaSatuan } = body;

        const { model } = await getTableByModelName(modelName)

        const attributes: any = [];

        if(usingNamaSatuan) {
            attributes.push([Sequelize.fn('DISTINCT', Sequelize.col('nama_satuan')), 'nama_satuan'])
        } else {
            attributes.push([Sequelize.fn('DISTINCT', Sequelize.col('wilayah')), 'wilayah'])
        }

        // 🟣 Jika request hanya butuh unique wilayah
        if (body?.isUnique === true) {
            const uniqueWilayah = await (model as ModelStatic<any>).findAll({
                attributes,
                order: [[usingNamaSatuan ? "nama_satuan" : 'wilayah', 'ASC']],
                raw: true
            });

            const results = uniqueWilayah.map(item => usingNamaSatuan ? item.nama_satuan : item.wilayah)

            return NextResponse.json({
                ...message_success,
                content: {
                    count: results.length,
                    results,
                },
            })
        }

        // 🟠 Validasi body dengan requiredKey
        const required = await requiredKeyByType(type)
        const isValid = await requiredKey(required, body)
        if (!isValid) {
            return NextResponse.json({
                ...message_error,
                message: "Invalid request parameter",
            })
        }

        // 🟢 Ambil data sesuai type
        const desiredKey: string[] = (type === "get") ? ["id", "wilayah", "satuan_wilayah", "nama_satuan"] : []

        const data = await handlerRequest({
            body,
            type,
            modelName,
            ...(desiredKey.length && { desiredKey }),
        })

        return NextResponse.json({
            ...message_success,
            content: data,
        })

    } catch (err) {
        console.error("POST error:", err)
        return NextResponse.json({
            ...message_error,
            content: err,
        })
    }
}

async function requiredKeyByType(type: RequestType): Promise<string[]> {
    switch (type) {
        case "create":
            return ["username", "password", "role"]
        case "get":
        default:
            return []
    }
}
