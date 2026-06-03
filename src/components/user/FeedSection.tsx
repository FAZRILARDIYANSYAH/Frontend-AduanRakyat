"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import FeedCard from "./FeedCard";

const FILTERS = [
  { key: "semua", label: "Semua" },
  { key: "verifikasi", label: "Verifikasi" },
  { key: "diproses", label: "Diproses" },
  { key: "selesai", label: "Selesai" },
];

export default function FeedSection() {
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] =
    useState("semua");

  const fetchFeed = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/laporan/feed"
      );

      // status yg masuk feed
      const allowedStatus = [
        "verifikasi",
        "diproses",
        "selesai",
      ];

      const filtered = res.data.filter(
        (item: any) =>
          allowedStatus.includes(
            item.status?.toLowerCase()
          )
      );

      setFeed(filtered);
    } catch (err) {
      console.error(
        "Error fetch feed:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const statusCount = useMemo(() => {
    return {
      semua: feed.length,
      verifikasi: feed.filter(
        (i) =>
          i.status?.toLowerCase() ===
          "verifikasi"
      ).length,
      diproses: feed.filter(
        (i) =>
          i.status?.toLowerCase() ===
          "diproses"
      ).length,
      selesai: feed.filter(
        (i) =>
          i.status?.toLowerCase() ===
          "selesai"
      ).length,
    };
  }, [feed]);

  const filteredFeed = useMemo(() => {
    if (activeFilter === "semua")
      return feed;

    return feed.filter(
      (item) =>
        item.status?.toLowerCase() ===
        activeFilter
    );
  }, [feed, activeFilter]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-56 rounded-[28px] border bg-white animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <section className="mt-6">
     {/* FILTER BUTTON */}
<div className="flex items-center gap-2 overflow-x-auto pb-1">
  {FILTERS.map((filter) => {
    const active = activeFilter === filter.key;

    return (
      <button
        key={filter.key}
        onClick={() =>
          setActiveFilter(filter.key)
        }
        className={`
          h-11 px-5
          rounded-xl
          border
          flex items-center gap-2
          text-[15px] font-semibold
          transition-all duration-200
          shrink-0
          ${
            active
              ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
              : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
          }
        `}
      >
        <span>{filter.label}</span>

        <span
          className={`
            min-w-[24px] h-6 px-2
            rounded-full
            flex items-center justify-center
            text-xs font-bold
            ${
              active
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-500"
            }
          `}
        >
          {
            statusCount[
              filter.key as keyof typeof statusCount
            ]
          }
        </span>
      </button>
    );
  })}
</div>

      {/* EMPTY */}
      {filteredFeed.length === 0 ? (
        <div className="text-center text-slate-400 py-20">
          Tidak ada laporan
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
          {filteredFeed.map((item) => (
            <FeedCard
              key={item.id}
              report={item}
            />
          ))}
        </div>
      )}
    </section>
  );
}