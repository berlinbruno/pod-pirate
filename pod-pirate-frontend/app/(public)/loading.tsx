import { PageSection } from "@/components/layout/PageSection";
import FilterSkeleton from "@/components/skeleton/FilterSkeleton";
import GridSkeleton from "@/components/skeleton/GridSkeleton";
import PaginationSkeleton from "@/components/skeleton/PaginationSkeleton";

export default function PublicLandingPageLoading() {
  return (
    <PageSection>
      <FilterSkeleton />

      <GridSkeleton />

      <PaginationSkeleton />
    </PageSection>
  );
}
