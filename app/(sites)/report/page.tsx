"use client"

import { GET_REPORT_LIST, GET_SATUAN_KERJA_LIST } from "@/constant/app";
import LoadingScreen from "@/hooks/LoadingScreen";
import { useCustomQuery } from "@/hooks/useQueryData";
import { fetchPost } from "@/lib/Fetcher";
import { ReportData } from "@/types/general";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState } from "react";

const PDFClient = dynamic(() => import("@/components/custom/pdf-viewer/index"), {
    ssr: false, // ⛔ Disable SSR
});

export default function ReportPage() {
    const [data, setData] = useState<ReportData[]>([]);
    const [selectedData, setSelectedData] = useState<any[]>([]);
    const [nama_satuan, setNamaSatuan] = useState<string>("");

    const { data: dataWilayah, isLoading: loadingWilayah } = useCustomQuery({
        url: "/api/satuan-wilayah?type=get",
        queryKey: [GET_SATUAN_KERJA_LIST],
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
        queryKey: [GET_REPORT_LIST, nama_satuan],
        async queryFn() {
            const res = await fetchPost({
                url: "/api/report",
                body: { nama_satuan }
            })

            res.map((d: ReportData) => {
                if(!(data.find(r => r.detail_wilayah.id === d.detail_wilayah.id))) {
                    setData(prev => [...prev, d])
                }

                if(nama_satuan) {
                    if(!selectedData.find(r => r.detail_wilayah.id === d?.detail_wilayah.id)) setSelectedData(prev => ([...prev, d]))
                }
            })

            return res;
        }
    })

    return (
        <div className="bg-gray-50 h-full py-10">
            {
                (data || !isLoading) ?
                    (<PDFClient
                        data={data}
                        filter={nama_satuan}
                        dataWilayah={dataWilayah}
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