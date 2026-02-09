"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { ArrowLeftIcon, FlagIcon, FlagOffIcon, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  handleAdminDeletePodcast,
  handleFlagPodcast,
  handleUnflagPodcast,
} from "@/actions/admin/podcasts";
import type { AdminPodcastResponse } from "@/types/api";

interface AdminPodcastActionsMenuProps {
  podcast: AdminPodcastResponse;
}

export const AdminPodcastActionsMenu = ({ podcast }: AdminPodcastActionsMenuProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [showUnflagDialog, setShowUnflagDialog] = useState(false);

  const handleFlag = async () => {
    setIsLoading(true);
    try {
      const result = await handleFlagPodcast(podcast.podcastId);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to flag podcast");
    } finally {
      setIsLoading(false);
      setShowFlagDialog(false);
    }
  };

  const handleUnflag = async () => {
    setIsLoading(true);
    try {
      const result = await handleUnflagPodcast(podcast.podcastId);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to unflag podcast");
    } finally {
      setIsLoading(false);
      setShowUnflagDialog(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await handleAdminDeletePodcast(podcast.podcastId);

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/podcasts");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to delete podcast");
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-full sm:h-10 sm:w-auto sm:px-4"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Back</span>
        </Button>
        <h1 className="line-clamp-2 text-sm leading-tight font-semibold sm:text-base md:text-lg lg:text-xl">
          <span className="text-primary">Admin Actions</span>{" "}
          <span className="text-muted-foreground">({podcast.title})</span>
        </h1>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {podcast.isFlagged ? (
          <Button variant="outline" onClick={() => setShowUnflagDialog(true)} disabled={isLoading}>
            <FlagOffIcon className="mr-2 h-4 w-4" />
            Unflag Podcast
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setShowFlagDialog(true)} disabled={isLoading}>
            <FlagIcon className="mr-2 h-4 w-4" />
            Flag Podcast
          </Button>
        )}

        <div className="flex-1" />

        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          disabled={isLoading}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Podcast
        </Button>
      </div>

      {/* Flag Dialog */}
      <AlertDialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Flag Podcast</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to flag this podcast? This will mark it for review and make it
              visible to other administrators.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFlag} disabled={isLoading}>
              {isLoading ? "Flagging..." : "Flag Podcast"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unflag Dialog */}
      <AlertDialog open={showUnflagDialog} onOpenChange={setShowUnflagDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unflag Podcast</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the flag from this podcast? This will mark it as
              reviewed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnflag} disabled={isLoading}>
              {isLoading ? "Unflagging..." : "Unflag Podcast"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Podcast</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this podcast? This action cannot be undone
              and will delete all episodes and associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
