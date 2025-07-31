"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Report, ReportDataDF, ReportDataInventory } from "@/types/general";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { FaDownload, FaTimes } from "react-icons/fa";
import { Select } from "../form/select";
import { formatInTimeZone } from "date-fns-tz";

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
};

export default function PDFClient({
  data,
  dataWilayah,
  loadingWilayah,
  onChangeFilter,
  dataSelected,
  onChangeDataSelected,
}: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const [options, setOptions] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);

  useEffect(() => {
    const combined = [...(data?.data_user || []), ...(data?.data_inventory || [])];
  
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
      
      console.log(newDataWilayah)
  
      setOptions(newDataWilayah);
    }
  }, [data, dataWilayah]);

  const downloadPdf = async () => {
    if (!printRef.current) return;

    const element = printRef.current;
    const canvas = await html2canvas(element, {
      scale: 2, // opsional: buat tajam
      width: 800, // sesuai yang di HTML
      scrollY: -window.scrollY,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4"); // ukuran A4: 595.28 x 841.89 pt

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(
      `${formatInTimeZone(
        new Date(),
        "UTC",
        "yyyy-MM-dd HH:mm:ss"
      )}-DF-Report.pdf`
    );
  };

  const handleSatuanWilayah = (val: string[]) => {
    let value: string = (Array.isArray(val)) ? val[val.length - 1] : val;

    setSelectedOption(val);
    
    if(value) {
      onChangeFilter(value);
    } else {
      onChangeDataSelected([]);
    }
  };

  const handleClearData = () => {
    onChangeDataSelected([]);
    setSelectedOption([]);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 px-4">
        <Button onClick={downloadPdf}>
          <FaDownload className="mr-2" />
          Download PDF
        </Button>
        {options && (
          <Select
            options={options}
            isMulti
            value={selectedOption}
            disabled={loadingWilayah}
            onChange={(val) => handleSatuanWilayah(val as string[])}
            placeholder="Pilih Satuan Wilayah"
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

      <div className="flex justify-center max-h-full overflow-y-scroll mt-4">
        {dataSelected && dataSelected.length ? (
          <div
            ref={printRef}
            className="bg-white text-black font-sans text-[14px] p-8 w-full max-w-[800px] col-span-2"
          >
            <h1 className="text-xl font-bold text-center mb-6">Laporan DF</h1>

            {dataSelected.map((wilayah, idx) => (
                <div
                  key={idx}
                  className="mb-8 border border-gray-300 rounded-md shadow-sm p-4"
                >
                  <h2 className="text-lg font-semibold">
                    {wilayah.detail_wilayah.nama_satuan}
                  </h2>
                  <p className="text-gray-600 italic mb-2">
                    {wilayah.detail_wilayah.satuan_wilayah} -{" "}
                    {wilayah.detail_wilayah.wilayah}
                  </p>

                  {("perangkat_df" in wilayah && wilayah.perangkat_df?.length > 0) ? (
                    <table className="w-full border border-gray-300 text-sm table-fixed mb-4">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="border border-gray-300 p-2 w-1/4">Tipe DF</th>
                          <th className="border border-gray-300 p-2 w-1/2">Teknologi</th>
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
                  ) : "perangkat_df" in wilayah && (
                    <div className="flex items-center justify-center italic text-gray-300">
                      <div className="text-xl">Tidak ada pengadaan yang disetujui</div>
                    </div>
                  )}

                  {("inventory" in wilayah && wilayah.inventory?.length > 0) ? (
                    <table className="w-full border border-gray-300 text-sm table-fixed mb-4">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="border border-gray-300 p-2">Nama</th>
                          <th className="border border-gray-300 p-2">Keterangan</th>
                          <th className="border border-gray-300 p-2">Kondisi</th>
                          <th className="border border-gray-300 p-2">Tahun</th>
                          <th className="border border-gray-300 p-2">Tipe</th>
                          <th className="border border-gray-300 p-2">Teknologi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wilayah.inventory.map((item, i) => (
                          <tr key={i}>
                            <td className="border border-gray-300 p-2">{item.nama}</td>
                            <td className="border border-gray-300 p-2 whitespace-pre-line">
                              {item.keterangan}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {item.kondisi_perangkat}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {item.tahun_pengadaan}
                            </td>
                            <td className="border border-gray-300 p-2">{item.tipe_df}</td>
                            <td className="border border-gray-300 p-2">
                              <ul className="list-disc pl-4">
                                {Array.isArray(item.teknologi)
                                  ? item.teknologi.map((tech, j) => <li key={j}>{tech}</li>)
                                  : item.teknologi}
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : "inventory" in wilayah && (
                    <div className="flex items-center justify-center italic text-gray-300">
                      <div className="text-xl">Tidak ada inventory yang dibuat untuk wilayah ini.</div>
                    </div>
                  )}
                </div>
              ))}
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
