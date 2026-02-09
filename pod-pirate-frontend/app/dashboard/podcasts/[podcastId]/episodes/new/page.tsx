import { Separator } from "@/components/ui/separator";
import { getUserPodcastById } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import EpisodeForm from "@/components/form/content/EpisodeForm";
import { PageSection } from "@/components/layout/PageSection";
import PageHeader from "@/components/header/PageHeader";

export const revalidate = 0;

interface NewEpisodePageProps {
  params: Promise<{
    podcastId: string;
  }>;
}

export async function generateMetadata({ params }: NewEpisodePageProps): Promise<Metadata> {
  const { podcastId } = await params;

  if (!podcastId) {
    return {
      title: "New Episode - Dashboard - Pod Pirate",
      description: "Create a new episode",
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
    title: `New Episode - ${podcast.title} - Dashboard - Pod Pirate`,
    description: `Create a new episode for ${podcast.title}`,
  };
}

export default async function DashboardNewEpisodePage({ params }: NewEpisodePageProps) {
  const { podcastId } = await params;

  if (!podcastId) {
    redirect("/dashboard/podcasts");
  }

  const podcast = await getUserPodcastById(podcastId);

  if (!podcast) {
    notFound();
  }

  return (
    <PageSection>
      <PageHeader
        title="Create New Episode"
        description="Fill in the details to create your episode."
      />
      <Separator className="hidden sm:block" />
      <EpisodeForm podcastId={podcastId} />
    </PageSection>
  );
}
