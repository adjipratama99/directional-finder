"use client"

import TitleSection from "@/components/custom/title-section";
import { Skeleton } from "@/components/ui/skeleton";
import { GET_DF_LIST, GET_SATUAN_KERJA_LIST } from "@/constant/app";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import CardDF from "./_components/card-df";
import { Input } from "@/components/ui/input";
import useDebounceValue from "@/hooks/useDebounceValue";
import { Modal } from "@/components/custom/modal";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import ModalRequestDF from "./_components/modal-request-df";
import { useSession } from "next-auth/react";
import { Select } from "@/components/custom/form/select";
import { useCustomQuery } from "@/hooks/useQueryData";
import useLoadMore from "@/hooks/useLoadMore";
import { useInView } from "react-intersection-observer";

type filterType = {
    search?: string;
    status?: number | string;
    wilayah?: string;
}

export default function Dashboard(): React.JSX.Element {
    const { ref, inView } = useInView()
    const { data: session } = useSession()
    const rowEachPage = 36
    const [isOpen, setOpen] = useState<boolean>(false)
    const [sort, setSort] = useState<object>({ dateCreate: -1 })
    const [search, setSearch] = useState<string>("")
    const [filters, setFilter] = useState<filterType>({ search })

    const debounceValue = useDebounceValue(search);

    useEffect(() => {
        setFilter(prev => ({...prev,  search: debounceValue }));
    }, [debounceValue])

    const {
        isLoading,
        isFetching,
        data,
        error,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useLoadMore({
        queryKey: [GET_DF_LIST, sort, filters.search as string, filters.status as string, filters.wilayah as string],
        rowEachPage,
        url: "/api/df?type=get",
        addParams: {
            ...(Object.keys(sort).length && { sort: sort as { [key: string]: number } }),
            ...((Object.keys(filters).length || filters?.search) && { filters: filters as { [key: string]: string } }),
            isFile: true
        }
    })

    useEffect(() => {
        if (inView) fetchNextPage()
    }, [fetchNextPage, inView])

    const loading = useMemo(() => Array.from({ length: 4 }), [])

    const handleStatusChange = (val: string) => {
        if(val !== "all") {
            setFilter(prev => ({ ...prev, status: parseInt(val as string) }))
        } else {
            setFilter(prev => ({ ...prev, status: "" }))
        }
    }

    const handleWilayahChange = (val: string) => {
        if(val !== "all") {
            setFilter(prev => ({ ...prev, wilayah: val as string }))
        } else {
            setFilter(prev => ({ ...prev, wilayah: "" }))
        }
    }

    const { data: dataWilayah, isLoading: loadingWilayah } = useCustomQuery({
        url: "/api/satuan-wilayah?type=get",
        queryKey: [GET_SATUAN_KERJA_LIST],
        params: { isUnique: true },
        callbackResult(res) {
            if(res?.code === 0) {
                if(res?.content?.count) {
                    let results = [{ value: "all", text: "ALL" }]
                    results = [...results, ...res?.content?.results.map(d => ({ value: d, text: d }))]
                    return results;
                }
            }

            return []
        },
    })

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center flex-col md:flex-row gap-4 md:w-[600px] w-full">
                    <TitleSection title="Permintaan" />
                    <div className="w-full md:max-w-md sm:max-w-[450px]">
                        <div className="flex items-center gap-4">
                            <Input
                                type="text"
                                placeholder="Masukkan kata kunci ..."
                                className="w-full bg-white min-w-[150px] md:min-w-auto"
                                onChange={(e) => setSearch(e.target.value)}
                                value={search}
                            />
                            <Select
                                options={[{
                                    value: "all",
                                    text: "Semua Status"
                                },{
                                    value: "1",
                                    text: "Diminta"
                                },{
                                    value: "2",
                                    text: "Disetujui"
                                },{
                                    value: "3",
                                    text: "Ditolak"
                                }]}
                                value={filters?.status ? String(filters?.status) : "all"}
                                placeholder="Pilih status"
                                onChange={(val) => handleStatusChange(val as string)}
                            />
                            {
                                (!loadingWilayah && session?.user.role === "admin") && (
                                    <Select
                                        options={dataWilayah ?? []}
                                        placeholder="Pilih Wilayah"
                                        value={filters?.wilayah ? String(filters?.wilayah) : "all"}
                                        disabled={loadingWilayah || !dataWilayah}
                                        onChange={(val) => handleWilayahChange(val as string)}
                                    />
                                )
                            }
                        </div>
                    </div>
                </div>
                {
                    session?.user?.role !== "admin" && (
                        <Modal
                            open={isOpen}
                            onOpenChange={setOpen}
                            title="Request DF"
                            trigger={<Button type="button"><FaPlus />Request DF</Button>}
                            content={<ModalRequestDF onClose={setOpen} />}
                        />
                    )
                }
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
                {data && data?.pages && (
                    data.pages.map((page, index) => (
                        <Fragment key={page.nextId}>
                            {page.data.map((v) => (
                                <CardDF data={v} key={v.id} />
                            ))}
                        </Fragment>
                    ))
                )}
            </div>
            <div ref={ref} className="text-center mt-7 mb-4 grid grid-cols-4 gap-4">
            { hasNextPage && loading.map((i, v) => (
                    <div className="w-full h-[150px] rounded-lg" key={v}>
                        <Skeleton className="w-full h-full" key={v} />
                    </div>
                )) }
            </div>
            {!isFetching && (error || (!isFetchingNextPage && !hasNextPage && data?.pages.length === 1 && data?.pages[0]?.data?.length === 0)) ?
                <div className="col-span-4 text-center italic">- Data not Available -</div>
            : null}
        </div>
    )
}