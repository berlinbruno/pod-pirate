import { PageSection } from "@/components/layout/PageSection";
import FilterSkeleton from "@/components/skeleton/FilterSkeleton";
import GridSkeleton from "@/components/skeleton/GridSkeleton";
import HeaderSkeleton from "@/components/skeleton/Headerskeleton";
import PaginationSkeleton from "@/components/skeleton/PaginationSkeleton";
import { Separator } from "@/components/ui/separator";

export default function AdminUsersLoading() {
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
