import { Input } from "@/components/ui/input";
import useDebounceValue from "@/hooks/useDebounceValue";
import { SatuanKerja } from "@/models/SatuanKerja.model";
import React, { useEffect, useState } from "react";
import { InferAttributes, InferCreationAttributes } from "sequelize";
export type UserAttributes = InferAttributes<SatuanKerja>;
export type UserCreationAttributes = InferCreationAttributes<SatuanKerja>;

export default function FilterTahunPengadaan({
    onChangeFilter
}: {
    onChangeFilter: React.Dispatch<React.SetStateAction<{ [key: string]: (string | number) }>>;
    filter: string
}): React.JSX.Element {
    const [search, setSearch] = useState<string>("")

    const debounceValue = useDebounceValue(search)

    useEffect(() => {
        onChangeFilter(prev => ({ ...prev, tahun_pengadaan: debounceValue }))
    }, [debounceValue])

    return (
        <Input
            type="number"
            placeholder="Masukkan tahun pengadaan"
            onChange={(e) => setSearch(e.target.value)}
        />
    )
}