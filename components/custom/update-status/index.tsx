import { Button } from "@/components/ui/button";
import { UPDATE_STATUS_DATA } from "@/constant/app";
import { useCustomQuery } from "@/hooks/useQueryData";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

type UpdateStatusType = {
    type: string;
    params: {
        status: number;
        id: number;
    };
    status: number;
    constantType: string;
}

export default function UpdateStatus({ type, params, status, constantType }: UpdateStatusType): React.JSX.Element {
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
                toast.success(data.message)
            }

            return data;
        },
        enabled: active
    })

    return (
        <Button disabled={active || isLoading} onClick={() => setActive(true)}>{ status === 1 ? "Disable" : "Enabled" }</Button>
    )
}