import Sidebar from "@/components/superadmin/Sidebar";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50"> {/* Pastikan bg-nya terang! */}
      {/* Sidebar Component */}
      <Sidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}