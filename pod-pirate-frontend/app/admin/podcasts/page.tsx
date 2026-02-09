import { AdminPodcastResponse } from "@/types/api";
import { getAdminPodcastsByQuery } from "@/lib/api";
import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import AdminPodcastGrid from "@/components/grid/AdminPodcastGrid";
import Paginator from "@/components/ui/paginator";
import AdminPodcastFilter from "@/components/filter/AdminPodcastFilter";
import { PageSection } from "@/components/layout/PageSection";
import PageHeader from "@/components/header/PageHeader";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin - Manage Podcasts - Pod Pirate",
  description:
    "Manage and moderate all podcasts on Pod Pirate platform. Review, flag, and manage podcast content.",
};

interface AdminPodcastsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AdminPodcastsPage({ searchParams }: AdminPodcastsPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const status = params.status || "";
  const page = parseInt(params.page || "0");

  const data = await getAdminPodcastsByQuery(
    page,
    (status as "DRAFT" | "FLAGGED" | "ARCHIVED" | "PUBLISHED") || null,
    search,
  );
  const podcasts: AdminPodcastResponse[] = data?.content || [];
  const totalPages = data?.page?.totalPages || 0;
  const currentPage = data?.page?.number ?? page;

  return (
    <PageSection>
      <PageHeader
        title="Moderate podcasts"
        description="Review and moderate all podcasts on the platform"
      />

      <Separator className="hidden sm:block" />

      <AdminPodcastFilter initialSearch={search} initialStatus={status} />

      <AdminPodcastGrid podcasts={podcasts} />

      <Paginator currentPage={currentPage} totalPages={totalPages} />
    </PageSection>
  );
}
