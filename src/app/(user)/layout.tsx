import { AuthProvider } from "@/context/authContext";
 
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
 