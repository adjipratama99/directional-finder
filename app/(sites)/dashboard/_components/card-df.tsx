import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DFType, UploadedFileType } from "@/types/general";
import { formatInTimeZone } from "date-fns-tz";
import { Modal } from "@/components/custom/modal";
import { FaFilePdf, FaPaperPlane } from "react-icons/fa";
import { Select } from "@/components/custom/form/select";
import { Button } from "@/components/ui/button";
import { fetchPost } from "@/lib/Fetcher";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { GET_DF_LIST } from "@/constant/app";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/custom/form/label";

export default function CardDF({ data }: { data: DFType }): React.JSX.Element {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <Modal
      open={isOpen}
      onOpenChange={setOpen}
      title={`Rincian ${data.tipe_df} oleh ${data.uploaded_files[0].uploaded_by}`}
      trigger={
        <Card
          className={cn(
            "transition-colors duration-300 ease-in-out cursor-pointer",
            "hover:bg-white/30"
          )}
        >
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="capitalize">
              {data.tipe_df} oleh {data.nama_satuan}
            </CardTitle>
            <div className="flex items-center flex-col gap-2">
              {
                data?.tahun_pengadaan && (
                  <div className="text-sm">(TP: { data?.tahun_pengadaan })</div>
                )
              }
              <Badge variant={data.status === 1 ? "default" : data.status === 2 ? "success" : "destructive"}>
                {data.status === 1 ? "Diminta" : data.status === 2 ? "Disetujui" : "Ditolak"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <div className="text-sm text-gray-600">Teknologi:</div>
                <div className="text-sm uppercase">
                  {data.teknologi.join(", ")}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="text-sm text-gray-600">Date Create:</div>
                <div className="text-sm uppercase">
                  {data.dateCreate
                    ? formatInTimeZone(new Date(data.dateCreate), "UTC", "yyyy-MM-dd")
                    : formatInTimeZone(new Date(), "UTC", "yyyy-MM-dd")}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="text-sm text-gray-600">Date Update:</div>
                <div className="text-sm uppercase">
                {data.dateUpdate
                    ? formatInTimeZone(new Date(data.dateUpdate), "UTC", "yyyy-MM-dd")
                    : formatInTimeZone(new Date(), "UTC", "yyyy-MM-dd")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      }
      content={<ContentModalDF data={data} onClose={setOpen} />}
    />
  );
}

function ContentModalDF({ data, onClose }: { data: DFType; onClose: React.Dispatch<React.SetStateAction<boolean>> }): React.JSX.Element {
  const [status, setStatus] = useState<string>("")
  const [tahun_pengadaan, setTahunPengadaan] = useState<string>("")
  const { data: session } = useSession();
  
  const query = useQueryClient()

  const handleSubmit = async () => {
      if(!status) {
        toast.warning("Pilih status terlebih dahulu!")
        return
      }

      if(status === "2" && !tahun_pengadaan) {
        toast.warning("Tahun pengadaan tidak boleh kosong!")
        return
      }

      const request = await fetchPost({
        url: "/api/df?type=update",
        body: { id: data.id, status: parseInt(status), ...(tahun_pengadaan && { tahun_pengadaan }) }
      })

      if(request?.code === 0) {
        toast.success(request.message)
        query.invalidateQueries({ queryKey: [GET_DF_LIST] })
        onClose(false)
      }
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col">
        <div className="text-gray-500">Tipe DF</div>
        <div className="capitalize font-semibold">{data.tipe_df}</div>
      </div>
      <div className="flex flex-col">
        <div className="text-gray-500">Teknologi</div>
        <div className="text-sm uppercase font-semibold">
          {data.teknologi.join(", ")}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-gray-500">Date Create</div>
        <div className="text-sm uppercase font-semibold">
          {data.dateCreate
            ? formatInTimeZone(new Date(data.dateCreate), "UTC", "yyyy-MM-dd")
            : formatInTimeZone(new Date(), "UTC", "yyyy-MM-dd")}
        </div>
      </div>
      <div className="flex flex-col col-span-3">
        <div className="text-gray-500">Files Uploaded</div>
        {(data.uploaded_files as UploadedFileType[]).map((v, i) => (
          <a
            className="flex items-center gap-2 cursor-pointer transition-color duration-300 ease-in-out hover:text-neutral-500 focus:text-blue-500"
            key={v.file_name}
            href={`/uploads/${v.file_name}`}
            target="_blank"
          >
            <FaFilePdf className="font-semibold" />
            <div>{v.file_name}</div>
          </a>
        ))}
      </div>
      <div className="flex flex-col col-span-3">
        <div className="text-gray-500">Keterangan</div>
        { data?.keterangan ? data?.keterangan : "-" }
      </div>
      {
        (session?.user?.role === "admin" && data?.status === 1) && (
          <>
              <div className={cn(
                "flex flex-col gap-2 mb-4",
                status !== "2" ? "col-span-3" : ""
              )}>
                <Label value="Ganti Status" isRequired />
                  <Select
                    options={[{
                      value: "2",
                      text: "Disetujui"
                    },{
                      value: "3",
                      text: "Ditolak"
                    }]}
                    onChange={(val) => setStatus(val as string)}
                    placeholder="Pilih status"
                  />
              </div>
              {
                status === "2" && (
                  <div className="flex flex-col col-span-2 gap-2 mb-4">
                    <Label value="Tahun Pengadaan" isRequired />
                      <Input
                        type="number"
                        placeholder="Masukkan tahun pengadaan ..."
                        required
                        onChange={(e) => setTahunPengadaan(e.target.value)}
                        value={tahun_pengadaan}
                      />
                  </div>
                )
              }
              <div className="flex justify-center col-span-3 w-full">
                <Button type="button" onClick={handleSubmit} className="w-full"><FaPaperPlane />Submit</Button>
              </div> 
          </>
        )
      }
    </div>
  );
}
