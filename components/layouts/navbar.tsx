"use client";

import { cn, getInitials } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import logo from "@/public/assets/logo_baintelkam.png";
import ChangePassword from "../change-password";
import Link from "next/link";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { useSidebar } from "@/context/MenuContext";

export default function Sidebar(): React.JSX.Element {
    const { isOpen, toggleSidebar } = useSidebar();
    const { data: session } = useSession();
    const pathname = usePathname();

    const menuList = [
        { label: "Inventaris", url: "/inventory", role: ["admin"] },
        { label: "Permintaan", url: "/dashboard", role: ["admin", "user"] },
        { label: "Pengguna", url: "/users", role: ["admin"] },
        { label: "Laporan", url: "/report", role: ["admin"] },
    ];

    return (
        <div className="h-screen">
            {/* Toggle button */}
            {
              !isOpen && (
                <button
                    onClick={() => toggleSidebar()}
                    className="fixed top-4 left-4 z-50 p-2 bg-neutral-800 text-white rounded-md sm:hidden"
                >
                    <FaBars />
                </button>
              )
            }

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed top-0 left-0 z-40 h-full w-64 bg-neutral-800 transform transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                    "sm:block"
                )}
            >
                <div className="flex flex-col h-full p-4 text-white">
                    {/* Logo */}
                    <div className="flex justify-between mb-6">
                      <div className="flex items-center flex-col justify-center w-full">
                          <Image src={logo} alt="Logo" width={120} height={120} />
                          <span className="ml-2 font-semibold text-lg">{ process.env.NEXT_PUBLIC_APP_NAME }</span>
                      </div>
                      <Link
                        href="#"
                          onClick={() => toggleSidebar()}
                          className="p-2 bg-neutral-800 text-white rounded-md sm:hidden cursor-pointer"
                      >
                          <FaTimes />   
                      </Link>
                    </div>

                    {/* Menu */}
                    <nav className="flex-1 space-y-2">
                        {menuList.map((v) =>
                            v.role.includes(session?.user?.role ?? "") && (
                                <Link
                                    href={v.url}
                                    key={v.label}
                                    className={cn(
                                        "block px-4 py-2 rounded hover:bg-neutral-600 transition",
                                        pathname === v.url ? "bg-neutral-600" : ""
                                    )}
                                >
                                    {v.label}
                                </Link>
                            )
                        )}
                    </nav>

                    {/* User menu */}
                    <div className="mt-auto border-t border-neutral-600 pt-4">
                        <div className="flex items-center justify-between px-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-neutral-500 text-white rounded-full px-3 py-1.5 text-sm font-bold">
                                    {getInitials(session?.user?.username ?? "")}
                                </div>
                                <span className="text-sm">
                                    {session?.user?.username ?? "Guest"}
                                </span>
                            </div>
                        </div>
                        <div className="mt-3 px-4 space-y-2 text-sm">
                            <ChangePassword />
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-2 text-red-400 hover:text-red-300"
                            >
                                <FaSignOutAlt /> Keluar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Optional backdrop on mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 sm:hidden"
                    onClick={() => toggleSidebar()}
                />
            )}
        </div>
    );
}