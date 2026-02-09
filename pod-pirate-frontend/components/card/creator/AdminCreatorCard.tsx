import { Calendar, IdCardIcon, List, LogInIcon, Mic2, RefreshCw } from "lucide-react";

import { AdminUserDetailResponse } from "@/types/api";
import { formatDate, getInitials } from "@/utils/format";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "../../ui/separator";
import { StatusBadge } from "../../ui/status-badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { isValidUrl } from "@/utils/validation/urlValidator";

interface AdminCreatorCardProps {
  user: AdminUserDetailResponse;
}

export default function AdminCreatorCard({ user }: AdminCreatorCardProps) {
  const isLocked = user.isLocked;
  const isVerified = user.isEmailVerified;
  const hasImage = isValidUrl(user.profileUrl);
  return (
    <Card
      aria-labelledby={`creator-name-${user.userId}`}
      aria-describedby={`creator-meta-${user.userId}`}
      className="border-border/50 overflow-hidden p-0 sm:flex sm:flex-row"
    >
      {/* Profile Picture */}
      <div className="bg-muted relative flex w-full items-center justify-center sm:w-fit">
        <div className="size-48">
          <AspectRatio ratio={1}>
            {hasImage ? (
              <Image
                src={user?.profileUrl || ""}
                alt={`${user.username}'s profile picture`}
                className="rounded-full object-cover transition-all duration-200"
                sizes="(max-width: 768px) 100vw, 192px"
                fill
              />
            ) : (
              <span className="border-muted-foreground text-muted-foreground flex h-48 items-center justify-center rounded-full border text-4xl font-extrabold">
                {getInitials(user.username)}
              </span>
            )}
          </AspectRatio>
        </div>

        <div className="absolute top-2 left-2 flex">
          {isLocked && <StatusBadge status="LOCKED" />}
          {isVerified ? <StatusBadge status="UNVERIFIED" /> : <StatusBadge status="VERIFIED" />}
        </div>
      </div>

      {/* Content */}
      <div
        className="flex flex-1 flex-col space-y-2.5 p-3 md:p-6"
        id={`creator-meta-${user.userId}`}
      >
        <div className="flex-1 space-y-2">
          <CardTitle
            id={`creator-name-${user.userId}`}
            className="line-clamp-2 text-sm leading-snug font-semibold md:text-xl lg:text-2xl"
          >
            {user.username}
          </CardTitle>

          {user.bio && (
            <CardDescription className="line-clamp-2 text-xs leading-relaxed md:line-clamp-3 md:text-sm">
              {user.bio}
            </CardDescription>
          )}
        </div>
        <div className="mt-auto space-y-2">
          <div className="flex flex-col items-start gap-x-4 gap-y-2 md:flex-row md:flex-wrap">
            {/* Podcast Count */}
            <div className="text-muted-foreground flex items-center gap-1.5">
              <Mic2 className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
              <CardDescription className="text-xs md:text-sm">
                {user.podcastCount ?? 0} {user.podcastCount === 1 ? "podcast" : "podcasts"}
              </CardDescription>
            </div>
            {/* Episode Count */}
            <div className="text-muted-foreground flex items-center gap-1.5">
              <List className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
              <CardDescription className="text-xs md:text-sm">
                {user.totalEpisodeCount ?? 0}{" "}
                {user.totalEpisodeCount === 1 ? "episode" : "episodes"}
              </CardDescription>
            </div>
            {/* id */}
            <div className="text-muted-foreground flex items-center gap-1.5">
              <IdCardIcon className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
              <CardDescription className="text-xs md:text-sm">{user.userId}</CardDescription>
            </div>
          </div>
          <Separator aria-hidden="true" />
          {/* Join Date */}
          <div className="flex flex-col items-start gap-x-4 gap-y-2 md:flex-row md:flex-wrap">
            <div className="text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
              <CardDescription className="text-xs md:text-sm">
                Joined {formatDate(user.createdDate)}
              </CardDescription>
            </div>

            <div className="text-muted-foreground flex items-center gap-1.5">
              <LogInIcon className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
              <CardDescription className="text-xs md:text-sm">
                Last Login {formatDate(user.lastLoginDate)}
              </CardDescription>
            </div>
            <div className="text-muted-foreground flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
              <CardDescription className="text-xs md:text-sm">
                Last Updated {formatDate(user.updatedDate)}
              </CardDescription>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
