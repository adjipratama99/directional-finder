"use client"

import { Label } from "@/components/custom/form/label";
import { Select } from "@/components/custom/form/select";
import { Modal } from "@/components/custom/modal";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type DataTypes = {
    dataTypes: string[];
    onDataChange: (data: string[]) => void;
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalTypeData({ dataTypes, onDataChange, open, onOpenChange }: DataTypes): React.JSX.Element {
    useEffect(() => {
        onDataChange([])
    }, [])

    return (
        <Modal
            hideX
            open={open}
            content={<ModalContent dataTypes={dataTypes} onOpenChange={onOpenChange} onDataChange={onDataChange} />}
            title="Pilih sumber data"
        />
    )
}

function ModalContent({ dataTypes, onOpenChange, onDataChange }: { dataTypes: string[]; onOpenChange: React.Dispatch<React.SetStateAction<boolean>>; onDataChange: DataTypes["onDataChange"] }) {
    const [selectedData, setSelectedData] = useState<string[]>(dataTypes);

    const handleSubmit = () => {
        if(!selectedData.length) {
            toast.warning("Sumber data belum dipilih.")
            return
        }
        
        onDataChange(selectedData)
        onOpenChange(prev => !prev)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
                <Label isRequired value="Sumber Data" />
                <Select
                    placeholder="Pilih sumber data"
                    options={[{
                        value: "inventory",
                        text: "Inventory"
                    },{
                        value: "df",
                        text: "Permintaan"
                    }]}
                    onChange={(val) => setSelectedData(val as string[])}
                    value={dataTypes}
                    isMulti
                    isModal
                />
            </div>
            <Button type="button" className="w-full" onClick={() => handleSubmit()}>Submit</Button>
        </div>
    )
}