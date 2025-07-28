"use client"

import LoadingScreen from "@/hooks/LoadingScreen";
import { fetchPost } from "@/lib/Fetcher";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const PDFClient = dynamic(() => import("@/components/custom/pdf-viewer/index"), {
    ssr: false, // ⛔ Disable SSR
});

export default function ReportPage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const res = await fetchPost({
                url: "/api/report",
                body: {}
            })

            setData(res)
        }

        getData()
    }, [])

    return (
        <div className="bg-gray-50 h-full py-10">
            {
                data ?
                    (<PDFClient data={data} />)
                :
                    <LoadingScreen />
            }
        </div>
    );
}