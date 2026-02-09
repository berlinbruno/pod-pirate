import { Separator } from "@/components/ui/separator";
import { notFound, redirect } from "next/navigation";
import { getUserPodcastById } from "@/lib/api";
import type { Metadata } from "next";
import UpdatePodcastForm from "@/components/form/content/UpdatePodcastForm";
import { PageSection } from "@/components/layout/PageSection";
import PageHeader from "@/components/header/PageHeader";

export const revalidate = 0;

interface EditPodcastPageProps {
  params: Promise<{
    podcastId: string;
  }>;
}

export async function generateMetadata({ params }: EditPodcastPageProps): Promise<Metadata> {
  const { podcastId } = await params;
  if (!podcastId) {
    return {
      title: "Edit Podcast - Dashboard - Pod Pirate",
      description: "Edit your podcast details",
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
    title: `Edit ${podcast.title} - Dashboard - Pod Pirate`,
    description: `Edit details for ${podcast.title}`,
  };
}

export default async function DashboardEditPodcastPage({ params }: EditPodcastPageProps) {
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
      <PageHeader title="Edit Podcast" description="Fill in the details to update your podcast." />
      <Separator className="hidden sm:block" />
      <UpdatePodcastForm podcast={podcast} />
    </PageSection>
  );
}
