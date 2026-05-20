"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/authContext";
import { useLaporan } from "@/hooks/useLaporan";

import DashboardSection from "@/components/user/DashboardSection";
import ReportCard from "@/components/user/ReportCard";

export default function HomepagePage() {
  const router = useRouter();

  const { user } = useAuth();

  const {
    reports,
    stats,
    loading,
  } = useLaporan();

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <DashboardSection
        stats={stats}
        loading={loading}
        userName={user?.name}
        onBuat={() =>
          router.push("/buat-laporan")
        }
      />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-slate-900">
            Laporan Terkini
          </h2>

          <button
            onClick={() =>
              router.push("/laporan")
            }
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Lihat Semua

            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-40 bg-white rounded-2xl border animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {reports.slice(0, 4).map((item) => (
              <ReportCard
                key={item.id}
                report={item}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}