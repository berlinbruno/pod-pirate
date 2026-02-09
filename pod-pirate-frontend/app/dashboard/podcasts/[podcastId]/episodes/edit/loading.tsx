import { Separator } from "@/components/ui/separator";
import { PageSection } from "@/components/layout/PageSection";
import HeaderSkeleton from "@/components/skeleton/Headerskeleton";
import EpisodeFormSkeleton from "@/components/skeleton/EpisodetFormSkeleton";

export default function DashboardEditEpisodeLoading() {
  return (
    <PageSection>
      <HeaderSkeleton variant="stacked" />
      <Separator className="hidden sm:block" />
      <EpisodeFormSkeleton />
    </PageSection>
  );
}
