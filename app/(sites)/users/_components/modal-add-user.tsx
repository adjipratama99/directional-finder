import { Label } from "@/components/custom/form/label";
import { Select } from "@/components/custom/form/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GET_SATUAN_KERJA_LIST, GET_USER_LIST, NEW_DATA } from "@/constant/app";
import { useCustomMutation, useCustomQuery } from "@/hooks/useQueryData";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

type ParamsType = {
    username: string;
    password: string;
    satuan_wilayah: string;
    role: string;
    wilayah: string;
    nama_satuan: string;
}

export default function ModlaAddUser({ onClose }: { onClose: React.Dispatch<React.SetStateAction<boolean>> }): React.JSX.Element {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const query = useQueryClient()

    const [params, setParams] = useState<ParamsType>({
        username: "",
        password: "",
        role: "user",
        satuan_wilayah: "",
        wilayah: "",
        nama_satuan: ""
    })
    
    const {
        mutate,
        isPending
    } = useCustomMutation({
        mutationKey: [NEW_DATA],
        params,
        url: "/api/user?type=create",
        callbackResult: (data) => {
            if(data?.code === 0) {
                query.invalidateQueries({ queryKey: [GET_USER_LIST] })
                toast.success(data.message)
                onClose(false)
            }
        }
    })

    const {
        data: dataWilayah,
        isLoading
    } = useCustomQuery({
        queryKey: [GET_SATUAN_KERJA_LIST, params.satuan_wilayah],
        url: "/api/satuan-wilayah?type=get",
        params: { offset: 0, limit: 9999, filters: { satuan_wilayah: params.satuan_wilayah } },
        enabled: !!params.satuan_wilayah,
        callbackResult(data) {
            if(data?.code === 0) {
                if(data?.content?.count) {
                    return data?.content?.results.map((d) => ({ value: d?.id + '-' + d?.wilayah +'-'+ d?.nama_satuan, text: d.nama_satuan }))
                }
            }

            return [];
        }
    })
    
    const handleChooseNamaSatuan = (val: string) => {
        const [id, wilayah, nama_satuan] = val.split('-')

        setParams(prev => ({...prev, wilayah, nama_satuan}))
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            mutate(params)
        }}>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-2">
                    <Label isRequired value="Username" />
                    <Input
                        type="text"
                        value={params.username}
                        onChange={(e) => setParams(prev => ({...prev, username: e.target.value}))}
                        placeholder="Masukkan username ..."
                        required
                    />
                </div>
                <div className="flex flex-col gap-2 mb-4">
                    <Label value="Password" isRequired />
                    <div className="relative w-full cursor-pointer">
                        <Input
                            type={showPassword ? "text" : "password"}
                            required
                            onChange={(e) => setParams(prev => ({...prev, password: e.target.value}))}
                            placeholder="Masukkan password ..."
                        />
                        <div className="absolute top-2.5 right-2.5" onClick={() => setShowPassword(prev => !prev)}>
                            {
                                !showPassword ? <FaEyeSlash /> : <FaEye />
                            }
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label isRequired value="Satuan Wilayah" />
                    <Select
                        options={[{
                            value: "POLDA",
                            text: "Polda"
                        },{
                            value: "POLRES",
                            text: "Polres"
                        }]}
                        placeholder="Pilih Satuan Wilayah"
                        onChange={(val) => setParams(prev => ({...prev, satuan_wilayah: val as string}))}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label isRequired value="Satuan Kerja" />
                    <Select
                        options={dataWilayah ?? []}
                        disabled={isLoading || !dataWilayah}
                        placeholder="Pilih Satuan Wilayah"
                        onChange={(val) => handleChooseNamaSatuan(val as string)}
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