"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Calendar,
  Tag,
  User,
  MessageSquare,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Building2,
} from "lucide-react";
import { ProgressBar } from "./ReportCard";
import StatusBadge, { STATUS_CONFIG } from "./StatusBadge";
import type { UserReport } from "@/hooks/useLaporan";

interface ReportDetailPanelProps {
  report: UserReport | null;
  onClose: () => void;
}

const STEPS = ["menunggu", "verifikasi", "diproses", "selesai"] as const;

function TimelineItem({
  label,
  date,
  done,
  isLast,
}: {
  label: string;
  date?: string;
  done: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex gap-3">
      {/* dot + line */}
      <div className="flex flex-col items-center">
        <div
          className={`w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0 transition-colors duration-500 ${
            done ? "bg-indigo-500" : "bg-slate-200"
          }`}
        />
        {!isLast && (
          <div
            className={`w-px flex-1 mt-1 transition-colors duration-500 ${
              done ? "bg-indigo-200" : "bg-slate-100"
            }`}
          />
        )}
      </div>
      {/* content */}
      <div className={`pb-4 ${isLast ? "pb-0" : ""}`}>
        <p
          className={`text-xs font-semibold leading-tight ${
            done ? "text-indigo-700" : "text-slate-400"
          }`}
        >
          {label}
        </p>
        {date && (
          <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{date}</p>
        )}
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-medium mb-0.5 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-xs text-slate-700 font-semibold leading-snug">{value}</p>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="h-px bg-slate-50 -mx-5" />;
}

export default function ReportDetailPanel({
  report,
  onClose,
}: ReportDetailPanelProps) {
  const currentStep = report
    ? STEPS.indexOf(report.status?.toLowerCase() as (typeof STEPS)[number])
    : -1;

  const isRejected = report?.status?.toLowerCase() === "ditolak";

  /* Fake timeline dates — replace with real timestamps from your API */
  const timelineEvents = [
    {
      label: "Laporan diterima",
      date: report
        ? new Date(report.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : undefined,
      done: currentStep >= 0 || isRejected,
    },
    {
      label: "Verifikasi oleh admin",
      date: undefined,
      done: currentStep >= 1 || isRejected,
    },
    {
      label: isRejected ? "Laporan ditolak" : "Diteruskan ke instansi",
      date: undefined,
      done: currentStep >= 2 || isRejected,
    },
    {
      label: "Laporan diselesaikan",
      date:
        report?.status?.toLowerCase() === "selesai"
          ? new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : undefined,
      done: currentStep >= 3,
    },
  ];

  return (
    <AnimatePresence>
      {report && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-40"
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 w-[380px] max-w-[92vw] bg-white z-50 flex flex-col shadow-2xl shadow-slate-900/15"
            aria-label="Detail laporan"
          >
            {/* ── Header ── */}
            <div className="flex-shrink-0 px-5 pt-5 pb-4 border-b border-slate-100">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                    #{report.id}
                  </span>
                  {report.kategori && (
                    <>
                      <span className="text-slate-200">·</span>
                      <span className="text-[10px] font-semibold text-slate-400 capitalize">
                        {report.kategori}
                      </span>
                    </>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center flex-shrink-0 transition-colors"
                  aria-label="Tutup panel"
                >
                  <X className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>

              <h2 className="font-bold text-slate-800 text-sm leading-snug mb-3 pr-2">
                {report.judul}
              </h2>

              <StatusBadge status={report.status} />
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-5 p-5">

                {/* Progress */}
                <div>
                  <SectionLabel>Status Laporan</SectionLabel>
                  <ProgressBar status={report.status} />
                </div>

                <Divider />

                {/* Info */}
                <div>
                  <SectionLabel>Informasi</SectionLabel>
                  <div className="flex flex-col gap-3">
                    <InfoRow
                      icon={MapPin}
                      label="Lokasi"
                      value={report.lokasi}
                    />
                    <InfoRow
                      icon={Calendar}
                      label="Tanggal Kejadian"
                      value={
                        report.tanggal_kejadian
                          ? new Date(report.tanggal_kejadian).toLocaleDateString(
                              "id-ID",
                              { day: "numeric", month: "long", year: "numeric" }
                            )
                          : new Date(report.createdAt).toLocaleDateString(
                              "id-ID",
                              { day: "numeric", month: "long", year: "numeric" }
                            )
                      }
                    />
                    <InfoRow
                      icon={Tag}
                      label="Kategori"
                      value={report.kategori}
                    />
                    <InfoRow
                      icon={Building2}
                      label="Instansi Terkait"
                      value={report.instansi ?? undefined}
                    />
                    <InfoRow
                      icon={User}
                      label="Pelapor"
                      value={report.pelapor ?? "Identitas dirahasiakan"}
                    />
                  </div>
                </div>

                {/* Deskripsi */}
                {report.deskripsi && (
                  <>
                    <Divider />
                    <div>
                      <SectionLabel>Deskripsi</SectionLabel>
                      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {report.deskripsi}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Foto / lampiran */}
                {report.foto && (
                <>
                    <Divider />

                    <div>
                    <SectionLabel>Foto Lampiran</SectionLabel>

                    {Array.isArray(report.foto) ? (
                        <div className="grid grid-cols-3 gap-2">
                        {report.foto.map((url: string, i: number) => (
                            <div
                            key={i}
                            className="aspect-square rounded-xl overflow-hidden border border-slate-100"
                            >
                            <img
                                src={url}
                                alt={`Foto ${i + 1}`}
                                className="w-full h-full object-cover"
                            />
                            </div>
                        ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl overflow-hidden border border-slate-100">
                        <img
                            src={report.foto}
                            alt="Foto laporan"
                            className="w-full h-56 object-cover"
                        />
                        </div>
                    )}
                    </div>
                </>
                )}

                {/* Tanggapan */}
                {report.tanggapan && (
                  <>
                    <Divider />
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-xl border border-indigo-100 p-4"
                    >
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-500 mb-2 uppercase tracking-wider">
                        <MessageSquare className="w-3 h-3" />
                        Tanggapan Instansi
                      </div>
                      <p className="text-xs text-indigo-700/80 leading-relaxed">
                        {report.tanggapan}
                      </p>
                    </motion.div>
                  </>
                )}

                <Divider />

                {/* Timeline */}
                <div>
                  <SectionLabel>Riwayat Status</SectionLabel>
                  <div className="flex flex-col">
                    {timelineEvents.map((event, i) => (
                      <TimelineItem
                        key={i}
                        label={event.label}
                        date={event.date}
                        done={event.done}
                        isLast={i === timelineEvents.length - 1}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="flex-shrink-0 px-5 py-4 border-t border-slate-100 bg-slate-50/60">
              <p className="text-[10px] text-slate-400 text-center font-medium">
                Laporan dibuat{" "}
                {new Date(report.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}