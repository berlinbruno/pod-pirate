"use client";

import {
  handleCreateEpisode,
  handleGetEpisodeAudioUploadUrl,
  handleGetEpisodeImageUploadUrl,
  handleUpdateEpisode,
} from "@/actions/me/episodes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { ImageIcon, Music, Undo2 } from "lucide-react";
import { CreateEpisodeFormInputs, createEpisodeSchema } from "@/utils/validation/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Session } from "next-auth";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatDuration } from "@/utils/format";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface EpisodeFormProps {
  podcastId: string;
}

const EpisodeForm = ({ podcastId }: EpisodeFormProps) => {
  const router = useRouter();
  const user = useCurrentUser() as Session["user"] & { accessToken?: string };
  const token = user?.accessToken;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    "/placeholder/placeholder-1080x1080.webp",
  );
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const form = useForm<CreateEpisodeFormInputs>({
    resolver: zodResolver(createEpisodeSchema),
    defaultValues: {
      title: "",
      description: "",
      durationSeconds: 0,
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a PNG, JPG, or WEBP image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/aac",
      "audio/flac",
      "audio/ogg",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid audio file (MP3, WAV, AAC, FLAC, OGG)");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error("Audio file size must be less than 100MB");
      return;
    }

    setAudioFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const audioUrl = reader.result as string;
      setAudioPreview(audioUrl);

      // Load audio to get duration
      const audio = new Audio(audioUrl);
      audio.addEventListener("loadedmetadata", () => {
        const duration = Math.floor(audio.duration);
        setAudioDuration(duration);
        form.setValue("durationSeconds", duration);
      });
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (episodeId: string, file: File): Promise<string | null> => {
    if (!file || !token) return null;

    try {
      let extension: "PNG" | "JPG" | "WEBP" = "PNG";
      if (file.type === "image/jpeg" || file.type === "image/jpg") {
        extension = "JPG";
      } else if (file.type === "image/webp") {
        extension = "WEBP";
      }

      const uploadUrlResult = await handleGetEpisodeImageUploadUrl(podcastId, episodeId, extension);

      if (!uploadUrlResult.success || !uploadUrlResult.data) {
        toast.error(uploadUrlResult.message || "Failed to get image upload URL");
        return null;
      }

      const { uploadUrl, blobPath } = uploadUrlResult.data;

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        toast.error("Failed to upload thumbnail");
        return null;
      }

      return blobPath;
    } catch (error) {
      toast.error("Error uploading thumbnail");
      return null;
    }
  };

  const uploadAudio = async (episodeId: string, file: File): Promise<string | null> => {
    if (!file || !token) return null;

    try {
      let extension: "MP3" | "WAV" | "AAC" | "FLAC" | "OGG" = "MP3";
      const fileExt = file.name.split(".").pop()?.toUpperCase();

      if (["MP3", "WAV", "AAC", "FLAC", "OGG"].includes(fileExt || "")) {
        extension = fileExt as "MP3" | "WAV" | "AAC" | "FLAC" | "OGG";
      }

      const uploadUrlResult = await handleGetEpisodeAudioUploadUrl(podcastId, episodeId, extension);

      if (!uploadUrlResult.success || !uploadUrlResult.data) {
        toast.error(uploadUrlResult.message || "Failed to get audio upload URL");
        return null;
      }

      const { uploadUrl, blobPath } = uploadUrlResult.data;

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        toast.error("Failed to upload audio");
        return null;
      }

      return blobPath;
    } catch (error) {
      toast.error("Error uploading audio");
      return null;
    }
  };

  const onSubmit = async (data: CreateEpisodeFormInputs) => {
    if (!token) {
      toast.error("Access token is missing. Please login again.");
      return;
    }

    if (!audioFile) {
      toast.error("Please select an audio file");
      return;
    }

    if (!audioDuration || audioDuration < 1) {
      toast.error("Please wait for audio to load or select a valid audio file");
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Create episode
      const createResult = await handleCreateEpisode(podcastId, {
        title: data.title,
        description: data.description,
        durationSeconds: audioDuration,
      });

      if (!createResult?.success || !createResult?.data) {
        toast.error(createResult?.message || "Failed to create episode");
        return;
      }

      const episodeId = createResult.data.episodeId.toString();
      toast.success("Episode created! Uploading files...");

      // Step 2: Upload audio file (required)
      const audioUrl = await uploadAudio(episodeId, audioFile);
      if (!audioUrl) {
        toast.error("Failed to upload audio file");
        return;
      }

      // Step 3: Upload thumbnail image (optional)
      let imageUrl: string | undefined = undefined;
      if (imageFile) {
        const uploadedImageUrl = await uploadImage(episodeId, imageFile);
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        }
      }

      // Step 4: Update episode with file URLs
      const updateData: {
        audioUrl: string;
        imageUrl?: string;
        durationSeconds: number;
      } = {
        audioUrl,
        durationSeconds: audioDuration,
      };

      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      const updateResult = await handleUpdateEpisode(podcastId, episodeId, updateData);

      if (updateResult?.success) {
        toast.success("Episode created successfully!");
        router.push(`/dashboard/podcasts/${encodeURIComponent(podcastId)}`);
      } else {
        toast.error(updateResult?.message || "Failed to update episode files");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setImageFile(null);
    setAudioFile(null);
    setImagePreview("/placeholder/placeholder-1080x1080.webp");
    setAudioPreview(null);
    setAudioDuration(0);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form id="create-episode-form" className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Title Field */}
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="create-episode-form-title">Episode Title</FieldLabel>
                <Input
                  {...field}
                  id="create-episode-form-title"
                  placeholder="Episode 1: Introduction"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Description Field */}
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="create-episode-form-description">Description</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id="create-episode-form-description"
                    placeholder="Describe what this episode is about..."
                    rows={6}
                    className="resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field.value.length}/300 characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>Maximum 300 characters</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Thumbnail Image */}
            <div className="space-y-2">
              <Label htmlFor="image">Episode Thumbnail (Optional)</Label>
              <div className="space-y-3">
                <div className="bg-muted relative flex justify-center overflow-hidden rounded-lg border">
                  <div className="flex size-52 items-center justify-center lg:size-60">
                    <AspectRatio ratio={1 / 1}>
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Thumbnail preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon className="text-muted-foreground h-12 w-12" />
                        </div>
                      )}
                    </AspectRatio>
                  </div>
                </div>
                <Input
                  id="image"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
                />
                <p className="text-muted-foreground text-xs">PNG, JPG, or WEBP (max 5MB)</p>
              </div>
            </div>

            {/* Audio File */}
            <div className="flex-1 space-y-2">
              <Label htmlFor="audio">Audio File (Required)</Label>
              <div className="space-y-3">
                <div className="bg-muted relative h-52 w-full overflow-hidden rounded-lg border lg:h-60">
                  {audioPreview ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
                      <Music className="text-primary h-12 w-12" />
                      <div className="text-center">
                        <p className="text-sm font-medium">Audio Selected</p>
                        {audioDuration > 0 && (
                          <p className="text-muted-foreground mt-1 text-xs">
                            Duration: {formatDuration(audioDuration)}
                          </p>
                        )}
                      </div>
                      <audio ref={audioRef} src={audioPreview} controls className="w-full" />
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Music className="text-muted-foreground h-12 w-12" />
                    </div>
                  )}
                </div>
                <Input
                  id="audio"
                  type="file"
                  accept="audio/mpeg,audio/mp3,audio/wav,audio/aac,audio/flac,audio/ogg"
                  onChange={handleAudioChange}
                />
                <p className="text-muted-foreground text-xs">
                  MP3, WAV, AAC, FLAC, or OGG (max 100MB)
                </p>
              </div>
            </div>
          </div>

          {/* Duration Display */}
          {audioDuration > 0 && (
            <div className="bg-muted/50 rounded-lg border p-4">
              <p className="text-sm font-medium">
                Episode Duration: {formatDuration(audioDuration)}
              </p>
            </div>
          )}
        </form>
      </CardContent>

      <CardFooter className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={form.formState.isSubmitting || isUploading}
        >
          <Undo2 className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button
          type="submit"
          form="create-episode-form"
          className="flex-1"
          size="lg"
          disabled={form.formState.isSubmitting || isUploading || !audioFile}
        >
          {isUploading
            ? "Creating & Uploading..."
            : form.formState.isSubmitting
              ? "Creating..."
              : "Create Episode"}
        </Button>
      </CardFooter>
    </Card>
  );
};
export default EpisodeForm;
