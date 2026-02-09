import type { PodcastDetailResponse } from "@/types/api";
import UserPodcastGridCard from "../card/grid/UserPodcastGridCard";
import { Button } from "../ui/button";
import Link from "next/link";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { Mic2 } from "lucide-react";

interface UserPodcastGridProps {
  podcasts: ReadonlyArray<PodcastDetailResponse>;
}

export default function UserPodcastGrid({ podcasts }: UserPodcastGridProps) {
  if (podcasts.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Mic2 />
          </EmptyMedia>
          <EmptyTitle>No Podcasts Yet</EmptyTitle>
          <EmptyDescription>You haven&apos;t created any podcasts yet.</EmptyDescription>
        </EmptyHeader>
        <Button asChild>
          <Link href="/dashboard/podcasts/new">Create Your First Podcast</Link>
        </Button>
      </Empty>
    );
  }

  return (
    <article className="grid w-full grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      {podcasts.map((podcast) => (
        <UserPodcastGridCard key={podcast.podcastId} podcast={podcast} />
      ))}
    </article>
  );
}
