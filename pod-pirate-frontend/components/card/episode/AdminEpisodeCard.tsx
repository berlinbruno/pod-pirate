"use client";
import { convertSecondsToHMS, formatDate } from "@/utils/format";
import { PlayIcon, CalendarCheck, Clock, RefreshCw, Hash, Calendar } from "lucide-react";
import Image from "next/image";
import { Card, CardDescription, CardTitle } from "../../ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { isValidUrl } from "@/utils/validation/urlValidator";
import { EpisodeDetailResponse } from "@/types/api";

interface AdminEpisodeCardProps {
  episode: EpisodeDetailResponse;
  play: boolean;
  onPlayClick?: () => void;
}

export default function AdminEpisodeCard({ episode, play, onPlayClick }: AdminEpisodeCardProps) {
  const duration = convertSecondsToHMS(episode.durationSeconds);
  const hasImage = isValidUrl(episode.coverUrl);
  return (
    <Card
      role="button"
      tabIndex={0}
      aria-pressed={play}
      aria-label={`${play ? "Pause" : "Play"} episode ${episode.title}`}
      aria-describedby={`episode-meta-${episode.episodeId}`}
      className="group/card border-border/50 hover:border-border focus-visible:ring-ring cursor-pointer gap-0 overflow-hidden p-0 transition-all hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
      onClick={onPlayClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPlayClick?.();
        }
      }}
    >
      <div className="xs:flex-row flex flex-col">
        {/* Cover Image */}
        <div className="bg-muted xs:size-50 relative overflow-hidden rounded-br-lg md:shrink-0 lg:size-56">
          <div className="aspect-square md:h-full">
            <AspectRatio ratio={1}>
              {hasImage ? (
                <Image
                  src={episode.coverUrl || ""}
                  alt={`Cover art for episode ${episode.title}`}
                  fill
                  loading="lazy"
                  className="object-cover transition-all duration-200 group-hover/card:brightness-75"
                  sizes="(max-width: 768px) 100vw, 192px"
                />
              ) : (
                <div className="bg-muted flex h-full w-full items-center justify-center">
                  <span className="text-muted-foreground text-4xl font-bold">
                    {episode.episodeId + 1}
                  </span>
                </div>
              )}
            </AspectRatio>
            {/* Play Overlay */}
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover/card:opacity-100"
            >
              <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full shadow-lg md:h-14 md:w-14">
                <PlayIcon className="ml-0.5 h-6 w-6 md:h-7 md:w-7" aria-hidden="true" />
              </div>
            </div>

            <div className="xs:left-2 absolute top-2 right-2">
              <StatusBadge status={episode.episodeStatus} />
            </div>
          </div>
        </div>

        <div
          className="flex flex-1 flex-col justify-between space-y-3 p-4 pb-0 md:p-6 md:pb-0"
          id={`episode-meta-${episode.episodeId}`}
        >
          <div>
            <CardTitle className="mb-2 line-clamp-2 flex-1 text-sm leading-snug font-semibold md:text-base lg:text-lg">
              {episode.title}
            </CardTitle>

            {episode.description && (
              <CardDescription className="line-clamp-3 text-xs leading-relaxed md:line-clamp-4 md:text-sm">
                {episode.description}
              </CardDescription>
            )}
          </div>

          <div className="flex gap-4">
            {/* Duration */}
            <div className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
              <CardDescription className="text-xs md:text-sm">{duration}</CardDescription>
            </div>
            <div className="text-muted-foreground flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
              <CardDescription className="text-xs md:text-sm">
                Episode ID: {episode.episodeId}
              </CardDescription>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="flex flex-row flex-wrap items-center gap-x-4 gap-y-2 p-4 pt-3 md:p-6 md:pt-4"
        id={`episode-meta-${episode.episodeId}`}
      >
        <Separator aria-hidden="true" />
        {/* Created Date */}
        <div className="text-muted-foreground flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
          <CardDescription className="text-xs md:text-sm">
            Created {formatDate(episode.createdDate)}
          </CardDescription>
        </div>

        {/* Published Date */}
        <div className="text-muted-foreground flex items-center gap-1.5">
          <CalendarCheck className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
          <CardDescription className="text-xs md:text-sm">
            Published {formatDate(episode.publishedDate)}
          </CardDescription>
        </div>

        {/* Updated Date */}
        <div className="text-muted-foreground flex items-center gap-1.5">
          <RefreshCw className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
          <CardDescription className="text-xs md:text-sm">
            Last updated {formatDate(episode.updatedDate)}
          </CardDescription>
        </div>
      </div>
    </Card>
  );
}
