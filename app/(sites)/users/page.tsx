"use client"

import TitleSection from "@/components/custom/title-section";
import { GET_USER_LIST } from "@/constant/app";
import React, { useCallback, useState } from "react";
import { columnsUser } from "./_components/columns";
import { ServerTable } from "@/components/custom/table";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import useTableResponse from "@/hooks/useTableResponse";
import { ColumnDef } from "@tanstack/react-table";
import { Modal } from "@/components/custom/modal";
import ModlaAddUser from "./_components/modal-add-user";

type filterType = {
    search?: string;
}

export default function Users(): React.JSX.Element {
    const rowEachPage = 10
    const [sort, setSort] = useState<object>({})
    const [open, setOpen] = useState<boolean>(false)
    const [filters, setFilter] = useState<filterType>({ search: "" })

    const {
        data,
        isLoading,
        onPaginationChange,
        pagination
    } = useTableResponse({
        rowEachPage,
        queryKey: [GET_USER_LIST, sort, filters],
        params: {
            ...(Object.keys(sort).length && { sort: sort as { [key: string]: number } }),
            ...((Object.keys(filters).length || filters?.search) && { filters: filters as { [key: string]: string } })
        },
        url: "/api/user?type=get"
    })

    const handleSearch = useCallback((search: string) => {
        setFilter({ search })
    }, [])

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <TitleSection title="Management User" />
                <Modal
                    open={open}
                    className="sm:max-w-[450px]"
                    onOpenChange={setOpen}
                    title="Add User"
                    trigger={<Button type="button"><FaPlus />Add User</Button>}
                    content={<ModlaAddUser onClose={setOpen} />}
                />
            </div>
            <ServerTable
                columns={columnsUser as ColumnDef<object, any>[]}
                data={data?.content?.results}
                total={data?.content?.count}
                pagination={pagination}
                pageCount={Math.ceil(data?.content?.count / rowEachPage)}
                onPaginationChange={onPaginationChange}
                onSortChange={({ key, desc }) => {
                    setSort({[key]: desc ? -1 : 1})
                }}
                onSearch={handleSearch}
                isLoading={isLoading}
            />
        </div>
    )
}