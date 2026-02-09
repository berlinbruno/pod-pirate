import { Separator } from "@/components/ui/separator";
import { PageSection } from "@/components/layout/PageSection";
import EpisodeFormSkeleton from "@/components/skeleton/EpisodetFormSkeleton";
import HeaderSkeleton from "@/components/skeleton/Headerskeleton";

export default function DashboardNewEpisodeLoading() {
  return (
    <PageSection>
      <HeaderSkeleton variant="stacked" />
      <Separator className="hidden sm:block" />
      <EpisodeFormSkeleton />
    </PageSection>
  );
}
