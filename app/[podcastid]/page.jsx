import PodcastCard from "@/components/card/PodcastCard";
import EpisodeList from "@/components/list/EpisodeList";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import Loading from "../loading";

export async function generateMetadata({ params }) {
  const podcast = await getPodcastById(params.podcastid);

  return {
    title: podcast.podcastTitle,
    description: podcast.podcastDescription,
  };
}

export default async function PodcastPage({ params }) {
  const podcast = await getPodcastById(params.podcastid);

  return (
    <section className=" container mx-auto mt-2">
      <Suspense fallback={<Loading />}>
        <PodcastCard podcast={podcast} />
        <Separator className="my-2" />
        <EpisodeList podcastId={params.podcastid} />
      </Suspense>
    </section>
  );
}

async function getPodcastById(podcastid) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/get/podcast/${podcastid}`,
      requestOptions,
      { next: { revalidate: 60 } }
    )
      .then((res) => {
        if (!res.ok) {
          resolve(null);
        }
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
