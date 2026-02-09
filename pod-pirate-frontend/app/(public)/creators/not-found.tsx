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
          <EmptyTitle>Creator Not Found</EmptyTitle>
          <EmptyDescription>
            The creator profile you&apos;re looking for doesn&apos;t exist or has been removed.
          </EmptyDescription>
        </EmptyHeader>
        <Button asChild variant="default">
          <Link href="/">Go to Home</Link>
        </Button>
      </Empty>
    </PageSection>
  );
}
