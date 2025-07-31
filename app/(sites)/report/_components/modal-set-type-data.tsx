import { Label } from "@/components/custom/form/label";
import { Select } from "@/components/custom/form/select";
import { Modal } from "@/components/custom/modal";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

type DataTypes = {
    dataTypes: string[];
    onDataChange: React.Dispatch<React.SetStateAction<string[]>>
}

export default function ModalTypeData({ dataTypes, onDataChange }: DataTypes): React.JSX.Element {
    const [open, setOpen] = useState<boolean>(dataTypes.length ? false : true)

    return (
        <Modal
            open={open}
            content={<ModalContent dataTypes={dataTypes} onOpenChange={setOpen} onDataChange={onDataChange} />}
            title="Pilih sumber data"
        />
    )
}

function ModalContent({ dataTypes, onOpenChange, onDataChange }: { dataTypes: string[]; onOpenChange: React.Dispatch<React.SetStateAction<boolean>>; onDataChange: DataTypes["onDataChange"] }) {
    const [selectedData, setSelectedData] = useState<string[]>(dataTypes);

    const handleSubmit = () => {
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