import { AdminPodcastActionsMenu } from "@/components/action/AdminPodcastActionsMenu";
import AdminPodcastCard from "@/components/card/podcast/AdminPodcastCard";
import PageHeader from "@/components/header/PageHeader";
import { PageSection } from "@/components/layout/PageSection";
import AdminEpisodeList from "@/components/list/AdminEpisodeList";
import { Separator } from "@/components/ui/separator";
import { getAdminEpisodesById, getAdminPodcastById } from "@/lib/api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 0;

interface PageParams {
  podcastId: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { podcastId } = await params;

  try {
    const podcast = await getAdminPodcastById(podcastId);

    if (!podcast?.content) {
      return {
        title: "Podcast Not Found - Pod Pirate Admin",
      };
    }

    const { title, description, creatorName } = podcast.content;

    return {
      title: `${title} - Admin - Pod Pirate`,
      description: description || `Manage ${title} podcast by ${creatorName}`,
    };
  } catch {
    return {
      title: "Podcast Not Found - Pod Pirate Admin",
    };
  }
}

export default async function AdminPodcastDetailPage({ params }: PageProps) {
  const { podcastId } = await params;

  const [podcast, episodes] = await Promise.all([
    getAdminPodcastById(podcastId),
    getAdminEpisodesById(podcastId),
  ]);

  if (!podcast) {
    notFound();
  }

  return (
    <PageSection>
      <PageHeader title="Podcast Details" description="View and manage podcast information." />

      <Separator className="hidden sm:block" />

      <AdminPodcastCard podcast={podcast.content} />

      <AdminPodcastActionsMenu podcast={podcast.content} />

      <AdminEpisodeList episodes={episodes} podcastId={podcastId} />
    </PageSection>
  );
}
