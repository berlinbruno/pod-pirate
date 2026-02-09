import { getCurrentUser, getUserPodcastsByQuery } from "@/lib/api";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import UserPodcastGrid from "@/components/grid/UserPodcastGrid";
import Paginator from "@/components/ui/paginator";
import { auth } from "@/lib/utils";
import { PageSection } from "@/components/layout/PageSection";
import UserPodcastFilter from "@/components/filter/UserPodcastFilter";
import PageHeader from "@/components/header/PageHeader";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();
  const currentUser = await getCurrentUser(session?.user.accessToken);

  const username = currentUser?.username || "User";
  const podcastCount = currentUser?.podcastCount || 0;

  return {
    title: `My Podcasts - ${username} - Pod Pirate`,
    description: `Manage your ${podcastCount} podcast${podcastCount !== 1 ? "s" : ""} on Pod Pirate. Create, edit, and publish episodes.`,
  };
}

interface DashboardPodcastsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function DashboardPodcastsPage({ searchParams }: DashboardPodcastsPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const status = params.status || "";
  const page = parseInt(params.page || "0");

  const data = await getUserPodcastsByQuery(
    page,
    (status as "DRAFT" | "FLAGGED" | "ARCHIVED" | "PUBLISHED") || null,
    search,
  );

  const podcasts = data?.content || [];
  const currentPage = data?.page?.number ?? page;
  const totalPages = data?.page?.totalPages ?? 0;

  return (
    <PageSection>
      <PageHeader
        title="Manage Podcasts"
        description="Create, edit, and manage your podcasts and episodes."
      />

      <Separator className="hidden sm:block" />

      <UserPodcastFilter initialSearch={search} initialStatus={status} />

      <UserPodcastGrid podcasts={podcasts} />

      <Paginator currentPage={currentPage} totalPages={totalPages} />
    </PageSection>
  );
}
