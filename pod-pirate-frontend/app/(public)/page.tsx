import type { Metadata } from "next";
import Paginator from "@/components/ui/paginator";
import { getPodcastsByQuery } from "@/lib/api";
import PodcastDiscoveryFilter from "@/components/filter/PodcastDiscoveryFilter";
import PodcastGrid from "@/components/grid/PodcastGrid";
import { PageSection } from "@/components/layout/PageSection";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Discover Podcasts - Pod Pirate",
  description:
    "Discover amazing podcasts across all categories on Pod Pirate. Listen to your favorite creators.",
  openGraph: {
    title: "Discover Podcasts - Pod Pirate",
    description: "Discover amazing podcasts across all categories on Pod Pirate",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Podcasts - Pod Pirate",
    description: "Discover amazing podcasts across all categories on Pod Pirate",
  },
};

interface LandingPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function PublicLandingPage({ searchParams }: LandingPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category || "";
  const page = parseInt(params.page || "0");

  const data = await getPodcastsByQuery(page, category as string | null, search);

  const podcasts = data?.content || [];
  const currentPage = data?.page?.number ?? page;
  const totalPages = data?.page?.totalPages ?? 0;

  return (
    <PageSection>
      <PodcastDiscoveryFilter initialSearch={search} initialCategory={category} />

      <PodcastGrid podcasts={podcasts} />

      <Paginator currentPage={currentPage} totalPages={totalPages} />
    </PageSection>
  );
}
