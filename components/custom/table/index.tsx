"use client";

import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    SortingState,
    PaginationState,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { ServerTableProps } from "@/types/column";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import useDebounceValue from "@/hooks/useDebounceValue";

export function ServerTable<T>({
    columns,
    data,
    pageCount,
    total,
    isLoading = false,
    pagination,
    onPaginationChange,
    onPageChange,
    onSortChange,
    onSearch,
}: ServerTableProps<T>) {
    const [pageIndex, setPageIndex] = useState(0);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");

    const debounceValue = useDebounceValue(search)

    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: {
            pagination: {
                pageIndex,
                pageSize: pagination?.pageSize ?? 10,
            },
            sorting,
        },
        manualPagination: true,
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: (updater) => {
            const newSorting = typeof updater === "function" ? updater(sorting) : updater;
            setSorting(newSorting);
            if (onSortChange && newSorting[0]) {
                onSortChange({
                    key: newSorting[0].id,
                    desc: newSorting[0].desc,
                });
            }
        },
        onPaginationChange: (updaterOrValue) => {
            const newPagination = typeof updaterOrValue === "function"
                ? updaterOrValue({ pageIndex, pageSize: pagination?.pageSize ?? 10 })
                : updaterOrValue;
            setPageIndex(newPagination.pageIndex);
            onPaginationChange?.(newPagination);
        }
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
    };

    useEffect(() => {
        if (onSearch) onSearch(debounceValue);
    }, [debounceValue, onSearch]);
    

    return (
        <div className="w-full overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search..."
                    className="border p-2 rounded-md w-full max-w-sm"
                />
            </div>

            <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                    className="text-left p-3 cursor-pointer select-none whitespace-nowrap"
                                >
                                    <div className="flex items-center gap-2">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {{
                                            asc: <FaArrowUp />,
                                            desc: <FaArrowDown />,
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-6">
                                Loading...
                            </td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="border-t">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="p-3 whitespace-nowrap">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                    Showing page {pageIndex + 1} of {pageCount}
                </div>
                <div className="space-x-2">
                    <button
                        onClick={() => {
                            const newPage = Math.max(pageIndex - 1, 0);
                            setPageIndex(newPage);
                            onPaginationChange?.({ pageIndex: newPage, pageSize: pagination?.pageSize ?? 10 });
                        }}
                        disabled={pageIndex === 0}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        onClick={() => {
                            const newPage = pageIndex + 1;
                            setPageIndex(newPage);
                            onPaginationChange?.({ pageIndex: newPage, pageSize: pagination?.pageSize ?? 10 });
                        }}
                        disabled={pageIndex + 1 >= pageCount}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
