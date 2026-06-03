"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useSession,
  signOut,
} from "next-auth/react";

import {
  LayoutDashboard,
  ClipboardList,
  Tag,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/superadmin/dashboard",
  },
  {
    label: "Kelola Users",
    icon: ClipboardList,
    href:
      "/superadmin/kelola-users",
  },
  {
    label:
      "Monitoring Laporan",
    icon: Tag,
    href:
      "/superadmin/monitoring-laporan",
  },
];

export default function AdminSidebar() {
  const router = useRouter();

  const pathname =
    usePathname();

  // NEXTAUTH SESSION
  const {
    data: session,
  } = useSession();

  const user =
    session?.user;

const handleLogout = async () => {
  await signOut({
    callbackUrl: "/",
  });
};

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 h-screen sticky top-0 z-40 shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
            <span className="text-white font-black text-xs">
              AR
            </span>
          </div>

          <div>
            <span className="text-[17px] font-black tracking-tight">
              <span className="text-indigo-600">
                Aduan
              </span>

              <span className="text-slate-800">
                Rakyat
              </span>
            </span>

            <div className="flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-indigo-400" />

              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="mx-4 mt-5">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-4 border border-indigo-100/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-black text-sm">
              {user?.name
                ?.slice(0, 2)
                ?.toUpperCase() ||
                "AD"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-800 text-sm truncate">
                {user?.name ||
                  "Admin"}
              </p>

              <p className="text-[11px] text-slate-400 truncate">
                {user?.email ||
                  ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-6 space-y-1">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-3 mb-3">
          Menu
        </p>

        {NAV_ITEMS.map(
          (item) => {
            const Icon =
              item.icon;

            const active =
              pathname ===
              item.href;

            return (
              <Link
                key={
                  item.href
                }
                href={
                  item.href
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    active
                      ? "text-white"
                      : "text-slate-400 group-hover:text-indigo-500"
                  }`}
                />

                <span className="flex-1 text-left">
                  {
                    item.label
                  }
                </span>

                {active && (
                  <ChevronRight className="w-3.5 h-3.5 text-white/60" />
                )}
              </Link>
            );
          }
        )}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-all">
          <HelpCircle className="w-4 h-4" />

          Bantuan
        </button>

        <button
          onClick={
            handleLogout
          }
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="w-4 h-4" />

          Keluar
        </button>
      </div>
    </aside>
  );
}