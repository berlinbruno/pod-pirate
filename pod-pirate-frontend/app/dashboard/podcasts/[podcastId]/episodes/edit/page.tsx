import { Separator } from "@/components/ui/separator";
import { getUserEpisodeById, getUserPodcastById } from "@/lib/api";
import { auth } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import UpdateEpisodeForm from "@/components/form/content/UpdateEpisodeForm";
import { PageSection } from "@/components/layout/PageSection";
import PageHeader from "@/components/header/PageHeader";

export const revalidate = 0;

interface EditEpisodePageProps {
  searchParams: Promise<{ episodeId?: string }>;
  params: Promise<{
    podcastId: string;
  }>;
}

export async function generateMetadata({
  searchParams,
  params,
}: EditEpisodePageProps): Promise<Metadata> {
  const { episodeId } = await searchParams;
  const { podcastId } = await params;
  const session = await auth();

  if (!podcastId || !episodeId || !session?.user.accessToken) {
    return {
      title: "Edit Episode - Dashboard - Pod Pirate",
      description: "Edit your episode details",
    };
  }

  const episode = await getUserEpisodeById(podcastId, episodeId);

  if (!episode) {
    return {
      title: "Episode Not Found - Dashboard - Pod Pirate",
      description: "The episode you're looking for could not be found",
    };
  }

  return {
    title: `Edit ${episode.title || "Episode"} - Dashboard - Pod Pirate`,
    description: `Edit details for ${episode.title || "episode"}`,
  };
}

export default async function DashboardEditEpisodePage({
  searchParams,
  params,
}: EditEpisodePageProps) {
  const { episodeId } = await searchParams;
  const { podcastId } = await params;

  if (!podcastId) {
    redirect("/dashboard/podcasts");
  }

  if (!episodeId) {
    redirect(`/dashboard/podcasts/${podcastId}`);
  }

  const [podcast, episode] = await Promise.all([
    getUserPodcastById(podcastId),
    getUserEpisodeById(podcastId, episodeId),
  ]);

  if (!podcast || !episode) {
    notFound();
  }

  return (
    <PageSection>
      <PageHeader title="Edit Episode" description="Fill in the details to update your episode." />
      <Separator className="hidden sm:block" />
      <UpdateEpisodeForm episode={episode} podcastId={podcastId} />
    </PageSection>
  );
}
