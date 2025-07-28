import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
        id: string;
        username: string;
        role: string;
        satuan_wilayah: string;
        wilayah: string;
        nama_satuan: string;
        dateUpdate?: string;
        dateCreate?: string;
    }
  }
}