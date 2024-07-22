import AdminSidebar from "@/components/menu/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <main className=" flex container ">
      <AdminSidebar />
      {children}
    </main>
  );
}
