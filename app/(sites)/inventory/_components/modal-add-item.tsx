import { Label } from "@/components/custom/form/label";
import { Option, Select } from "@/components/custom/form/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GET_INVENTORY_LIST, GET_SATUAN_KERJA_LIST, NEW_DATA } from "@/constant/app";
import { useCustomMutation, useCustomQuery } from "@/hooks/useQueryData";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

type ParamsType = {
    nama: string;
    tahun_pengadaan: string;
    tipe_df: string;
    satuan_kerja: string;
    teknologi: string[];
    keterangan?: string;
}

export default function ModalAddItem({ onClose }: { onClose: React.Dispatch<React.SetStateAction<boolean>> }): React.JSX.Element {
    const query = useQueryClient()

    const { data, isLoading } = useCustomQuery({
        queryKey: [GET_SATUAN_KERJA_LIST],
        url: "/api/satuan-wilayah?type=get",
        params: { "offset": 0, "limit": 9999 },
        callbackResult(res) {
            let groupedOptions: Record<string, Option[]> = {};
            if(res.content?.count) {
                groupedOptions = res.content.results.reduce((acc, curr) => {
                    const group = curr.satuan_wilayah.toUpperCase();
                    if (!acc[group]) {
                        acc[group] = [];
                    }
                    
                    const alreadyExists = acc[group].some(
                        (item) => item.value === curr.nama_satuan
                    );
                
                    if (!alreadyExists) {
                        acc[group].push({
                            value: curr.nama_satuan,
                            text: curr.nama_satuan,
                        });
                    }

                    return acc;
                }, {} as Record<string, Option[]>);
            }
            return groupedOptions;
        },
    })

    const [params, setParams] = useState<ParamsType>({
        nama: "",
        tahun_pengadaan: "",
        tipe_df: "",
        teknologi: [],
        satuan_kerja: ""
    })
    
    const {
        mutate,
        isPending
    } = useCustomMutation({
        mutationKey: [NEW_DATA],
        params,
        url: "/api/inventory?type=create",
        callbackResult: (data) => {
            if(data?.code === 0) {
                query.invalidateQueries({ queryKey: [GET_INVENTORY_LIST] })
                toast.success(data.message)
                onClose(false)
            }
        }
    })

    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            mutate(params)
        }}>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-2">
                    <Label isRequired value="Nama Pengadaan" />
                    <Input
                        type="text"
                        value={params.nama}
                        onChange={(e) => setParams(prev => ({...prev, nama: e.target.value}))}
                        required
                        placeholder="Masukkan Nama Pengadaan..."
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label isRequired value="Tahun Pengadaan" />
                    <Input
                        type="text"
                        value={params.tahun_pengadaan}
                        onChange={(e) => setParams(prev => ({...prev, tahun_pengadaan: e.target.value}))}
                        required
                        placeholder="Masukkan Tahun Pengadaan ..."
                    />
                </div>
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
                        value={params.tipe_df}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label isRequired value="Teknologi" />
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
                <div className="flex flex-col gap-2 col-span-2">
                    <Label isRequired value="Satuan Kerja" />
                    {
                        data && (
                            <Select
                                groupedOptions={data}
                                isModal
                                disabled={isLoading}
                                onChange={(val) => setParams(prev => ({...prev, satuan_kerja: val as string}))}
                                placeholder="Pilih Satuan Kerja"
                                value={params.satuan_kerja}
                            />
                        )
                    }
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                    <Label value="Keterangan" />
                    <Textarea
                        value={params.keterangan}
                        className="w-full"
                        onChange={(e) => setParams(prev => ({...prev, keterangan: e.target.value}))}
                        placeholder="Keterangan item ..."
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