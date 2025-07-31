import UpdateStatus from "@/components/custom/update-status";
import { Badge } from "@/components/ui/badge";
import { GET_INVENTORY_LIST } from "@/constant/app";
import { Inventory } from "@/models/inventory.model";
export type InventoryAttributes = InferAttributes<Inventory>;
export type InventoryCreationAttributes = InferCreationAttributes<Inventory>;
import { ColumnDef } from "@tanstack/react-table";
import { formatInTimeZone } from "date-fns-tz";
import { InferAttributes, InferCreationAttributes } from "sequelize";

export const columnsUser: ColumnDef<Inventory>[] = [
    {
        accessorKey: "dateCreate",
        header: "Created At",
        cell: (prop) => formatInTimeZone(new Date(prop.getValue() as string), 'UTC', 'yyyy-MM-dd HH:mm:ss')
    },
    {
        accessorKey: "nama",
        header: "Nama Barang",
    },
    {
        accessorKey: "tahun_pengadaan",
        header: "Tahun Pengadaan",
    },
    {
        accessorKey: "tipe_df",
        header: "Tipe DF",
    },
    {
        accessorKey: "teknologi",
        header: "Teknologi",
        cell: (prop) => {
            const data = prop.getValue() as string[];
            return (
                <ul>
                    {
                        data && data.map(d => (
                            <li className="list-decimal uppercase" key={d}>{ d }</li>
                        ))
                    }
                </ul>
            )
        }
    },
    {
        accessorKey: "satuan_kerja",
        header: "Satuan Kerja",
    },
    {
        accessorKey: "keterangan",
        header: "Keterangan",
        cell: (prop) => <div className="text-wrap max-w-[200px]">{ prop.getValue() as string }</div>
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: (prop) => {
            return parseInt(prop.getValue() as string) === 1 ? <Badge>Active</Badge> : <Badge variant="destructive">Inactive</Badge>
        }
    },
    {
        accessorKey: "id",
        header: "Action",
        cell: (prop) => {
            const params = {
                id: prop.getValue() as number
            }

            return <UpdateStatus params={params} pureDelete type="inventory" constantType={GET_INVENTORY_LIST} />
        }
    },
];
