"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Upload, Trash2, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
  handleGetProfileImageUploadUrl,
  handleUpdateProfileImage,
  handleRemoveProfileImage,
} from "@/actions/me/profile";
import { getInitials } from "@/utils/format";
import type { UserProfileResponse } from "@/types/api";

interface Props {
  user?: UserProfileResponse;
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_MB = 5;

export default function UpdateProfileImageForm({ user }: Props) {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(user?.profileUrl ?? null);

  const [isPending, startTransition] = useTransition();

  const reset = () => {
    setFile(null);
    setPreview(user?.profileUrl ?? null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onFileSelect = (f?: File) => {
    if (!f) return;

    if (!ACCEPTED_TYPES.includes(f.type)) {
      toast.error("Only PNG, JPG, or WEBP images are allowed");
      return;
    }

    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f)); // 🔥 optimistic preview
  };

  const upload = () => {
    if (!file) return;

    const previous = user?.profileUrl ?? null;

    startTransition(async () => {
      try {
        const ext =
          file.type === "image/webp" ? "WEBP" : file.type === "image/jpeg" ? "JPG" : "PNG";

        const presign = await handleGetProfileImageUploadUrl(ext);
        if (!presign.success || !presign.data) {
          throw new Error(presign.message ?? "Failed to get upload URL");
        }

        const { uploadUrl, blobPath } = presign.data;

        const res = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
            "x-ms-blob-type": "BlockBlob",
          },
          body: file,
        });

        if (!res.ok) throw new Error("Upload failed");

        const update = await handleUpdateProfileImage(blobPath);
        if (!update.success) {
          throw new Error(update.message ?? "Profile update failed");
        }

        toast.success(update.message);
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";

        // Update session with new profile URL
        await updateSession({ profileUrl: update.data?.profileUrl });
        router.refresh();
      } catch {
        // ⛔ rollback
        setPreview(previous);
        toast.error("Failed to upload image");
      }
    });
  };

  const remove = () => {
    if (!user?.profileUrl) return;

    const previous = user.profileUrl;
    setPreview(null); // optimistic remove

    startTransition(async () => {
      try {
        const res = await handleRemoveProfileImage();
        if (!res.success) {
          throw new Error(res.message ?? "Remove failed");
        }

        toast.success(res.message);
        reset();

        // Update session to remove profile URL
        await updateSession({ profileUrl: null });
        router.refresh();
      } catch {
        // ⛔ rollback
        setPreview(previous);
        toast.error("Failed to remove image");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Image</CardTitle>
        <CardDescription>Upload a profile picture (PNG, JPG, WEBP · max 5MB)</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4">
        <Avatar className="h-32 w-32">
          <AvatarImage src={preview ?? undefined} />
          <AvatarFallback className="text-3xl">{getInitials(user?.username)}</AvatarFallback>
        </Avatar>

        <input
          ref={inputRef}
          type="file"
          hidden
          accept={ACCEPTED_TYPES.join(",")}
          onChange={(e) => onFileSelect(e.target.files?.[0])}
        />

        <Button variant="outline" onClick={() => inputRef.current?.click()} disabled={isPending}>
          <Upload className="mr-2 h-4 w-4" />
          Choose Image
        </Button>
      </CardContent>

      <CardFooter className="flex gap-2">
        {file && (
          <>
            <Button size="icon" variant="outline" onClick={reset} disabled={isPending}>
              <Undo2 />
            </Button>

            <Button onClick={upload} disabled={isPending} className="flex-1">
              {isPending ? "Uploading…" : "Upload"}
            </Button>
          </>
        )}

        {!file && user?.profileUrl && (
          <Button variant="destructive" onClick={remove} disabled={isPending} className="w-full">
            <Trash2 className="mr-2 h-4 w-4" />
            {isPending ? "Removing…" : "Remove"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
