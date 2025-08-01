import { Button } from "@/components/ui/button";
import { UPDATE_STATUS_DATA } from "@/constant/app";
import { useCustomQuery } from "@/hooks/useQueryData";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import Confirmation from "../confirmation";
import { fetchPost } from "@/lib/Fetcher";

type UpdateStatusType = {
    type: string;
    params: {[key: string]: (string|number)};
    status?: number;
    pureDelete?: boolean;
    constantType: string;
}

export default function UpdateStatus({ type, params, status, pureDelete, constantType }: UpdateStatusType): React.JSX.Element {
    const query = useQueryClient()
    const [active, setActive] = useState<boolean>(false)

    const { isLoading } = useCustomQuery({
        url: `/api/${ type }?type=update`,
        params,
        queryKey: [UPDATE_STATUS_DATA, params],
        callbackResult: (data) => {
            setActive(false)
            if(data?.code === 0) {
                query.invalidateQueries({ queryKey: [constantType] })
            }

            return data;
        },
        enabled: active
    })

    const handleDelete = async () => {
        setActive(true)

        const response = await fetchPost({
            url: `/api/${ type }?type=update`,
            body: {...params, status: -1}
        })
        
        setActive(false)

        if(response?.code === 0) {
            query.invalidateQueries({ queryKey: [constantType] })
        } else {
            toast.warning(response.message)
        }
    }

    return pureDelete ?
        <Confirmation
            trigger={<Button size="xs" disabled={active || isLoading} variant="destructive" type="button"><FaTrash />Delete</Button>}
            onConfirm={handleDelete}
        />
    :
    status === 1 ? (
        <Button size="xs" disabled={active || isLoading} variant="destructive" onClick={() => setActive(true)}><FaTimes />Disable</Button>
    ) : (
        <div className="flex gap-2 items-center">
            <Button size="xs" disabled={active || isLoading} variant="success" onClick={() => setActive(true)}><FaCheck />Enable</Button>
            <Confirmation
                trigger={<Button size="xs" disabled={active || isLoading} variant="destructive" type="button"><FaTrash />Delete</Button>}
                onConfirm={handleDelete}
            />
        </div>
    )
}