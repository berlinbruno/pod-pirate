import PinList from "@/components/list/PinList";

export default async function MainPage() {

  return (
    <section className=" container mx-auto">
      <PinList category={null} />
    </section>
  );
}
