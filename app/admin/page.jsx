import UserPinList from "@/components/list/UserPinList";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminPage() {
  return (
    <section className=" container mx-auto">
      <UserPinList />
    </section>
  );
}
