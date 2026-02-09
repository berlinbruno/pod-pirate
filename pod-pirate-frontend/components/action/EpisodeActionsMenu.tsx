"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  handlePublishEpisode,
  handleArchiveEpisode,
  handleDeleteEpisode,
} from "@/actions/me/episodes";
import { Button } from "../ui/button";
import { Edit2, Trash2, Archive, Send } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ButtonGroup } from "../ui/button-group";
import { EpisodeDetailResponse } from "@/types/api";

interface EpisodeActionsMenuProps {
  episode: EpisodeDetailResponse;
  podcastId: string;
}

export default function EpisodeActionsMenu({ episode, podcastId }: EpisodeActionsMenuProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      const result = await handlePublishEpisode(podcastId, episode.episodeId.toString());

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsLoading(false);
      setShowPublishDialog(false);
    }
  };

  const handleArchive = async () => {
    setIsLoading(true);
    try {
      const result = await handleArchiveEpisode(podcastId, episode.episodeId.toString());

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsLoading(false);
      setShowArchiveDialog(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await handleDeleteEpisode(podcastId, episode.episodeId.toString());

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-3 md:flex-col">
        <ButtonGroup>
          <Button
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/dashboard/podcasts/${podcastId}/episodes/edit?episodeId=${episode.episodeId}`,
              );
            }}
            title="Edit Episode"
            aria-label="Edit Episode"
          >
            <Edit2 className="h-4 w-4" />
            <span className="md:hidden">Edit Episode</span>
          </Button>
        </ButtonGroup>
        <div className="flex-1"></div>
        <ButtonGroup className="hidden md:flex" orientation={"vertical"}>
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setShowPublishDialog(true);
            }}
            title="Publish Episode"
            disabled={episode.episodeStatus === "PUBLISHED" || isLoading}
            aria-label="Publish Episode"
          >
            <Send className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setShowArchiveDialog(true);
            }}
            title="Archive Episode"
            disabled={episode.episodeStatus === "ARCHIVED" || isLoading}
            aria-label="Archive Episode"
          >
            <Archive className="h-4 w-4" />
          </Button>

          <Button
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            title="Delete Episode"
            disabled={isLoading}
            aria-label="Delete Episode"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </ButtonGroup>
        <ButtonGroup className="md:hidden">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setShowPublishDialog(true);
            }}
            title="Publish Episode"
            disabled={episode.episodeStatus === "PUBLISHED" || isLoading}
            aria-label="Publish Episode"
          >
            <Send className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setShowArchiveDialog(true);
            }}
            title="Archive Episode"
            disabled={episode.episodeStatus === "ARCHIVED" || isLoading}
            aria-label="Archive Episode"
          >
            <Archive className="h-4 w-4" />
          </Button>

          <Button
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            title="Delete Episode"
            disabled={isLoading}
            aria-label="Delete Episode"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </ButtonGroup>
      </div>

      {/* Publish Dialog */}
      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Episode</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to publish &quot;{episode.title}&quot;? This will make it
              available to the public.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish} disabled={isLoading}>
              {isLoading ? "Publishing..." : "Publish Episode"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Archive Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Episode</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive &quot;{episode.title}&quot;? This will hide it from
              the public.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive} disabled={isLoading}>
              {isLoading ? "Archiving..." : "Archive Episode"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Episode</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{episode.title}&quot;? This action cannot be
              undone and will permanently remove the episode and all its data.
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
    </>
  );
}
