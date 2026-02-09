import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { UserIcon, MailIcon, CalendarIcon, ShieldIcon, Mic2, LogIn } from "lucide-react";
import Image from "next/image";
import { AdminUserResponse } from "@/types/api";
import { formatDate, getInitials } from "@/utils/format";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { isValidUrl } from "@/utils/validation/urlValidator";

interface UserGridCardProps {
  readonly user: AdminUserResponse;
}

export default function UserGridCard({ user }: UserGridCardProps) {
  const isLocked = user.isLocked;
  const isVerified = user.isEmailVerified;
  const hasImage = isValidUrl(user.profileUrl);
  return (
    <Link
      href={`/admin/users/${encodeURIComponent(user.userId)}`}
      className="focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:outline-none"
    >
      <Card
        aria-label={`View user profile: ${user.username}`}
        aria-describedby={`user-meta-${user.userId}`}
        className={`group/card h-full cursor-pointer overflow-hidden p-0 transition-all hover:shadow-md`}
      >
        {/* Profile Image */}
        <div className="bg-muted relative">
          <AspectRatio ratio={1}>
            {hasImage ? (
              <Image
                src={user.profileUrl || "s"}
                alt={`${user.username} profile`}
                fill
                loading="lazy"
                className="object-cover transition-all duration-200 group-hover/card:brightness-75"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 240px"
              />
            ) : (
              <span className="border-muted-foreground text-muted-foreground flex h-full items-center justify-center rounded-full border text-4xl font-extrabold">
                {getInitials(user.username)}
              </span>
            )}

            {/* Hover Overlay */}
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover/card:opacity-100"
            >
              <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full shadow-lg">
                <UserIcon className="h-6 w-6" aria-hidden />
              </div>
            </div>

            {/* Status Badges */}
            <div className="absolute top-2 right-2 flex flex-col gap-1.5">
              {isLocked && <StatusBadge status="LOCKED" />}
              {isVerified ? <StatusBadge status="UNVERIFIED" /> : <StatusBadge status="VERIFIED" />}
            </div>
          </AspectRatio>
        </div>

        {/* Content */}
        <div className="space-y-2.5 p-3" id={`user-meta-${user.userId}`}>
          <CardTitle className="line-clamp-2 min-h-10 text-sm leading-snug font-semibold">
            {user.username}
          </CardTitle>

          <div className="space-y-1.5 text-xs">
            {/* Email */}
            <div className="text-muted-foreground -mx-1 flex items-center gap-1.5 px-1">
              <MailIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <CardDescription className="line-clamp-1 text-xs">{user.email}</CardDescription>
            </div>

            {/* Roles */}
            {user.roles && user.roles.length > 0 && (
              <div className="text-muted-foreground -mx-1 flex items-center gap-1.5 px-1">
                <ShieldIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role) => (
                    <Badge key={role} variant="outline" className="h-4 px-1 text-[10px]">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Podcast Count */}
            <div className="text-muted-foreground -mx-1 flex items-center gap-1.5 px-1">
              <Mic2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <CardDescription className="line-clamp-1 text-xs">
                {user.podcastCount} podcast{user.podcastCount !== 1 ? "s" : ""}
              </CardDescription>
            </div>

            {/* Dates */}
            <>
              <Separator aria-hidden />
              <div className="-mx-1 flex items-center gap-1.5 px-1">
                <CalendarIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <CardDescription className="line-clamp-1 text-xs">
                  Joined {formatDate(user.createdDate)}
                </CardDescription>
              </div>

              <div className="-mx-1 flex items-center gap-1.5 px-1">
                <LogIn className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <CardDescription className="line-clamp-1 text-xs">
                  Last login {formatDate(user.lastLoginDate)}
                </CardDescription>
              </div>
            </>
          </div>
        </div>
      </Card>
    </Link>
  );
}
