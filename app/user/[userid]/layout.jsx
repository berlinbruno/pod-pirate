import Sidebar from "@/components/menu/Sidebar";

export default async function UserLayout({ children, params }) {
  return (
    <main className=" flex ">
      <Sidebar userid={params.userid} />
      {children}
    </main>
  );
}
