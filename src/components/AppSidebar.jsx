"use client";

import { Brain, MapPinned, Newspaper, LogOut, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext"; // Asumsi Anda punya ini

// Menu items
const menuItems = [
  { title: "Provinsi", href: "/dashboard/provinces", icon: MapPinned },
  { title: "Artikel Blog", href: "/dashboard/blogs", icon: Newspaper },
  { title: "Kuis", href: "/dashboard/quizzes", icon: Brain },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { session, signOut } = useAuth(); // Ambil fungsi signOut dari context

  return (
    // 🔹 Sidebar utama dengan background dan border
    <aside className="fixed inset-y-0 left-0 z-10 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      
      {/* 🔹 Header Sidebar dengan Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-6">
          <Image
            src="/Logo Full.svg"
            alt="Cultunesia Logo"
            width={320}
            height={320}
          />
      </div>

      {/* 🔹 Konten Utama Sidebar (Menu) */}
      <nav className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex-1">
          <p className="px-3 text-xs font-semibold uppercase text-gray-500">
            Manajemen
          </p>
          <ul className="mt-2 space-y-1">
            {menuItems.map((item) => {
              // Cek apakah URL saat ini adalah halaman aktif atau sub-halaman dari menu
              const isActive = pathname.startsWith(item.href);

              return (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all
                      hover:bg-gray-100 hover:text-gray-900
                      ${isActive ? "bg-yellow-100 font-semibold text-yellow-700" : ""}
                    `}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* 🔹 Footer Sidebar dengan Profil Pengguna & Logout */}
      <div className="mt-auto border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCircle className="h-8 w-8 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-800 truncate">
                {session?.user?.email || "Admin"}
              </p>
            </div>
          </div>
          <button 
            onClick={signOut}
            className="p-2 rounded-md text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}