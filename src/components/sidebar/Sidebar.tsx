"use client";

import {
  LayoutDashboard,
  ClipboardList,
  Plus
} from "lucide-react";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab
}: Props) {

  const menus = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard
    },
    {
      id: "laporan",
      label: "Laporan Saya",
      icon: ClipboardList
    },
    {
      id: "buat",
      label: "Buat Laporan",
      icon: Plus
    }
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">

      <h1 className="text-2xl font-bold mb-6">
        Aduan Rakyat
      </h1>

      <div className="space-y-2">

        {menus.map((item) => {

          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() =>
                setActiveTab(item.id)
              }
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
              ${
                activeTab === item.id
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}