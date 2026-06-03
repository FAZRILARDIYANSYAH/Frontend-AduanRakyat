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
} from "lucide-react";
import api from "@/lib/axios";

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
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dotClass: "bg-emerald-500",
    stripeClass: "bg-gradient-to-b from-emerald-400 to-emerald-500",
    icon: <CheckCircle2 size={11} />,
  },
  ditolak: {
    label: "Ditolak",
    badgeClass: "bg-red-50 text-red-600 border border-red-200",
    dotClass: "bg-red-500",
    stripeClass: "bg-gradient-to-b from-red-400 to-red-500",
    icon: <XCircle size={11} />,
  },
  diproses: {
    label: "Diproses",
    badgeClass: "bg-violet-50 text-violet-700 border border-violet-200",
    dotClass: "bg-violet-500",
    stripeClass: "bg-gradient-to-b from-violet-400 to-violet-600",
    icon: <Loader2 size={11} />,
  },
  menunggu: {
    label: "Menunggu",
    badgeClass: "bg-amber-50 text-amber-700 border border-amber-200",
    dotClass: "bg-amber-400",
    stripeClass: "bg-gradient-to-b from-amber-400 to-amber-500",
    icon: <Hourglass size={11} />,
  },
  verifikasi: {
    label: "Verifikasi",
    badgeClass: "bg-sky-50 text-sky-700 border border-sky-200",
    dotClass: "bg-sky-400",
    stripeClass: "bg-gradient-to-b from-sky-400 to-sky-500",
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
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const statusKey = report.status?.toLowerCase() || "verifikasi";
  const status = STATUS_CONFIG[statusKey];

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
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50">

      {/* Status stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3.5px] ${status.stripeClass}`} />

      <div className="px-5 pt-5 pb-4 pl-[22px]">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3">
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
              <p className="text-[12px] text-slate-400 mt-0.5">
                {timeAgo(report.created_at)}
              </p>
            </div>
          </div>

          {/* Badge */}
          <span
            className={`flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1.5 rounded-lg shrink-0 ${status.badgeClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
            {status.label}
          </span>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-slate-100 my-3.5" />

        {/* ── Content ── */}
        <div>
          <h2 className="font-bold text-[15px] text-slate-900 truncate leading-snug">
            {report.judul_laporan}
          </h2>
          <p className="text-[13px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {report.deskripsi}
          </p>
        </div>

        {/* ── Foto ── */}
        {report.foto && (
          <div className="mt-3.5 rounded-xl overflow-hidden border border-slate-100">
            <img
              src={report.foto}
              alt="foto laporan"
              className="w-full h-[160px] object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          </div>
        )}

        {/* ── Comment toggle ── */}
        <div className="mt-4 pt-3.5 border-t border-slate-100">
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

        {/* ── Comment section ── */}
        {open && (
          <div className="mt-3.5 space-y-3 border-t border-slate-100 pt-3.5">
            <div className="max-h-44 overflow-y-auto space-y-2 pr-0.5">
              {comments.length === 0 ? (
                <p className="text-[12.5px] text-slate-400 text-center py-3">
                  Belum ada komentar
                </p>
              ) : (
                comments.map((c) => (
                  <div
                    key={c.id}
                    className="bg-slate-50 rounded-xl px-3.5 py-2.5"
                  >
                    <p className="text-[11.5px] font-bold text-indigo-600 mb-0.5">
                      {c.user_name}
                    </p>
                    <p className="text-[13px] text-slate-600 leading-relaxed">
                      {c.comment}
                    </p>
                  </div>
                ))
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
  );
}