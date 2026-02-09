"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { ArrowLeftIcon, LockIcon, UnlockIcon, Trash2 } from "lucide-react";
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
import { handleDeleteUser, handleLockUser, handleUnlockUser } from "@/actions/admin/users";
import type { AdminUserDetailResponse } from "@/types/api";

interface AdminUserActionsMenuProps {
  user: AdminUserDetailResponse;
}

export const AdminUserActionsMenu = ({ user }: AdminUserActionsMenuProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);

  const handleLock = async () => {
    setIsLoading(true);
    try {
      const result = await handleLockUser(user.userId);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to lock user");
    } finally {
      setIsLoading(false);
      setShowLockDialog(false);
    }
  };

  const handleUnlock = async () => {
    setIsLoading(true);
    try {
      const result = await handleUnlockUser(user.userId);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to unlock user");
    } finally {
      setIsLoading(false);
      setShowUnlockDialog(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await handleDeleteUser(user.userId);

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/users");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to delete user");
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
          <span className="text-muted-foreground">({user.username})</span>
        </h1>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {user.isLocked ? (
          <Button variant="outline" onClick={() => setShowUnlockDialog(true)} disabled={isLoading}>
            <UnlockIcon className="mr-2 h-4 w-4" />
            Unlock User
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setShowLockDialog(true)} disabled={isLoading}>
            <LockIcon className="mr-2 h-4 w-4" />
            Lock User
          </Button>
        )}

        <div className="flex-1"></div>

        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          disabled={isLoading}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </Button>
      </div>

      {/* Lock Dialog */}
      <AlertDialog open={showLockDialog} onOpenChange={setShowLockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Lock User Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to lock this user account? The user will be unable to log in
              until the account is unlocked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLock} disabled={isLoading}>
              {isLoading ? "Locking..." : "Lock User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unlock Dialog */}
      <AlertDialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlock User Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unlock this user account? The user will be able to log in
              again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnlock} disabled={isLoading}>
              {isLoading ? "Unlocking..." : "Unlock User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this user account? This action cannot be
              undone and will delete all user data, podcasts, and episodes.
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
