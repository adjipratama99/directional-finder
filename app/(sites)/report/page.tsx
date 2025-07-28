"use client"

import { fetchPost } from "@/lib/Fetcher";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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
        <div className="bg-gray-50 min-h-screen py-10">
            {
                data && (<PDFClient data={data} />)
            }
        </div>
    );
}