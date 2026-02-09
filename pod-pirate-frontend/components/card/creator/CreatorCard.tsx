import { Calendar, Mic2 } from "lucide-react";
import { CreatorPublicResponse } from "@/types/api";
import { Card, CardTitle, CardDescription } from "../../ui/card";
import { Separator } from "../../ui/separator";
import Image from "next/image";
import { formatDate, getInitials } from "@/utils/format";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { isValidUrl } from "@/utils/validation/urlValidator";

interface CreatorCardProps {
  creator: CreatorPublicResponse;
}

export default function CreatorCard({ creator }: CreatorCardProps) {
  const hasImage = isValidUrl(creator.profileUrl);
  return (
    <Card
      aria-labelledby={`creator-name-${creator.creatorId}`}
      aria-describedby={`creator-meta-${creator.creatorId}`}
      className="border-border/50 overflow-hidden p-0 sm:flex sm:flex-row"
    >
      {/* Profile Picture */}
      <div className="bg-muted flex w-full items-center justify-center sm:w-fit">
        <div className="size-48">
          <AspectRatio ratio={1}>
            {hasImage ? (
              <Image
                src={creator?.profileUrl || ""}
                alt={`${creator.creatorName}'s profile picture`}
                className="rounded-full object-cover transition-all duration-200"
                sizes="(max-width: 768px) 100vw, 192px"
                fill
              />
            ) : (
              <span className="border-muted-foreground text-muted-foreground flex h-48 items-center justify-center rounded-full border text-4xl font-extrabold">
                {getInitials(creator.creatorName)}
              </span>
            )}
          </AspectRatio>
        </div>
      </div>

      {/* Content */}
      <div
        className="flex flex-1 flex-col space-y-2.5 p-3 md:p-6"
        id={`creator-meta-${creator.creatorId}`}
      >
        <div className="flex-1 space-y-2">
          <CardTitle
            id={`creator-name-${creator.creatorId}`}
            className="line-clamp-2 text-sm leading-snug font-semibold md:text-xl lg:text-2xl"
          >
            {creator.creatorName}
          </CardTitle>

          {creator.bio && (
            <CardDescription className="line-clamp-2 text-xs leading-relaxed md:line-clamp-3 md:text-sm">
              {creator.bio}
            </CardDescription>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-4 text-xs md:text-sm">
          {/* Podcast Count */}
          <div className="text-muted-foreground flex items-center gap-1.5">
            <Mic2 className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
            <CardDescription className="text-xs md:text-sm">
              {creator.podcastCount ?? 0} {creator.podcastCount === 1 ? "podcast" : "podcasts"}
            </CardDescription>
          </div>

          {/* Join Date */}
          <Separator orientation="vertical" className="h-4 md:h-5" aria-hidden="true" />
          <div className="text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
            <CardDescription className="text-xs md:text-sm">
              Joined {formatDate(creator.joinedDate)}
            </CardDescription>
          </div>
        </div>
      </div>
    </Card>
  );
}
