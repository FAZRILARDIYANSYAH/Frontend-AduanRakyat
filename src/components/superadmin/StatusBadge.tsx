interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  const getStyle = () => {
    switch (status.toLowerCase()) {
      case "selesai":
        return "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/80";
      case "diproses":
        return "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200/80";
      case "verifikasi":
        return "bg-amber-50 text-amber-600 ring-1 ring-amber-200/80";
      case "ditolak":
        return "bg-rose-50 text-rose-500 ring-1 ring-rose-200/80";
      default:
        return "bg-slate-50 text-slate-500 ring-1 ring-slate-200/80";
    }
  };

  const getDot = () => {
    switch (status.toLowerCase()) {
      case "selesai":   return "bg-emerald-500";
      case "diproses":  return "bg-indigo-500";
      case "verifikasi":return "bg-amber-400";
      case "ditolak":   return "bg-rose-500";
      default:          return "bg-slate-400";
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide ${getStyle()}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDot()}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}