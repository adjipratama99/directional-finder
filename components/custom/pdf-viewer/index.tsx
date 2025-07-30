"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ReportData } from "@/types/general";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { FaDownload, FaTimes } from "react-icons/fa";
import { Select } from "../form/select";
import { formatInTimeZone } from "date-fns-tz";

type Props = {
  data: ReportData[];
  dataWilayah: { [key: string]: (string|boolean) }[];
  loadingWilayah: boolean;
  filter: string;
  dataSelected: ReportData[];
  onChangeDataSelected: React.Dispatch<React.SetStateAction<ReportData[]>>;
  onChangeFilter: React.Dispatch<React.SetStateAction<string>>;
};

export default function PDFClient({ 
  data, 
  dataWilayah, 
  loadingWilayah, 
  onChangeFilter,
  dataSelected,
  onChangeDataSelected
}: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const [options, setOptions] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState<string[]>([])

  useEffect(() => {
    let existData = data.map((d) => ({
        value: d.detail_wilayah.id,
        text: d.detail_wilayah.nama_satuan,
    }))
    
    if(existData.length && (dataWilayah && dataWilayah.length)) {
      let uniqueWilayah = [...new Set(dataWilayah)]
      let newDataWilayah = uniqueWilayah.map(d => {
        let newData = {...d};
        for(let i=0; i < existData.length; i++) {
          let data = existData[i]

          if(data.text === d.text) {
            newData['exist'] = true;
          }
        }

        return newData;
      })

      setOptions(newDataWilayah)
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
    pdf.save(`${ formatInTimeZone(new Date(), 'UTC', 'yyyy-MM-dd HH:mm:ss') }-DF-Report.pdf`);
  };

  const handleSatuanWilayah = (val: string) => {
    const value = Array.isArray(val) ? val[val.length - 1] : val
    setSelectedOption(prev => ([...prev, value]))
    onChangeFilter(value)
  };

  const handleClearData = () => {
    onChangeDataSelected([])
    setSelectedOption([])
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 px-4">
        <Button onClick={downloadPdf}>
          <FaDownload className="mr-2" />
          Download PDF
        </Button>
        {
          options && (
            <Select
              options={options}
              isMulti
              searchable
              value={selectedOption}
              disabled={loadingWilayah}
              onChange={(val) => handleSatuanWilayah(val as string)}
              placeholder="Pilih Satuan Wilayah"
            />
          )
        }
        {
          dataSelected && dataSelected.length ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearData}
              disabled={!dataSelected.length}
            >
              <FaTimes className="mr-2" />
              Clear Data
            </Button>
          ) : ""
        }
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

                <table className="w-full border border-gray-300 text-sm table-fixed">
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
        ) : (
          <div className="italic text-gray-400 text-2xl sm:text-3xl md:text-4xl">Pilih satuan wilayah terlebih dahulu</div>
        )}
      </div>
    </div>
  );
}
