import UserCreatorCard from "@/components/card/creator/UserCreatorCard";
import { getCurrentUser } from "@/lib/api";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { auth } from "@/lib/utils";
import { PageSection } from "@/components/layout/PageSection";
import PageHeader from "@/components/header/PageHeader";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();
  const currentUser = await getCurrentUser(session?.user.accessToken);

  const username = currentUser?.username || "User";

  return {
    title: `Dashboard - ${username} - Pod Pirate`,
    description: `Welcome to your Pod Pirate dashboard, ${username}. Manage your podcasts and episodes.`,
  };
}

export default async function DashboardPage() {
  const session = await auth();

  const currentUser = await getCurrentUser(session?.user.accessToken);

  return (
    <PageSection>
      <PageHeader title="Dashboard" description="Your podcast workspace." />
      <Separator className="hidden sm:block" />
      <UserCreatorCard user={currentUser} />

      <Separator className="hidden sm:block" />
    </PageSection>
  );
}
