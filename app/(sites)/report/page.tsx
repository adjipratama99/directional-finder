"use client"

import { GET_NAMA_SATUAN_LIST, GET_REPORT_LIST } from "@/constant/app";
import LoadingScreen from "@/hooks/LoadingScreen";
import { useCustomQuery } from "@/hooks/useQueryData";
import { fetchPost } from "@/lib/Fetcher";
import { Report } from "@/types/general";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState } from "react";
import ModalTypeData from "./_components/modal-set-type-data";

const PDFClient = dynamic(() => import("@/components/custom/pdf-viewer/index"), {
    ssr: false, // ⛔ Disable SSR
});

export default function ReportPage() {
    const [open, setOpen] = useState<boolean>(true)
    const [data, setData] = useState<Report|null>(null);
    const [selectedData, setSelectedData] = useState<any[]>([]);
    const [typeData, setTypeData] = useState<string[]>([]);
    const [hasClearedData, setHasClearedData] = useState(false);
    const [nama_satuan, setNamaSatuan] = useState<string>("");

    const { data: dataWilayah, isLoading: loadingWilayah } = useCustomQuery({
        url: "/api/satuan-wilayah?type=get",
        queryKey: [GET_NAMA_SATUAN_LIST],
        params: { isUnique: true, usingNamaSatuan: true },
        callbackResult(res) {
            if(res?.code === 0) {
                if(res?.content?.count) {
                    return res?.content?.results.map(d => ({ value: d, text: d }));
                }
            }
  
            return []
        },
    })

    const { isLoading } = useQuery({
        queryKey: [GET_REPORT_LIST, nama_satuan, typeData],
        async queryFn() {
            const res = await fetchPost({
                url: "/api/report",
                body: { nama_satuan, sumber_data: typeData }
            }) as Report

            setData(res);

            const { data_user, data_inventory } = res;

            if (data_inventory?.length) {
                data_inventory.forEach((d) => {
                    if (data && !data.data_inventory.find((r) => r.detail_wilayah.id === d.detail_wilayah.id)) {
                        if (data && !data.data_inventory.find((r) => r.detail_wilayah.id === d.detail_wilayah.id)) {
                            setData((prev) => prev ? {
                                ...prev, 
                                data_inventory: [...prev.data_inventory, d]
                            } : null);
                        }
                    }

                    if (!hasClearedData && nama_satuan) {
                        if (!selectedData.find((r) => r.detail_wilayah.id === d.detail_wilayah.id)) {
                            setSelectedData((prev) => [...prev, d]);
                        }
                    }
                });
            }

            if (data_user?.length) {
                data_user.forEach((d) => {
                    if (data && !data.data_user.find((r) => r.detail_wilayah.id === d.detail_wilayah.id)) {
                        setData((prev) => prev ? {
                            ...prev, 
                            data_user: [...prev.data_user, d]
                        } : null);
                    }

                    if (!hasClearedData && nama_satuan) {
                        if (!selectedData.find((r) => r.detail_wilayah.id === d.detail_wilayah.id)) {
                            setSelectedData((prev) => [...prev, d]);
                        }
                    }
                });
            }

            return res;
        },
        enabled: !!typeData.length
    })

    console.log(selectedData)

    const handleSetTypeData = (data: string[]) => {
        setHasClearedData(false);
        setTypeData(data);
    }

    return (
        <div className="bg-gray-50 h-[92vh] py-6">
            <ModalTypeData open={open} onOpenChange={setOpen} onDataChange={handleSetTypeData} dataTypes={typeData} />
            {
                (typeData && (data || !isLoading)) ?
                    (<PDFClient
                        onOpenChange={setOpen}
                        data={data as Report}
                        filter={nama_satuan}
                        dataWilayah={dataWilayah}
                        onClearData={setHasClearedData}
                        loadingWilayah={loadingWilayah}
                        onChangeFilter={setNamaSatuan}
                        dataSelected={selectedData}
                        onChangeDataSelected={setSelectedData}
                    />)
                :
                    <LoadingScreen />
            }
        </div>
    );
}