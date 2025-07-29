"use client";

import { cn, getInitials } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import logo from '@/public/assets/logo_baintelkam.png'

export default function Header(): React.JSX.Element {
  const { data: session } = useSession();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isMobileOpen, setMobileOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const menuList = [
    {
      label: "Request DF",
      url: "/dashboard",
      role: ["admin", "user"]
    },
    {
      label: "Users",
      url: "/users",
      role: ["admin"]
    },
    {
      label: "Report",
      url: "/report",
      role: ["admin"]
    },
  ];

  return (
    <nav className="bg-neutral-800">
      <div className="mx-auto max-w-10xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              aria-controls="mobile-menu"
              aria-expanded={isMobileOpen}
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                data-slot="icon"
                aria-hidden="true"
                className="block size-6"
              >
                <path
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                data-slot="icon"
                aria-hidden="true"
                className="hidden size-6"
              >
                <path
                  d="M6 18 18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="ml-10 sm:ml-0 max-w-[50px]">
            <Image
              src={logo}
              alt="Baintelkam"
            />
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {menuList.map((v, i) => (
                  v.role.includes(session?.user?.role ?? "") && (
                    <a
                        href={v.url}
                        aria-current="page"
                        className={cn(
                        "rounded-md px-3 py-2 text-sm font-medium text-white",
                        pathname === v.url ? "bg-neutral-600" : ""
                        )}
                        key={v.label}
                    >
                        {v.label}
                    </a>
                  )
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="relative ml-3">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="true"
                className="cursor-pointer relative flex rounded-full bg-gray-800 text-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
                onClick={() => setOpen((prev) => !prev)}
              >
                <span className="absolute -inset-1.5"></span>
                <span className="sr-only">Open user menu</span>
                <div className="py-2 px-3.5 bg-neutral-500 rounded-full text-center">
                  {getInitials(session?.user?.username ?? "")}
                </div>
              </button>
              <div
                role="menu"
                tabIndex={-1}
                aria-orientation="vertical"
                className={cn(
                  "absolute right-0 z-10 mt-2 px-4 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black/5 focus:outline-hidden",
                  isOpen ? "block" : "hidden"
                )}
              >
                <div className="text-sm mb-2">
                  Welcome, {session?.user?.username}
                </div>
                <div className="h-[1px] w-full bg-neutral-800 mb-2"></div>
                <a href="#" onClick={() => signOut()}>
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="mobile-menu" className={
        cn(
            "sm:hidden",
            isMobileOpen ? "block" : "hidden"
        )
      }>
        <div className="space-y-1 px-2 pt-2 pb-3">
        {menuList.map((v, i) => (
          v.role.includes(session?.user?.role ?? "") && (
            <a
            href={v.url}
            aria-current="page"
            className={cn(
                "block rounded-md px-3 py-2 text-base font-medium text-white",
                pathname === v.url ? "bg-neutral-600" : ""
            )}
            key={v.label}
            >
            {v.label}
            </a>
          )
        ))}
        </div>
      </div>
    </nav>
  );
}
