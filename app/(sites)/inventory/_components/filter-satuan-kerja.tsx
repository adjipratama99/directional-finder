import { Select } from "@/components/custom/form/select";
import { SatuanKerja } from "@/models/SatuanKerja.model";
import { useAppSelector } from "@/redux/hooks";
import React, { useState } from "react";
import { InferAttributes, InferCreationAttributes } from "sequelize";
export type UserAttributes = InferAttributes<SatuanKerja>;
export type UserCreationAttributes = InferCreationAttributes<SatuanKerja>;

export default function FilterSatuanKerja({
    onChangeFilter,
    filter
}: {
    onChangeFilter: React.Dispatch<React.SetStateAction<{ [key: string]: (string | number) }>>;
    filter: string
}): React.JSX.Element {
    const { nama_satuan } = useAppSelector(state => state.wilayah)
    const [defaultValue, setDefaultValue] = useState<string>(filter)
    const handleChangeSatuanKerja = async (satuan_kerja: string) => {
        setDefaultValue(satuan_kerja)
        onChangeFilter(prev => ({ ...prev, satuan_kerja: satuan_kerja.split('-')[0] }))
    }

    return (
        <Select
            options={nama_satuan}
            placeholder="Filter Satuan Kerja"
            value={defaultValue}
            onChange={(val) => handleChangeSatuanKerja(val as string)}
            disabled={nama_satuan.length === 0}
        />
    )
}