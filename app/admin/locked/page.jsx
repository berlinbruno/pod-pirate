import LockedUserPinList from "@/components/list/LockedUserPinList";

export const metadata = {
  title: "Locked Users",
};

export default async function LockedUsersPage() {
  return (
    <section className=" container mx-auto">
      <LockedUserPinList />
    </section>
  );
}
