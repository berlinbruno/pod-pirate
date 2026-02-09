import PodcastForm from "@/components/form/content/PodcastForm";
import PageHeader from "@/components/header/PageHeader";
import { PageSection } from "@/components/layout/PageSection";
import { Separator } from "@/components/ui/separator";

export const revalidate = 0;

export const metadata = {
  title: "New Podcast - Pod Pirate",
  description: "Create a new podcast on Pod Pirate",
};

export default async function DashboardNewPodcastPage() {
  return (
    <PageSection>
      <PageHeader
        title="Create New Podcast"
        description="Fill in the details to create your podcast."
      />

      <Separator className="hidden sm:block" />

      <PodcastForm />
    </PageSection>
  );
}
