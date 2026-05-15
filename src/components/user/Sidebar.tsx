"use client";

import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { LayoutDashboard, ClipboardList, Plus, HelpCircle, LogOut } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",    icon: LayoutDashboard },
  { id: "laporan",   label: "Laporan Saya", icon: ClipboardList   },
  { id: "buat",      label: "Buat Laporan", icon: Plus            },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 h-screen sticky top-0 z-40 shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-sm">AR</span>
          </div>
          <span className="text-lg font-extrabold">
            <span className="text-indigo-600">Aduan</span>
            <span className="text-slate-800">Rakyat</span>
          </span>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 mx-4 mt-4 bg-indigo-50 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.name?.slice(0, 2)?.toUpperCase() || "??"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-800 text-sm truncate">{user?.name || "Pengguna"}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || ""}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 mt-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
        >
          <HelpCircle className="w-4 h-4" /> Bantuan
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>
    </aside>
  );
}