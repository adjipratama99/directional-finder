"use client"

import React from "react";
import usePagination from "./usePagination";
import { useCustomQuery } from "./useQueryData";

type TableResponseType = {
    rowEachPage: number;
    queryKey: (string|number|object)[];
    params: {
        [key: string]: string | object | number | boolean;
    },
    url: string;
}

type TableResponseHooksType = {
    data: {
        code: number;
        content: {
            count: number;
            results: object[]
        },
        message: string;
    };
    onPaginationChange: React.Dispatch<React.SetStateAction<{
        pageIndex: number;
        pageSize: number;
    }>>;
    pagination: {
        pageIndex: number;
        pageSize: number;
    }
    isLoading: boolean
}

export default function useTableResponse({
    rowEachPage,
    queryKey,
    params,
    url
}: TableResponseType): TableResponseHooksType {
    const {
        offset,
        limit,
        onPaginationChange,
        pagination
    } = usePagination(rowEachPage)

    const { data, isLoading } = useCustomQuery({
        queryKey: [...queryKey, offset, limit],
        params: {...params, offset, limit},
        url
    })

    return {
        data,
        isLoading,
        onPaginationChange,
        pagination
    }
}