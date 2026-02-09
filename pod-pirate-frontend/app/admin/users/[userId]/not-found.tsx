import { PageSection } from "@/components/layout/PageSection";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { UserX } from "lucide-react";
import Link from "next/link";

export default async function NotFound() {
  return (
    <PageSection className="flex min-h-screen items-center justify-center px-4 py-8">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UserX />
          </EmptyMedia>
          <EmptyTitle>User Not Found</EmptyTitle>
          <EmptyDescription>
            The user you&apos;re looking for doesn&apos;t exist or has been removed.
          </EmptyDescription>
        </EmptyHeader>
        <div className="flex gap-4">
          <Button asChild variant="default">
            <Link href="/admin">Admin Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/users">View All Users</Link>
          </Button>
        </div>
      </Empty>
    </PageSection>
  );
}
