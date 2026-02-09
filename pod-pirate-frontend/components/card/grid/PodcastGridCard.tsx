"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { PlayIcon, UserIcon, TagIcon, ListIcon, CalendarCheck, Radio } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "../../ui/aspect-ratio";
import { useRouter } from "next/navigation";
import { PodcastPublicResponse } from "@/types/api";
import { formatDate } from "@/utils/format";
import { categories } from "@/utils/data";
import { Separator } from "@/components/ui/separator";

interface PodcastGridCardProps {
  readonly podcast: PodcastPublicResponse;
}

export default function PodcastGridCard({ podcast }: PodcastGridCardProps) {
  const router = useRouter();

  const handlePodcastClick = () => {
    router.push(`/podcasts?podcastId=${encodeURIComponent(podcast.podcastId)}`);
  };

  const handleCreatorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/creators?creatorId=${encodeURIComponent(podcast.creatorId)}`);
  };

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const params = new URLSearchParams();
    params.set("category", podcast.category);
    router.push(`/?${params.toString()}`);
  };

  return (
    <Card
      role="link"
      tabIndex={0}
      aria-label={`Open podcast ${podcast.title}`}
      aria-describedby={`podcast-meta-${podcast.podcastId}`}
      className="group/card border-border/50 hover:border-border focus-visible:ring-ring h-full cursor-pointer overflow-hidden p-0 transition-all hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
      onClick={handlePodcastClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handlePodcastClick();
        }
      }}
    >
      {/* Cover */}
      <div className="bg-muted relative">
        <AspectRatio ratio={1}>
          <Image
            src={podcast.coverUrl}
            alt={`Cover art for podcast ${podcast.title}`}
            fill
            loading="lazy"
            className="object-cover transition-all duration-200 group-hover/card:brightness-75"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 240px"
          />

          {/* Play Overlay */}
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover/card:opacity-100"
          >
            <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full shadow-lg">
              <PlayIcon className="ml-0.5 h-6 w-6" aria-hidden />
            </div>
          </div>
        </AspectRatio>
      </div>

      {/* Content */}
      <div className="space-y-2.5 p-3" id={`podcast-meta-${podcast.podcastId}`}>
        <CardTitle className="line-clamp-2 min-h-10 text-sm leading-snug font-semibold">
          {podcast.title}
        </CardTitle>

        <div className="space-y-1.5 text-xs">
          {/* Creator */}
          <button
            type="button"
            onClick={handleCreatorClick}
            className="group text-muted-foreground hover:text-foreground focus-visible:text-foreground -mx-1 flex min-h-5 items-center gap-1.5 rounded-sm px-1 py-0.5 focus-visible:outline-none"
            aria-label={`View creator profile: ${podcast.creatorName}`}
          >
            <UserIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <CardDescription className="group-hover:text-foreground group-focus-visible:text-foreground line-clamp-1 text-xs">
              {`@${podcast.creatorName}`}
            </CardDescription>
          </button>

          {/* Category */}
          <div className="w-fit">
            <button
              type="button"
              onClick={handleCategoryClick}
              className="group text-muted-foreground hover:text-foreground focus-visible:text-foreground -mx-1 flex min-h-5 items-center gap-1.5 rounded-sm px-1 py-0.5 focus-visible:outline-none"
              aria-label={`Filter podcasts by category ${categories[podcast.category as keyof typeof categories]}`}
            >
              <TagIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <CardDescription className="group-hover:text-foreground group-focus-visible:text-foreground line-clamp-1 text-xs">
                {categories[podcast.category as keyof typeof categories]}
              </CardDescription>
            </button>
          </div>

          {/* Episode Count */}
          <div className="text-muted-foreground -mx-1 flex items-center gap-1.5 px-1">
            <ListIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <CardDescription className="line-clamp-1 text-xs">
              {podcast.episodeCount} episode
              {podcast.episodeCount !== 1 ? "s" : ""}
            </CardDescription>
          </div>

          {/* Dates */}
          {podcast.lastEpisodeDate && (
            <>
              <Separator />
              <div className="-mx-1 flex items-center gap-1.5 px-1">
                <CalendarCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <CardDescription className="line-clamp-1 text-xs">
                  Published {formatDate(podcast.publishedDate)}
                </CardDescription>
              </div>
              <div className="-mx-1 flex items-center gap-1.5 px-1">
                <Radio className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <CardDescription className="line-clamp-1 text-xs">
                  Last episode {formatDate(podcast.lastEpisodeDate)}
                </CardDescription>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
