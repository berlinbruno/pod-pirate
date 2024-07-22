import EpisodeForm from "@/components/form/EpisodeForm";
import { cookies } from "next/headers";

export const metadata = {
  title: "Post New Episode",
};

export default async function NewEpisodePage() {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId");

  return (
    <section className=" container mx-auto">
      <EpisodeForm userId={userId.value} />
    </section>
  );
}
