import AdminUserGrid from "@/components/grid/AdminUserGrid";
import Paginator from "@/components/ui/paginator";
import { getAdminUsersByQuery } from "@/lib/api";
import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import AdminUserFilter from "@/components/filter/AdminUserFilter";
import { PageSection } from "@/components/layout/PageSection";
import PageHeader from "@/components/header/PageHeader";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin - Manage Users - Pod Pirate",
  description:
    "Manage and view all users on Pod Pirate platform. Monitor user accounts, status, and activity.",
};

interface AdminUsersPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    role?: string;
    page?: string;
  }>;
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const status = params.status || "";
  const role = params.role || "";
  const page = parseInt(params.page || "0");

  const data = await getAdminUsersByQuery(
    page,
    (status as "LOCKED" | "ACTIVE" | "PENDING_VERIFICATION") || null,
    (role as "USER" | "ADMIN") || null,
    search,
  );

  const users = data?.content || [];
  const totalPages = data?.page?.totalPages || 0;
  const currentPage = data?.page?.number ?? page;

  return (
    <PageSection>
      <PageHeader
        title="Manage Users"
        description="View and manage all user accounts on the platform."
      />

      <Separator className="hidden sm:block" />

      <AdminUserFilter initialSearch={search} initialStatus={status} />

      <AdminUserGrid users={users} />

      <Paginator currentPage={currentPage} totalPages={totalPages} />
    </PageSection>
  );
}
