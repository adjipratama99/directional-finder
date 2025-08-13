"use client";

import ChangePassword from "@/components/change-password";
import Header from "@/components/layouts/navbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/context/MenuContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { cn, getInitials } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { FaBars, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";

export default function SiteLayout({ children }) {
  const { isOpen, toggleSidebar } = useSidebar();
  const { data: session } = useSession();
  const isMobile = useIsMobile();

  return (
    <div className="flex">
      <ReduxProvider store={store}>
        <Header />
        <main
          className={cn(
            "flex-1 ml-0 transition-all duration-300 w-full pt-6 pr-6",
            isOpen ? "sm:ml-70" : "pl-6 sm:ml-2"
          )}
        >
          <div
            className={cn(
              "flex items-center",
              !isMobile ? "justify-between" : "justify-end"
            )}
          >
            {!isMobile && (
              <button
                onClick={() => toggleSidebar()}
                className="p-2 bg-neutral-800 text-white rounded-md cursor-pointer"
              >
                {isOpen ? <FaTimes /> : <FaBars />}
              </button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="flex flex-col border-r pr-2 text-sm">
                    <div>{session?.user.username}</div>
                    {session?.user.nama_satuan && (
                      <div>{session?.user.nama_satuan}</div>
                    )}
                  </div>
                  <div className="bg-neutral-500 text-white rounded-full px-3 py-1.5 text-sm font-bold">
                    {getInitials(session?.user?.username ?? "")}
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-4">
                <DropdownMenuItem className="cursor-pointer">
                  <ChangePassword />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-500 hover:text-red-700! transition-colors duration-300 ease-in-out"
                  onClick={() => signOut()}
                >
                  <FaSignOutAlt className="transition-colors duration-300 ease-in-out text-red-500 hover:text-red-700!" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="pt-4">{children}</div>
        </main>
      </ReduxProvider>
    </div>
  );
}
