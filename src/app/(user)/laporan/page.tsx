  "use client";

  import { useState } from "react";

  import {
    Search,
    RefreshCw,
    Inbox,
    SlidersHorizontal,
  } from "lucide-react";

  import { motion } from "framer-motion";

  import { useLaporan } from "@/hooks/useLaporan";

  import ReportCard from "@/components/user/ReportCard";

  import type {
    StatusType,
  } from "@/hooks/useLaporan";

  const FILTER_TABS: {
    label: string;
    value: "semua" | StatusType;
  }[] = [
    {
      label: "Semua",
      value: "semua",
    },
    {
      label: "Menunggu",
      value: "menunggu",
    },
    {
      label: "Verifikasi",
      value: "verifikasi", // <-- ganti ini
    },
    {
      label: "Diproses",
      value: "diproses",
    },
    {
      label: "Selesai",
      value: "selesai",
    },
    {
      label: "Ditolak",
      value: "ditolak",
    },
  ];

  export default function LaporanPage() {
    const {
      reports,
      loading,
      error,
      refetch,
    } = useLaporan();

    const [
      activeFilter,
      setActiveFilter,
    ] = useState<
      "semua" | StatusType
    >("semua");

    const [search, setSearch] =
      useState("");

    const filtered =
      reports.filter((r) => {
        const matchStatus =
          activeFilter === "semua" ||
          r.status === activeFilter;

        const matchSearch =
          !search ||
          r.judul
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          r.lokasi
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          r.kategori
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        return (
          matchStatus &&
          matchSearch
        );
      });

    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Laporan Saya
            </h1>

            <p className="text-slate-500 text-sm mt-1">
              {loading
                ? "Memuat..."
                : `${reports.length} laporan ditemukan`}
            </p>
          </div>

          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                loading
                  ? "animate-spin"
                  : ""
              }`}
            />

            Perbarui
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Cari judul, lokasi, atau kategori..."
            className="w-full bg-white border-2 border-slate-100 focus:border-indigo-300 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-700 outline-none transition-colors"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {FILTER_TABS.map(
            (tab) => {
              const count =
                tab.value ===
                "semua"
                  ? reports.length
                  : reports.filter(
                      (r) =>
                        r.status ===
                        tab.value
                    ).length;

              return (
                <button
                  key={tab.value}
                  onClick={() =>
                    setActiveFilter(
                      tab.value
                    )
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeFilter ===
                    tab.value
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                  }`}
                >
                  {tab.label}

                  {count > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-black bg-white/20">
                      {count}
                    </span>
                  )}
                </button>
              );
            }
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-700 text-sm flex items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 flex-shrink-0" />

            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map(
              (i) => (
                <div
                  key={i}
                  className="bg-white rounded-[2rem] p-6 animate-pulse h-52"
                />
              )
            )}
          </div>
        ) : filtered.length ===
          0 ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
              <Inbox className="w-9 h-9 text-slate-300" />
            </div>

            <h3 className="text-lg font-bold text-slate-700 mb-2">
              Belum ada laporan
            </h3>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map(
              (report) => (
                <ReportCard
                  key={
                    report.id
                  }
                  report={
                    report
                  }
                />
              )
            )}
          </div>
        )}
      </div>
    );
  }