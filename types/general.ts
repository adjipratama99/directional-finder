import { PDFDocumentProxy } from "pdfjs-dist";

export type ResponseMessage<T = any> = {
    message: string;
    content: T | null;
}

export type UploadedFileType = { id: number; file_name: string; uploaded_by: string }

export type DFType = {
    dateCreate?: null | string;
    dateUpdate?: null | string;
    id: number;
    status: number;
    teknologi: string[];
    tipe_df: string;
    nama_satuan: string;
    keterangan?: string;
    tahun_pengadaan: string;
    uploaded_files: UploadedFileType[]
}

export type PDFViewerParams = {
    fileUrl: string;
    initialPage?: number; // ✅ Tambahin ini!
    scale?: number;
    onDocumentLoad?: (pdf: PDFDocumentProxy) => void;
    onPageChange?: (page: number) => void;
    showToolbar?: boolean;
    enableZoom?: boolean;
    enableNavigation?: boolean;
    style?: React.CSSProperties;
};

export interface PerangkatDF {
    tipe_df: string;
    teknologi: string[];
    tahun_pengadaan: string;
}

export interface DetailWilayah {
    id: number;
    wilayah: string;
    satuan_wilayah: string;
    nama_satuan: string;
}

export interface Inventory {
    nama: number;
    keterangan: string;
    kondisi_perangkat: string;
    satuan_kerja: string;
    tahun_pengadaan: string;
    tipe_df: string;
    teknologi: string[];
}

export interface ReportDataDF {
    detail_wilayah: DetailWilayah;
    perangkat_df: PerangkatDF[];
}

export interface ReportDataInventory {
    detail_wilayah: DetailWilayah;
    inventory: Inventory[];
}

export interface Report {
    data_user: ReportDataDF[];
    data_inventory: ReportDataInventory[];
}