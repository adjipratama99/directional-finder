import { Select } from "@/components/custom/form/select";
import { GET_WILAYAH_LIST } from "@/constant/app";
import { useCustomQuery } from "@/hooks/useQueryData";
import { SatuanKerja } from "@/models/SatuanKerja.model";
import React, { useState } from "react";
import { InferAttributes, InferCreationAttributes } from "sequelize";
export type UserAttributes = InferAttributes<SatuanKerja>;
export type UserCreationAttributes = InferCreationAttributes<SatuanKerja>;

import {
    addNamaSatuan,
    addWilayah
} from "@/redux/slices/wilayahSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function FilterWilayah({
    onChangeFilter,
    filter
}: {
    onChangeFilter: React.Dispatch<React.SetStateAction<{ [key: string]: (string | number) }>>;
    filter: string
}): React.JSX.Element {
    const dispatch = useAppDispatch()
    const { wilayah } = useAppSelector(state => state.wilayah)

    const [defaultValue, setDefaultValue] = useState<string>(filter)
    const handleChangeWilayah = async (wilayah: string) => {
        setDefaultValue(wilayah)
        onChangeFilter(prev => ({ ...prev, wilayah: wilayah.split('-')[0] === "all" ? "" : wilayah.split('-')[0] }))
    }

    const { isLoading } = useCustomQuery({
        queryKey: [GET_WILAYAH_LIST],
        params: {
            offset: 0,
            limit: 9999
        },
        url: "/api/satuan-wilayah?type=get",
        callbackResult(res) {
            if(res.code === 0) {
                if(res.content.count) {
                    let uniqueWilayah: { value: string; text: string }[] = [{ value: "all", text: "Semua" }];

                    res.content.results.forEach((satWil: SatuanKerja, ind: number) => {
                        if(!uniqueWilayah.find(d => d.text === satWil.wilayah)) {
                            uniqueWilayah.push({ value: `${satWil.wilayah}-${ind}`, text: satWil.wilayah! })
                        }
                    })

                    dispatch(addWilayah(uniqueWilayah))
                    dispatch(addNamaSatuan([{ value: "all", text: "Semua" }, ...res.content.results.map((satWil: SatuanKerja, ind: number) => ({ value: `${satWil.nama_satuan}-${ind}`, text: satWil.nama_satuan }))]))
                }
            }

            return res
        },
    })

    return (
        <Select
            options={wilayah}
            placeholder="Filter Wilayah"
            value={defaultValue}
            onChange={(val) => handleChangeWilayah(val as string)}
            disabled={isLoading || wilayah.length === 0}
        />
    )
}