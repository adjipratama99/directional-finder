import * as XLSX from "xlsx";
import { Report } from "@/types/general";

type ExportType = "xlsx" | "csv";

export function exportReportData(
    report: Report,
    fileName: string = "report",
    type: ExportType = "xlsx"
) {
    if (!report) return;

    const dfRows: any[] = [];
    const invRows: any[] = [];

    report.data_user.forEach((df) => {
        const wilayah = df.detail_wilayah;
        df.perangkat_df.forEach((item) => {
            dfRows.push({
                "Wilayah": wilayah.wilayah,
                "Satuan Wilayah": wilayah.satuan_wilayah,
                "Nama Satuan": wilayah.nama_satuan,
                "Tipe DF": item.tipe_df,
                "Teknologi": item.teknologi.join(", "),
                "Tahun Pengadaan": item.tahun_pengadaan,
            });
        });
    });

    report.data_inventory.forEach((inv) => {
        const wilayah = inv.detail_wilayah;
        inv.inventory.forEach((item) => {
            invRows.push({
                "Wilayah": wilayah.wilayah,
                "Satuan Wilayah": wilayah.satuan_wilayah,
                "Nama Satuan": wilayah.nama_satuan,
                "Nama": item.nama,
                "Keterangan": item.keterangan,
                "Kondisi": item.kondisi_perangkat,
                "Satuan Kerja": item.satuan_kerja,
                "Tahun Pengadaan": item.tahun_pengadaan,
                "Tipe DF": item.tipe_df,
                "Teknologi": item.teknologi,
            });
        });
    });

    const dfSheet = XLSX.utils.json_to_sheet(dfRows);
    const invSheet = XLSX.utils.json_to_sheet(invRows);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, dfSheet, "Data DF");
    XLSX.utils.book_append_sheet(wb, invSheet, "Data Inventory");

    if (type === "csv") {
        const csv = XLSX.utils.sheet_to_csv(dfSheet) + "\n\n" + XLSX.utils.sheet_to_csv(invSheet);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    }
}
