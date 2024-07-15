import EpisodeForm from "@/components/form/EpisodeForm";

export const metadata = {
  title: "Post New Episode",
};

export default async function NewEpisodePage({params}) {
  return (
    <section className=" container mx-auto">
      <EpisodeForm userId={params.userid}/>
    </section>
  );
}
