import { Label } from "@/components/custom/form/label";
import { Select } from "@/components/custom/form/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GET_DF_LIST } from "@/constant/app";
import { fetchPost } from "@/lib/Fetcher";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";

type ParamsType = {
    tipe_df: string;
    teknologi: string[];
    keterangan?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ModalRequestDF({ onClose }: { onClose: React.Dispatch<React.SetStateAction<boolean>> }): React.JSX.Element {
    const { data: session } = useSession();
    const query = useQueryClient()
    const [isPending, setPending] = useState<boolean>(false)
    const [files, setFiles] = useState<File[]>([])

    const [params, setParams] = useState<ParamsType>({
        tipe_df: "",
        teknologi: [],
        keterangan: ""
    })
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setPending(true)

        const formData = new FormData()
        formData.append("tipe_df", params.tipe_df)
        formData.append("keterangan", params.keterangan!)
        formData.append("teknologi", params.teknologi.join(","))
        formData.append("wilayah", session?.user.wilayah)
        files.forEach(file => formData.append("uploaded_files", file))

        const request = await fetchPost({
            url: "/api/df?type=create",
            body: formData,
        })

        setPending(false)

        if(request?.code === 0) {
            query.invalidateQueries({ queryKey: [GET_DF_LIST] })
            onClose(false)
        }
    }

    const handleFileUploads = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles: File[] = [];
    
        for (const file of files) {
            const isPDF = file.type === 'application/pdf';
            const isSizeValid = file.size <= MAX_FILE_SIZE; // 10MB
    
            if (!isPDF) {
                alert(`File "${file.name}" bukan PDF!`);
                continue;
            }
    
            if (!isSizeValid) {
                alert(`File "${file.name}" melebihi 10MB!`);
                continue;
            }
    
            validFiles.push(file);
        }
    
        if (validFiles.length === 0) {
            alert("Ga ada file yang lolos validasi.");
            return;
        }

        setFiles(validFiles)
    };


    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-2">
                    <Label isRequired value="Tipe DF" />
                    <Select
                        options={[{
                            value: "active",
                            text: "Active"
                        },{
                            value: "hybrid",
                            text: "Hybrid"
                        },{
                            value: "passive",
                            text: "Passive"
                        }]}
                        placeholder="Pilih tipe DF"
                        onChange={(val) => setParams(prev => ({...prev, tipe_df: val as string}))}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label isRequired value="Tipe DF" />
                    <Select
                        options={[{
                            value: "2g",
                            text: "2G"
                        },{
                            value: "3g",
                            text: "3G"
                        },{
                            value: "4g",
                            text: "4G"
                        },{
                            value: "5g",
                            text: "5G"
                        }]}
                        placeholder="Pilih Teknologi"
                        isMulti
                        onChange={(val) => setParams(prev => ({...prev, teknologi: val as string[]}))}
                    />
                </div>
                <div className="flex flex-col gap-2 mb-4 col-span-2">
                    <Label value="Upload Dokumen" isRequired />
                    <Input
                        type="file"
                        onChange={(e) => handleFileUploads(e)}
                        accept="application/pdf"
                        multiple
                    />
                </div>
                <div className="flex flex-col gap-2 mb-4 col-span-2">
                    <Label value="Keterangan" />
                    <Textarea
                        value={params.keterangan}
                        onChange={(e) => setParams(prev => ({ ...prev, keterangan: e.target.value }))}
                        placeholder="Masukan keterangan ..."
                    />
                </div>
            </div>
            <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                    {
                        isPending ?
                            <div className="flex items-center gap-2">
                                <FaSpinner />
                                Processing ...
                            </div>
                        : "Submit"
                    }
                </Button>
            </div>
        </form>
    )
}