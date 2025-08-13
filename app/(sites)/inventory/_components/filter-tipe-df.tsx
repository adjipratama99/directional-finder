import { Select } from "@/components/custom/form/select";
import React, { useState } from "react";

export default function FilterTipeDF({
    onChangeFilter,
    filter
}: {
    onChangeFilter: React.Dispatch<React.SetStateAction<{ [key: string]: (string | number) }>>;
    filter: string
}): React.JSX.Element {
    const [defaultValue, setDefaultValue] = useState<string>(filter)
    const handleChangeWilayah = async (tipe_df: string) => {
        setDefaultValue(tipe_df)
        onChangeFilter(prev => ({ ...prev, tipe_df: tipe_df === "all" ? "" : tipe_df }))
    }

    return (
        <Select
            options={[{
                value: "all",
                text: "Semua"
            },{
                value: "active",
                text: "Active"
            },{
                value: "hybrid",
                text: "Hybrid"
            },{
                value: "passive",
                text: "Passive"
            }]}
            placeholder="Filter Tipe DF"
            value={defaultValue}
            onChange={(val) => handleChangeWilayah(val as string)}
        />
    )
}