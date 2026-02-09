import { redirect } from "next/navigation";

export const metadata = {
  title: "Manage Episodes",
};

export default async function DashboardPodcastEpisodesPage() {
  redirect("/dashboard/podcasts");
}
