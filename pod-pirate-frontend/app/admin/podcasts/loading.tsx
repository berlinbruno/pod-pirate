import { PageSection } from "@/components/layout/PageSection";
import { Separator } from "@/components/ui/separator";
import HeaderSkeleton from "@/components/skeleton/Headerskeleton";
import FilterSkeleton from "@/components/skeleton/FilterSkeleton";
import GridSkeleton from "@/components/skeleton/GridSkeleton";
import PaginationSkeleton from "@/components/skeleton/PaginationSkeleton";

export default function AdminPodcastsLoading() {
  return (
    <PageSection>
      <HeaderSkeleton variant="stacked" />

      <Separator className="hidden sm:block" />

      <FilterSkeleton />

      <GridSkeleton />

      <PaginationSkeleton />
    </PageSection>
  );
}
