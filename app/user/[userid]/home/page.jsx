import PinList from "@/components/list/PinList";

export const metadata = {
  title: "Home",
};

export default function UserHomePage() {
  return (
    <section className=" container mx-auto">
      <PinList category={null} />
    </section>
  );
}
