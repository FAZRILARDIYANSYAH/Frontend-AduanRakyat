"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  Hourglass,
  MapPin,
  Clock,
  ThumbsUp,
} from "lucide-react";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";

interface Props {
  report: any;
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    stripeClass: string;
    icon: React.ReactNode;
  }
> = {
  selesai: {
    label: "Selesai",
    badgeClass: "bg-emerald-100 text-emerald-700",
    dotClass: "bg-emerald-500",
    stripeClass: "bg-gradient-to-b from-emerald-400 to-emerald-500",
    icon: <CheckCircle2 size={11} />,
  },
  ditolak: {
    label: "Ditolak",
    badgeClass: "bg-red-100 text-red-600",
    dotClass: "bg-red-500",
    stripeClass: "bg-gradient-to-b from-red-400 to-red-500",
    icon: <XCircle size={11} />,
  },
  diproses: {
    label: "Diproses",
    badgeClass: "bg-indigo-100 text-indigo-700",
    dotClass: "bg-indigo-500",
    stripeClass: "bg-gradient-to-b from-indigo-400 to-indigo-600",
    icon: <Loader2 size={11} />,
  },
  menunggu: {
    label: "Menunggu",
    badgeClass: "bg-amber-100 text-amber-700",
    dotClass: "bg-amber-400",
    stripeClass: "bg-gradient-to-b from-amber-400 to-amber-500",
    icon: <Hourglass size={11} />,
  },
  verifikasi: {
    label: "Diverifikasi",
    badgeClass: "bg-amber-100 text-amber-700",
    dotClass: "bg-amber-400",
    stripeClass: "bg-gradient-to-b from-amber-400 to-amber-500",
    icon: <Eye size={11} />,
  },
};

const AVATAR_GRADIENTS = [
  "from-indigo-500 to-violet-500",
  "from-blue-500 to-indigo-500",
  "from-violet-500 to-pink-500",
  "from-cyan-500 to-blue-500",
];

function getInitials(name: string) {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"
  );
}

function getAvatarGradient(name: string) {
  const index = (name?.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

function timeAgo(dateStr: string) {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff} detik lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

export default function FeedCard({ report }: Props) {
  const { data: session } = useSession();
  const currentUserId = Number(session?.user?.id);

  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const statusKey = report.status?.toLowerCase() || "verifikasi";
  const status = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG["verifikasi"];

  const loadComments = async () => {
    try {
      const res = await api.get(`/comments/laporan/${report.id}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (open) loadComments();
  }, [open]);

  const sendComment = async () => {
    if (!text.trim()) return;
    try {
      setLoading(true);
      await api.post("/comments", { laporan_id: report.id, comment: text });
      setText("");
      loadComments();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Lightbox Modal ── */}
      {lightbox && report.foto && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <XCircle size={22} />
          </button>
          <img
            src={report.foto}
            alt="foto laporan full"
            className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    <div className="group bg-white rounded-[2rem] border border-slate-100 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 cursor-pointer overflow-hidden">

      {/* ── Foto / Image area ── */}
      <div
        className={`w-full h-44 bg-slate-50 border-b border-slate-100 flex items-center justify-center overflow-hidden relative ${report.foto ? "cursor-zoom-in" : ""}`}
        onClick={() => report.foto && setLightbox(true)}
      >
        {report.foto ? (
          <img
            src={report.foto}
            alt="foto laporan"
            className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth={1.5} className="w-10 h-10">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        )}
      </div>

      <div className="p-6">

        {/* ── User + Status ── */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarGradient(
                report.user_name || ""
              )} flex items-center justify-center text-white text-[13px] font-bold shrink-0 shadow-sm`}
            >
              {getInitials(report.user_name)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[14px] text-slate-900 truncate leading-tight">
                {report.user_name}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider font-semibold">
                {report.kategori || report.category || "Laporan"}
              </p>
            </div>
          </div>

          <span className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 ${status.badgeClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
            {status.label}
          </span>
        </div>

        {/* ── Judul & Deskripsi ── */}
        <h3 className="font-bold text-slate-900 text-base leading-snug mb-1 group-hover:text-indigo-700 transition-colors line-clamp-2">
          {report.judul_laporan}
        </h3>
        <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2 mb-4">
          {report.deskripsi}
        </p>

        {/* ── Tanggapan Instansi ── */}
        {report.tanggapan && (
          <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-3">
            <p className="text-xs font-semibold text-blue-700 mb-1">Tanggapan Instansi</p>
            <p className="text-[13px] text-slate-700 leading-relaxed line-clamp-2">
              {report.tanggapan}
            </p>
          </div>
        )}

        {/* ── Footer: Lokasi + Waktu + Komentar ── */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-50 pt-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {report.lokasi || report.location || "—"}
          </span>
          <span className="flex items-center gap-3">
          </span>
          <div>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo(report.created_at)}
            </span>
          </div>
        </div>

        {/* ── Comment Toggle ── */}
        <div className="mt-3.5 pt-3 border-t border-slate-100">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 text-[13px] font-medium text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <MessageSquare size={15} strokeWidth={2} />
            <span>
              {open ? comments.length : report.comment_count || 0} Komentar
            </span>
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* ── Comment Section ── */}
        {open && (
          <div className="mt-3.5 space-y-3 border-t border-slate-100 pt-3.5">
            <div className="max-h-44 overflow-y-auto space-y-2 pr-0.5">
              {comments.length === 0 ? (
                <p className="text-[12.5px] text-slate-400 text-center py-3">
                  Belum ada komentar
                </p>
              ) : (
                comments.map((c) => {
                  const isMine = Number(c.user_id) === currentUserId;
                  return (
                    <div key={c.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                          isMine
                            ? "bg-indigo-600 text-white rounded-br-md"
                            : "bg-slate-100 text-slate-700 rounded-bl-md"
                        }`}
                      >
                        <p className={`text-[11px] font-semibold mb-1 ${isMine ? "text-indigo-100" : "text-indigo-600"}`}>
                          {isMine ? "Anda" : c.name}
                        </p>
                        <p className="text-[13px] leading-relaxed">{c.comment}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex gap-2 pt-0.5">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendComment()}
                className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                placeholder="Tulis komentar..."
              />
              <button
                onClick={sendComment}
                disabled={loading || !text.trim()}
                className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={15} />
                ) : (
                  <Send size={15} />
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
    </>
  );
}