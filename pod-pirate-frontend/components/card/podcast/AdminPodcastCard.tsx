import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import { AdminPodcastDetailResponse } from "@/types/api";
import { categories } from "@/utils/data";
import { formatDate } from "@/utils/format";
import { isValidUrl } from "@/utils/validation/urlValidator";
import {
  Calendar,
  CalendarCheck,
  IdCardIcon,
  ListIcon,
  Radio,
  RefreshCw,
  TagIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AdminPodcastCardProps {
  podcast: AdminPodcastDetailResponse;
}

export default function AdminPodcastCard({ podcast }: AdminPodcastCardProps) {
  const creatorLink = `/admin/users/${encodeURIComponent(podcast.creatorId)}`;
  const hasImage = isValidUrl(podcast.bannerUrl);
  return (
    <Card
      aria-labelledby={`podcast-title-${podcast.podcastId}`}
      aria-describedby={`podcast-desc-${podcast.podcastId}`}
      className="group/card border-border/50 hover:border-border overflow-hidden p-0 transition-all hover:shadow-md"
    >
      {/* Banner */}
      <div className="bg-muted relative h-32 w-full overflow-hidden sm:h-40 md:h-48">
        {hasImage ? (
          <>
            <Image
              src={podcast.bannerUrl}
              alt={`Banner for podcast ${podcast.title}`}
              fill
              className="object-cover transition-all duration-200 group-hover/card:scale-105"
              sizes="100vw"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"
            />
          </>
        ) : (
          <div className="bg-muted flex h-full w-full items-center justify-center">
            <span className="text-muted-foreground line-clamp-1 text-4xl font-bold">
              {podcast.creatorName}
            </span>
          </div>
        )}
      </div>

      {/* Cover Image */}
      <div className="relative px-4 pt-0 pb-0 md:px-6">
        <div className="relative -mt-22.75 h-32 w-32 sm:-mt-28.5 sm:h-40 sm:w-40 md:-mt-34.25 md:h-48 md:w-48">
          <Image
            src={podcast.coverUrl}
            alt={`Cover art for podcast ${podcast.title}`}
            fill
            className="border-background rounded-lg border-4 object-cover shadow-xl"
            sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
          />
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1">
          {podcast.isFlagged && <StatusBadge status="FLAGGED" />}
          <StatusBadge status={podcast.podcastStatus} />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 p-4 pt-3 md:p-6 md:pt-4" id={`podcast-detail-${podcast.podcastId}`}>
        <div>
          <CardTitle
            className="mb-2 line-clamp-2 text-lg leading-tight md:text-xl lg:text-2xl"
            id={`podcast-title-${podcast.podcastId}`}
          >
            {podcast.title}
          </CardTitle>

          {podcast.description && (
            <CardDescription
              className="line-clamp-3 text-xs leading-relaxed md:line-clamp-4 md:text-sm"
              id={`podcast-desc-${podcast.podcastId}`}
            >
              {podcast.description}
            </CardDescription>
          )}
        </div>

        <div className="space-y-2 text-xs md:text-sm">
          <div className="flex flex-col items-start gap-x-4 gap-y-2 md:flex-row">
            {/* Creator */}
            <div className="w-fit">
              <Link
                href={creatorLink}
                className="group text-muted-foreground hover:text-foreground focus-visible:text-foreground -mx-1 flex items-center gap-1.5 rounded-sm px-1 py-0.5 focus-visible:outline-none"
                aria-label={`View creator profile: ${podcast.creatorName}`}
              >
                <UserIcon className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
                <CardDescription className="group-hover:text-foreground group-focus-visible:text-foreground line-clamp-1 text-xs md:text-sm">
                  @{podcast.creatorName}
                </CardDescription>
              </Link>
            </div>

            {/* Category */}
            <div className="w-fit">
              <div
                className="text-muted-foreground -mx-1 flex items-center gap-1.5 rounded-sm px-1 py-0.5"
                aria-label={`Filter by category ${categories[podcast.category as keyof typeof categories]}`}
              >
                <TagIcon className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
                <CardDescription className="group-hover:text-foreground group-focus-visible:text-foreground line-clamp-1 text-xs md:text-sm">
                  {categories[podcast.category as keyof typeof categories]}
                </CardDescription>
              </div>
            </div>

            {/* Episode count */}
            <div className="text-muted-foreground flex items-center gap-1.5">
              <ListIcon className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
              <CardDescription className="text-xs md:text-sm">
                {podcast.episodeCount} episode
                {podcast.episodeCount !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            {/* id */}
            <div className="w-fit">
              <div className="text-muted-foreground -mx-1 flex items-center gap-1.5 rounded-sm px-1 py-0.5">
                <IdCardIcon className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
                <CardDescription className="group-hover:text-foreground group-focus-visible:text-foreground line-clamp-1 text-xs md:text-sm">
                  {podcast.podcastId}
                </CardDescription>
              </div>
            </div>
          </div>

          <Separator aria-hidden="true" />

          {/* Stats */}
          <div className="flex flex-col gap-x-4 gap-y-2 md:flex-row md:flex-wrap">
            <div className="text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
              <CardDescription className="text-xs md:text-sm">
                Created {formatDate(podcast.createdDate)}
              </CardDescription>
            </div>
            <div className="text-muted-foreground flex items-center gap-1.5">
              <CalendarCheck className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
              <CardDescription className="text-xs md:text-sm">
                Published {formatDate(podcast.publishedDate)}
              </CardDescription>
            </div>

            <div className="text-muted-foreground flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
              <CardDescription className="text-xs md:text-sm">
                Last episode {formatDate(podcast.lastEpisodeDate)}
              </CardDescription>
            </div>

            <div className="text-muted-foreground flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
              <CardDescription className="text-xs md:text-sm">
                Last updated {formatDate(podcast.updatedDate)}
              </CardDescription>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
