"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Archive, ArrowLeftIcon, Edit2, Plus, Send, Trash2 } from "lucide-react";
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
  handleArchivePodcast,
  handleDeletePodcast,
  handlePublishPodcast,
} from "@/actions/me/podcasts";
import type { PodcastDetailResponse } from "@/types/api";
import { ButtonGroup } from "../ui/button-group";

interface PodcastActionsMenuProps {
  podcast: PodcastDetailResponse;
}

export default function PodcastActionsMenu({ podcast }: PodcastActionsMenuProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      const result = await handlePublishPodcast(podcast.podcastId);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to publish podcast");
    } finally {
      setIsLoading(false);
      setShowPublishDialog(false);
    }
  };

  const handleArchive = async () => {
    setIsLoading(true);
    try {
      const result = await handleArchivePodcast(podcast.podcastId);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to archive podcast");
    } finally {
      setIsLoading(false);
      setShowArchiveDialog(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await handleDeletePodcast(podcast.podcastId);

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard");
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
          <span className="text-primary">Episodes</span>{" "}
          <span className="text-muted-foreground">({podcast.episodeCount})</span>
        </h1>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <ButtonGroup>
          <Button
            onClick={() => router.push(`/dashboard/podcasts/${podcast.podcastId}/episodes/new`)}
            aria-label="Create new episode"
          >
            <Plus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:block">New Episode</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/podcasts/${podcast.podcastId}/edit`)}
            aria-label="Edit podcast details"
          >
            <Edit2 className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:block">Edit Podcast</span>
          </Button>
        </ButtonGroup>

        <div className="flex-1"></div>
        <ButtonGroup>
          <Button
            variant="secondary"
            onClick={() => setShowArchiveDialog(true)}
            disabled={isLoading || podcast.podcastStatus === "ARCHIVED"}
            aria-label="Archive podcast"
          >
            <Archive className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:block">Archive Podcast</span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => setShowPublishDialog(true)}
            disabled={
              isLoading || podcast.episodeCount === 0 || podcast.podcastStatus === "PUBLISHED"
            }
            aria-label="Publish podcast"
          >
            <Send className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:block">Publish Podcast</span>
          </Button>

          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isLoading}
            aria-label="Delete podcast"
          >
            <Trash2 className="h-4 w-4 md:mr-2" />
            <span className="hidden md:block">Delete Podcast</span>
          </Button>
        </ButtonGroup>
      </div>

      {/* Publish Dialog */}
      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Podcast</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to publish this podcast? It will become visible to all users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish} disabled={isLoading}>
              {isLoading ? "Publishing..." : "Publish Podcast"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Archive Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Podcast</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive this podcast? It will no longer be visible to users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive} disabled={isLoading}>
              {isLoading ? "Archiving..." : "Archive Podcast"}
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
              Are you sure you want to delete this podcast? This action cannot be undone and will
              permanently delete all episodes.
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
}
