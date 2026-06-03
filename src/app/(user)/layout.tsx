"use client";

import Sidebar from "@/components/user/Sidebar";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

function Header() {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();

  const title =
    pathname === "/laporan"
      ? "Laporan Saya"
      : pathname === "/buat-laporan"
      ? "Buat Laporan"
      : "Dashboard";

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 h-16 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div>
          <span className="text-sm font-bold text-slate-400">
            Dashboard
          </span>

          <span className="text-slate-300 mx-2">
            /
          </span>

          <span className="text-sm font-bold text-slate-700">
            {title}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
          <Bell className="w-4 h-4 text-slate-600" />
        </button>

        <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.slice(0, 2)?.toUpperCase() ||
              "??"}
          </div>

          <span className="text-sm font-bold text-slate-700 hidden sm:block">
            {user?.name?.split(" ")[0] ||
              "User"}
          </span>
        </div>
      </div>
    </header>
  );
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}