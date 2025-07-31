"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type {
  Report,
  ReportDataDF,
  ReportDataInventory,
} from "@/types/general";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { FaDownload, FaFileExcel, FaFilePdf, FaTimes } from "react-icons/fa";
import { Select } from "../form/select";
import { formatInTimeZone } from "date-fns-tz";
import Confirmation from "../confirmation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { exportReportData } from "@/hooks/useExport";

type Props = {
  data: Report;
  dataWilayah: { [key: string]: string | boolean }[];
  loadingWilayah: boolean;
  filter: string;
  dataSelected: (ReportDataDF | ReportDataInventory)[];
  onChangeDataSelected: React.Dispatch<
    React.SetStateAction<(ReportDataDF | ReportDataInventory)[]>
  >;
  onChangeFilter: React.Dispatch<React.SetStateAction<string>>;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onClearData: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PDFClient({
  data,
  dataWilayah,
  loadingWilayah,
  onClearData,
  onChangeFilter,
  dataSelected,
  onChangeDataSelected,
  onOpenChange,
}: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isFirstSort, setFirstSort] = useState<boolean>(true);
  const [options, setOptions] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);

  useEffect(() => {
    if (isFirstSort) {
      const combined = [
        ...(data?.data_user || []),
        ...(data?.data_inventory || []),
      ];

      const existData = combined.map((d) => ({
        value: d.detail_wilayah.id,
        text: d.detail_wilayah.nama_satuan,
      }));

      if (existData.length && dataWilayah && dataWilayah.length) {
        let uniqueWilayah = [...new Set(dataWilayah)];
        let newDataWilayah = uniqueWilayah.map((d) => {
          let newData = { ...d };
          for (let i = 0; i < existData.length; i++) {
            let data = existData[i];
            if (data.text === d.text) {
              newData["exist"] = true;
            }
          }
          return newData;
        });

        setOptions(newDataWilayah);
      }

      setFirstSort(false);
    }
  }, [isFirstSort, data, dataWilayah]);

  const downloadPdf = async () => {
    if (!printRef.current) return;
  
    const sections = printRef.current.querySelectorAll(".pdf-section");
    const pdf = new jsPDF("p", "pt", "a4");
  
    for (let i = 0; i < sections.length; i++) {
      const canvas = await html2canvas(sections[i] as HTMLElement, {
        scale: 2,
        useCORS: true,
      });
  
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }
  
    pdf.save(
      `${formatInTimeZone(
        new Date(),
        "UTC",
        "yyyy-MM-dd HH:mm:ss"
      )}-DF-Report.pdf`
    );
  };

  const handleSatuanWilayah = (val: string[]) => {
    setSelectedOption(val);
    const value = val[val.length - 1];

    if (value) {
      onChangeFilter(value);
    } else {
      onChangeDataSelected([]);
    }
  };

  const handleClearData = () => {
    setSelectedOption([]);
    onChangeFilter("");
    onChangeDataSelected([]);
    setSelectedOption([]);
  };

  const confirmChangeSourceData = () => {
    onClearData(true);
    handleClearData();
    onOpenChange(true);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 px-4 justify-between">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button">
                <FaDownload className="mr-2" />
                Export to Document
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <div
                    onClick={downloadPdf}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer transition-colors duration-300 ease-in-out",
                      "hover:text-gray-400"
                    )}
                  >
                    <FaFilePdf className="mr-2" />
                    Download PDF
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="w-[188px]">
                  <div
                    onClick={() => exportReportData(data)}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer transition-colors duration-300 ease-in-out",
                      "hover:text-gray-400"
                    )}
                  >
                    <FaFileExcel className="mr-2" />
                    Download XLSX
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {options && (
            <Select
              options={[...options].sort(
                (a, b) => (b.exist ? 1 : 0) - (a.exist ? 1 : 0)
              )}
              isMulti
              value={selectedOption}
              disabled={loadingWilayah}
              onChange={(val) => handleSatuanWilayah(val as string[])}
              placeholder="Pilih Satuan Wilayah"
              disableDataNotExist
              getOptionLabel={(option) => option.text}
              getOptionValue={(option) => option.value}
              classNames={{
                option: ({ data, isSelected }) =>
                  `cursor-pointer ${
                    data.exist
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  } ${isSelected ? "bg-primary/10" : ""}`,
                multiValueLabel: () => "text-primary font-medium",
              }}
            />
          )}
          {dataSelected && dataSelected.length ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearData}
              disabled={!dataSelected.length}
            >
              <FaTimes className="mr-2" />
              Clear Data
            </Button>
          ) : (
            ""
          )}
        </div>
        {dataSelected.length ? (
          <Confirmation
            trigger={
              <Button className="outline" type="button">
                Pilih Sumber Data
              </Button>
            }
            title="Konfirmasi"
            message="Yakin ingin mengubah sumber data ? Data yang sudah tampil akan terhapus."
            onConfirm={() => confirmChangeSourceData()}
          />
        ) : (
          <Button
            className="outline"
            type="button"
            onClick={() => onOpenChange(true)}
          >
            Pilih Sumber Data
          </Button>
        )}
      </div>

      <div className="flex justify-center max-h-full overflow-y-scroll mt-4">
        {dataSelected && dataSelected.length ? (
          <div
            ref={printRef}
            className="bg-white text-black font-sans text-[14px] p-8 w-full max-w-[800px] col-span-2 space-y-12"
          >
            {/* Pisahin berdasarkan jenis data */}
            {(dataSelected as ReportDataDF[]).filter((w) => (w.perangkat_df)?.length).length > 0 && (
              <div className="pdf-section px-4 pt-4">
                <h1 className="text-xl font-bold text-center mb-6">
                  Pengajuan Kebutuhan Alat Directional Finder
                </h1>

                {(dataSelected as ReportDataDF[])
                  .filter((w) => w.perangkat_df?.length)
                  .map((wilayah, idx) => (
                    <div
                      key={`pengajuan-${idx}`}
                      className="mb-8 border border-gray-300 rounded-md shadow-sm p-4"
                    >
                      <h2 className="text-lg font-semibold">
                        {wilayah.detail_wilayah.nama_satuan}
                      </h2>
                      <p className="text-gray-600 italic mb-2">
                        {wilayah.detail_wilayah.satuan_wilayah} -{" "}
                        {wilayah.detail_wilayah.wilayah}
                      </p>

                      <table className="w-full border border-gray-300 text-sm table-fixed mb-4">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="border border-gray-300 p-2 w-1/4">
                              Tipe DF
                            </th>
                            <th className="border border-gray-300 p-2 w-1/2">
                              Teknologi
                            </th>
                            <th className="border border-gray-300 p-2 w-1/4">
                              Tahun Pengadaan
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {wilayah.perangkat_df.map((df, i) => (
                            <tr key={i}>
                              <td className="border border-gray-300 p-2 uppercase align-top break-words">
                                {df.tipe_df}
                              </td>
                              <td className="border border-gray-300 p-2 uppercase align-top break-words">
                                <ul className="list-disc pl-5">
                                  {df.teknologi.map((tech, j) => (
                                    <li key={j}>{tech.trim()}</li>
                                  ))}
                                </ul>
                              </td>
                              <td className="border border-gray-300 p-2 uppercase align-top break-words">
                                {df.tahun_pengadaan}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
              </div>
            )}

            {(dataSelected as ReportDataInventory[]).filter((w) => w.inventory?.length).length > 0 && (
              <div className="pdf-section px-4 pt-4">
                <h1 className="text-xl font-bold text-center mb-6">
                  Monitoring Kondisi Perangkat Directional Finder (DF)
                </h1>

                {(dataSelected as ReportDataInventory[])
                  .filter((w) => w.inventory?.length)
                  .map((wilayah, idx) => (
                    <div
                      key={`inventory-${idx}`}
                      className="mb-8 border border-gray-300 rounded-md shadow-sm p-4"
                    >
                      <h2 className="text-lg font-semibold">
                        {wilayah.detail_wilayah.nama_satuan}
                      </h2>
                      <p className="text-gray-600 italic mb-2">
                        {wilayah.detail_wilayah.satuan_wilayah} -{" "}
                        {wilayah.detail_wilayah.wilayah}
                      </p>

                      <table className="w-full border border-gray-300 text-sm table-fixed mb-4">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="border border-gray-300 p-2">Nama</th>
                            <th className="border border-gray-300 p-2">
                              Keterangan
                            </th>
                            <th className="border border-gray-300 p-2">
                              Kondisi
                            </th>
                            <th className="border border-gray-300 p-2">
                              Tahun
                            </th>
                            <th className="border border-gray-300 p-2">Tipe</th>
                            <th className="border border-gray-300 p-2">
                              Teknologi
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {wilayah.inventory.map((item, i) => (
                            <tr key={i}>
                              <td className="border border-gray-300 p-2">
                                {item.nama}
                              </td>
                              <td className="border border-gray-300 p-2 whitespace-pre-line">
                                {item.keterangan}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {item.kondisi_perangkat}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {item.tahun_pengadaan}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {item.tipe_df}
                              </td>
                              <td className="border border-gray-300 p-2">
                                <ul className="list-disc pl-4">
                                  {Array.isArray(item.teknologi)
                                    ? item.teknologi.map((tech, j) => (
                                        <li key={j}>{tech}</li>
                                      ))
                                    : item.teknologi}
                                </ul>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ) : (
          <div className="italic text-gray-400 text-2xl sm:text-3xl md:text-4xl">
            Pilih satuan wilayah terlebih dahulu
          </div>
        )}
      </div>
    </div>
  );
}
