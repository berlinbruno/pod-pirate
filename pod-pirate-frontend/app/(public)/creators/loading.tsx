import { PageSection } from "@/components/layout/PageSection";
import CreatorCardSkeleton from "@/components/skeleton/CreatorCardSkeleton";
import PodcastGridSkeleton from "@/components/skeleton/GridSkeleton";
import Headerskeleton from "@/components/skeleton/Headerskeleton";
import PaginationSkeleton from "@/components/skeleton/PaginationSkeleton";
import { Separator } from "@/components/ui/separator";

export default function PublicCreatorsLoading() {
  return (
    <PageSection>
      <CreatorCardSkeleton />

      <Separator className="hidden sm:block" />

      <Headerskeleton />

      <PodcastGridSkeleton />

      <PaginationSkeleton />
    </PageSection>
  );
}
