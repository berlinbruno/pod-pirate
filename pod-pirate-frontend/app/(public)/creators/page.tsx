import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import CreatorCard from "@/components/card/creator/CreatorCard";
import { Separator } from "@/components/ui/separator";
import { getCreatorById, getCreatorPodcasts } from "@/lib/api";
import PodcastGrid from "@/components/grid/PodcastGrid";
import Paginator from "@/components/ui/paginator";
import { PageSection } from "@/components/layout/PageSection";
import BackPageHeader from "@/components/header/BackPageHeader";

export const revalidate = 60;

interface CreatorsPageProps {
  searchParams: Promise<{
    creatorId?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: CreatorsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const creatorId = params.creatorId;

  if (!creatorId) {
    return {
      title: "Creator - Pod Pirate",
      description: "Discover amazing podcast creators on Pod Pirate",
    };
  }

  const creator = await getCreatorById(creatorId);

  if (!creator) {
    return {
      title: "Creator Not Found - Pod Pirate",
      description: "The creator you're looking for could not be found",
    };
  }

  const podcastCount = creator.podcastCount || 0;
  const description =
    creator.bio ||
    `${creator.creatorName} - ${podcastCount} podcast${podcastCount !== 1 ? "s" : ""} on Pod Pirate`;

  return {
    title: `${creator.creatorName} - Pod Pirate`,
    description,
    openGraph: {
      title: creator.creatorName,
      description,
      type: "profile",
      url: `/creators?creatorId=${creatorId}`,
      images: creator.profileUrl ? [{ url: creator.profileUrl, alt: creator.creatorName }] : [],
    },
    twitter: {
      card: "summary",
      title: creator.creatorName,
      description,
      images: creator.profileUrl ? [creator.profileUrl] : [],
    },
  };
}

export default async function PublicCreatorsPage({ searchParams }: CreatorsPageProps) {
  const params = await searchParams;
  const creatorId = params.creatorId;
  const page = parseInt(params.page || "0");

  if (!creatorId) redirect("/");

  const creator = await getCreatorById(creatorId);

  if (!creator) notFound();

  const data = await getCreatorPodcasts(creatorId, page);

  const podcasts = data?.content || [];
  const currentPage = data?.page?.number ?? page;
  const totalPages = data?.page?.totalPages ?? 0;

  return (
    <PageSection>
      <CreatorCard creator={creator} />

      <Separator className="hidden sm:block" />

      <BackPageHeader
        title="Podcasts by"
        highlight={creator.creatorName}
        count={creator.podcastCount ?? 0}
      />

      <PodcastGrid podcasts={podcasts} />

      <Paginator currentPage={currentPage} totalPages={totalPages} />
    </PageSection>
  );
}
