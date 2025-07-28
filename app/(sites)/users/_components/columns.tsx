import UpdateStatus from "@/components/custom/update-status";
import { Badge } from "@/components/ui/badge";
import { GET_USER_LIST } from "@/constant/app";
import { User } from "@/entities/User";
import { ColumnDef } from "@tanstack/react-table";

export const columnsUser: ColumnDef<User>[] = [
    {
        accessorKey: "dateCreate",
        header: "Created At",
    },
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: (prop) => {
            return parseInt(prop.getValue() as string) === 1 ? <Badge>Active</Badge> : <Badge variant="destructive">Inactive</Badge>
        }
    },
    {
        accessorKey: "dateUpdate",
        header: "Last Update",
    },
    {
        accessorKey: "satuan_wilayah",
        header: "Satuan Wilayah",
    },
    {
        accessorKey: "wilayah",
        header: "Wilayah",
    },
    {
        accessorKey: "nama_satuan",
        header: "Nama Satuan",
    },
    {
        accessorKey: "id",
        header: "Action",
        cell: (prop) => {
            const params = {
                id: prop.getValue() as number,
                status: prop.row.original.status === 1 ? 0 : 1
            }

            return <UpdateStatus params={params} status={prop.row.original.status!} type="user" constantType={GET_USER_LIST} />
        }
    },
];
