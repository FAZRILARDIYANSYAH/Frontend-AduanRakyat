"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";
import { useLaporan } from "@/hooks/useLaporan";

import DashboardSection from "@/components/user/DashboardSection";
import FeedSection from "@/components/user/FeedSection";

export default function HomepagePage() {
  const router = useRouter();

  const { data: session, status } = useSession();

  const user = session?.user;

  const authLoading = status === "loading";

  console.log(user);

  const {
    stats,
    loading,
  } = useLaporan();

  if (authLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="h-52 rounded-3xl bg-slate-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">

      <DashboardSection
        stats={stats}
        loading={loading}
        userName={session?.user?.name ?? "User"}
        onBuat={() =>
          router.push("/buat-laporan")
        }
      />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-slate-900">
            Feed Laporan
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

        <FeedSection />
      </div>
    </div>
  );
}