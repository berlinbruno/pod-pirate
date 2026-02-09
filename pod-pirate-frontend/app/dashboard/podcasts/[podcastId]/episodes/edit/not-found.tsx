import { PageSection } from "@/components/layout/PageSection";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { SearchX } from "lucide-react";
import Link from "next/link";

export default async function NotFound() {
  return (
    <PageSection className="flex min-h-screen items-center justify-center px-4 py-8">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX />
          </EmptyMedia>
          <EmptyTitle>Episode Not Found</EmptyTitle>
          <EmptyDescription>
            The episode you&apos;re trying to edit doesn&apos;t exist or you don&apos;t have
            permission to edit it.
          </EmptyDescription>
        </EmptyHeader>
        <Button asChild variant="default">
          <Link href="/dashboard/podcasts">Go to Dashboard</Link>
        </Button>
      </Empty>
    </PageSection>
  );
}
