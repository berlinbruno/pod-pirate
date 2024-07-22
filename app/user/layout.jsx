import Sidebar from "@/components/menu/Sidebar";
import { cookies } from "next/headers";

export default async function UserLayout({ children, params }) {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId");

  return (
    <main className=" flex container ">
      <Sidebar userId={userId.value} />
      {children}
    </main>
  );
}
