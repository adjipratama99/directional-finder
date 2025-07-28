import { ColumnDef, PaginationState } from "@tanstack/react-table";

export interface ServerTableProps<T> {
    columns: ColumnDef<T, any>[];
    data: T[];
    pageCount: number;
    total: number;
    isLoading?: boolean;
    pagination: PaginationState;
    onPageChange?: (pageIndex: number) => void;
    onPaginationChange: ({ pageIndex, pageSize }: PaginationState) => void;
    onSortChange?: (sort: { key: string; desc: boolean }) => void;
    onSearch?: (search: string) => void;
}
