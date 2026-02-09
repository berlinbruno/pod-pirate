import { AdminUserActionsMenu } from "@/components/action/AdminUserActionsMenu";
import AdminCreatorCard from "@/components/card/creator/AdminCreatorCard";
import PageHeader from "@/components/header/PageHeader";
import { PageSection } from "@/components/layout/PageSection";
import { Separator } from "@/components/ui/separator";
import { getAdminUserById } from "@/lib/api";
import { auth } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 0;

interface PageParams {
  userId: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await params;
  const session = await auth();
  const { accessToken } = session?.user || {};

  try {
    const user = await getAdminUserById(userId, accessToken);

    if (!user?.content) {
      return {
        title: "User Not Found - Pod Pirate Admin",
      };
    }

    const { username, email } = user.content;

    return {
      title: `${username} - Admin - Pod Pirate`,
      description: `Manage user ${username} (${email})`,
    };
  } catch {
    return {
      title: "User Not Found - Pod Pirate Admin",
    };
  }
}

export default async function AdminUserDetailPage({ params }: PageProps) {
  const session = await auth();
  const { accessToken } = session?.user || {};
  const { userId } = await params;

  const user = await getAdminUserById(userId, accessToken);

  if (!user) {
    notFound();
  }

  return (
    <PageSection>
      <PageHeader title="User Details" description="View and manage user account information." />

      <Separator className="hidden sm:block" />

      <AdminUserActionsMenu user={user.content} />

      <AdminCreatorCard user={user.content} />
    </PageSection>
  );
}
