import { notFound, redirect } from "next/navigation";
import UserPodcastCard from "@/components/card/podcast/UserPodcastCard";
import { Separator } from "@/components/ui/separator";
import UserEpisodeList from "@/components/list/UserEpisodeList";
import PodcastActionsMenu from "@/components/action/PodcastActionsMenu";
import { getUserEpisodesById, getUserPodcastById } from "@/lib/api";
import type { Metadata } from "next";
import { PageSection } from "@/components/layout/PageSection";
import PageHeader from "@/components/header/PageHeader";

export const revalidate = 0;

interface DashboardPodcastPageProps {
  params: Promise<{
    podcastId: string;
  }>;
}

export async function generateMetadata({ params }: DashboardPodcastPageProps): Promise<Metadata> {
  const { podcastId } = await params;

  if (!podcastId) {
    return {
      title: "Podcast - Dashboard - Pod Pirate",
      description: "Manage your podcast on Pod Pirate",
    };
  }

  const podcast = await getUserPodcastById(podcastId);

  if (!podcast) {
    return {
      title: "Podcast Not Found - Dashboard - Pod Pirate",
      description: "The podcast you're looking for could not be found",
    };
  }

  return {
    title: `${podcast.title} - Dashboard - Pod Pirate`,
    description:
      podcast.description ?? `Manage ${podcast.title} - ${podcast.episodeCount ?? 0} episodes`,
  };
}

export default async function DashboardPodcastDetailPage({ params }: DashboardPodcastPageProps) {
  const { podcastId } = await params;

  if (!podcastId) {
    redirect("/dashboard/podcasts");
  }

  const podcast = await getUserPodcastById(podcastId);

  if (!podcast) {
    notFound();
  }

  const episodes = await getUserEpisodesById(podcastId);

  return (
    <PageSection>
      <PageHeader title="Podcast Details" description="View and manage podcast information." />
      <Separator className="hidden sm:block" />

      <UserPodcastCard podcast={podcast} />

      <PodcastActionsMenu podcast={podcast} />

      <UserEpisodeList podcastId={podcastId} episodes={episodes} />
    </PageSection>
  );
}
