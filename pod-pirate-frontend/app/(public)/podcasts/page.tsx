import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import PodcastCard from "@/components/card/podcast/PodcastCard";
import EpisodeList from "@/components/list/EpisodeList";
import { Separator } from "@/components/ui/separator";
import { getEpisodes, getPodcastById } from "@/lib/api";
import { PageSection } from "@/components/layout/PageSection";
import BackPageHeader from "@/components/header/BackPageHeader";

export const revalidate = 60;

interface PodcastsPageProps {
  searchParams: Promise<{ podcastId?: string }>;
}

export async function generateMetadata({ searchParams }: PodcastsPageProps): Promise<Metadata> {
  const { podcastId } = await searchParams;

  if (!podcastId) {
    return {
      title: "Podcast - Pod Pirate",
      description: "Discover amazing podcasts on Pod Pirate",
    };
  }

  const podcast = await getPodcastById(podcastId);

  if (!podcast) {
    return {
      title: "Podcast Not Found - Pod Pirate",
      description: "The podcast you're looking for could not be found",
    };
  }

  return {
    title: `${podcast.title} - Pod Pirate`,
    description:
      podcast.description || `Listen to ${podcast.title} by ${podcast.creatorName} on Pod Pirate`,
    openGraph: {
      title: podcast.title,
      description: podcast.description || `Listen to ${podcast.title} by ${podcast.creatorName}`,
      type: "website",
      url: `/podcasts?podcastId=${podcastId}`,
      images: podcast.coverUrl ? [{ url: podcast.coverUrl, alt: podcast.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: podcast.title,
      description: podcast.description || `Listen to ${podcast.title} by ${podcast.creatorName}`,
      images: podcast.coverUrl ? [podcast.coverUrl] : [],
    },
  };
}

export default async function PublicPodcastsPage({ searchParams }: PodcastsPageProps) {
  const { podcastId } = await searchParams;

  if (!podcastId) redirect("/");

  const podcast = await getPodcastById(podcastId);

  if (!podcast) notFound();

  const episodes = await getEpisodes(podcastId);

  return (
    <PageSection>
      <PodcastCard podcast={podcast} />

      <Separator className="hidden sm:block" />

      <BackPageHeader title="" highlight="Episodes" count={episodes.length} />

      <EpisodeList episodes={episodes} />
    </PageSection>
  );
}
