import Confirmation from "@/components/custom/confirmation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { GET_INVENTORY_LIST } from "@/constant/app";
import { fetchPost } from "@/lib/Fetcher";
import { ellipsis } from "@/lib/utils";
import { Inventory } from "@/types/general";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "sonner";

export default function CardInventory({
    data
}: { data: Inventory }): React.JSX.Element {
    const [open, setOpen] = useState<boolean>(false)
    const query = useQueryClient()

    const handleDelete = async () => {
        const response = await fetchPost({
            url: "/api/inventory?type=update",
            body: { id: data.id, status: -1 }
        })

        if(response.code === 0) {
            toast.success(response.message)
            query.invalidateQueries({ queryKey: [GET_INVENTORY_LIST] })
        }
    }

    return (
        <Card className="relative">
            <CardHeader>
                {
                    data.nama.length > 26 ?
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <CardTitle className="text-ellipsis text-[10px] md:text-base">{ ellipsis(data.nama, 26) }</CardTitle>
                        </TooltipTrigger>
                        <TooltipContent>{ data.nama }</TooltipContent>
                    </Tooltip>
                    :
                    <CardTitle className="text-ellipsis text-[10px] md:text-base">{ data.nama }</CardTitle>
                }
                <Confirmation
                    trigger={<div className="cursor-pointer text-red-500 absolute top-1.5 right-2"><FaTimes /></div>}
                    onConfirm={handleDelete}
                />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <div className="text-gray-400 text-sm">Kondisi Perangkat</div>
                        <div className="text-sm">{ data.kondisi_perangkat }</div>
                    </div>
                    <div>
                        <div className="text-gray-400 text-sm">Tahun Pengadaan</div>
                        <div className="text-sm">{ data.tahun_pengadaan }</div>
                    </div>
                    <div>
                        <div className="text-gray-400 text-sm">Tipe DF</div>
                        <div className="text-sm capitalize">{ data.tipe_df }</div>
                    </div>
                    <div>
                        <div className="text-gray-400 text-sm">Teknologi</div>
                        <ul className="text-sm flex items-center gap-2 flex-wrap">
                            { data.teknologi.map(teknologi => <li key={teknologi} className="uppercase">{ teknologi }</li>) }
                        </ul>
                    </div>
                    <div>
                        <div className="text-gray-400 text-sm">Satuan Kerja</div>
                        <div className="text-sm capitalize">{ data.satuan_kerja }</div>
                    </div>
                    <div>
                        <div className="text-gray-400 text-sm">Wilayah</div>
                        <div className="text-sm capitalize">{ data.wilayah }</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}