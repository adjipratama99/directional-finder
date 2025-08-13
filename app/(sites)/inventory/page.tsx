"use client"

import TitleSection from "@/components/custom/title-section";
import { GET_INVENTORY_LIST } from "@/constant/app";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { Modal } from "@/components/custom/modal";
import ModalAddItem from "./_components/modal-add-item";
import useLoadMore from "@/hooks/useLoadMore";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import CardInventory from "./_components/card-inventory";
import FilterSatuanKerja from "./_components/filter-satuan-kerja";
import FilterTahunPengadaan from "./_components/filter-tahun-pengadaan";
import FilterWilayah from "./_components/filter-wilayah";
import FilterTipeDF from "./_components/filter-tipe-df";

type filterType = {
    search?: string;
    satuan_kerja?: string;
    tipe_df?: string;
    tahun_pengadaan?: string;
    wilayah?: string;
}

export default function Users(): React.JSX.Element {
    const { ref, inView } = useInView()
    const rowEachPage = 16
    const [sort, setSort] = useState<object>({})
    const [open, setOpen] = useState<boolean>(false)
    const [filters, setFilter] = useState<filterType>({ search: "" })

    const handleSearch = useCallback((search: string) => {
        setFilter({ search })
    }, [])

    const {
        isLoading,
        isFetching,
        data,
        error,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useLoadMore({
        queryKey: [GET_INVENTORY_LIST, sort, filters],
        rowEachPage,
        url: "/api/inventory?type=get",
        addParams: {
            ...(Object.keys(sort).length && { sort: sort as { [key: string]: number } }),
            ...((Object.keys(filters).length || filters?.search) && { filters: filters as { [key: string]: string } })
        }
    })

    useEffect(() => {
        if (inView) fetchNextPage()
    }, [fetchNextPage, inView])

    const loading = useMemo(() => Array.from({ length: 4 }), [])

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <TitleSection title="Inventaris" />
                    <div className="md:flex items-center gap-4 hidden">
                        <FilterSatuanKerja onChangeFilter={setFilter} filter={filters?.satuan_kerja || ""} />
                        <FilterWilayah onChangeFilter={setFilter} filter={filters?.wilayah || ""} />
                        <FilterTahunPengadaan onChangeFilter={setFilter} filter={filters?.tahun_pengadaan || ""} />
                        <FilterTipeDF onChangeFilter={setFilter} filter={filters?.tipe_df || ""} />
                    </div>
                </div>
                <Modal
                    open={open}
                    className="sm:max-w-[500px]"
                    onOpenChange={setOpen}
                    title="Tambah Inventaris"
                    trigger={<Button type="button"><FaPlus />Tambah Inventaris</Button>}
                    content={<ModalAddItem onClose={setOpen} />}
                />
            </div>
            <div className="md:hidden items-center gap-4 grid grid-cols-2">
                <FilterSatuanKerja onChangeFilter={setFilter} filter={filters?.satuan_kerja || ""} />
                <FilterWilayah onChangeFilter={setFilter} filter={filters?.wilayah || ""} />
                <FilterTahunPengadaan onChangeFilter={setFilter} filter={filters?.tahun_pengadaan || ""} />
                <FilterTipeDF onChangeFilter={setFilter} filter={filters?.tipe_df || ""} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
                {data && data?.pages && (
                    data.pages.map((page, index) => (
                        <Fragment key={page.nextId}>
                            {page.data.map((v) => (
                                <CardInventory data={v} key={v.id} />
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