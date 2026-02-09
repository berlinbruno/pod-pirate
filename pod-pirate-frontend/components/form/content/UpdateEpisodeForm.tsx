"use client";

import { useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateEpisodeSchema, type UpdateEpisodeFormInputs } from "@/utils/validation/formSchema";
import {
  handleUpdateEpisode,
  handleGetEpisodeImageUploadUrl,
  handleGetEpisodeAudioUploadUrl,
} from "@/actions/me/episodes";
import type { EpisodeDetailResponse, UpdateEpisodeRequest } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ImageIcon, Music, Loader2, Undo2 } from "lucide-react";
import { Session } from "next-auth";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface UpdateEpisodeFormProps {
  episode: EpisodeDetailResponse;
  podcastId: string;
}

export default function UpdateEpisodeForm({ episode, podcastId }: UpdateEpisodeFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    episode.coverUrl || "/placeholder/placeholder-1080x1080.webp",
  );
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(episode.audioUrl || null);
  const [audioDuration, setAudioDuration] = useState<number>(episode.durationSeconds || 0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const user = useCurrentUser() as Session["user"] & { accessToken?: string };
  const token = user?.accessToken;

  const form = useForm<UpdateEpisodeFormInputs>({
    resolver: zodResolver(updateEpisodeSchema),
    defaultValues: {
      title: episode.title || "",
      description: episode.description || "",
      durationSeconds: episode.durationSeconds || 0,
    },
  });

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
        toast.error("Please select a PNG, JPG, or WEBP image");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
        toast.error("Audio file must be less than 100MB");
        return;
      }
      setAudioFile(file);
      const audioUrl = URL.createObjectURL(file);
      setAudioPreview(audioUrl);

      // Load audio to get duration
      const audio = new Audio(audioUrl);
      audio.addEventListener("loadedmetadata", () => {
        const duration = Math.floor(audio.duration);
        setAudioDuration(duration);
        form.setValue("durationSeconds", duration);
      });
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    let extension: "PNG" | "JPG" | "WEBP" = "PNG";
    if (file.type === "image/jpeg") {
      extension = "JPG";
    } else if (file.type === "image/webp") {
      extension = "WEBP";
    }

    const urlResponse = await handleGetEpisodeImageUploadUrl(
      podcastId,
      episode.episodeId.toString(),
      extension,
    );

    if (!urlResponse.success || !urlResponse.data) {
      toast.error("Failed to get image upload URL");
      return null;
    }

    const uploadResult = await fetch(urlResponse.data.uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type,
      },
    });

    if (!uploadResult.ok) {
      toast.error("Failed to upload thumbnail");
      return null;
    }

    return urlResponse.data.blobPath;
  };

  const uploadAudio = async (file: File): Promise<string | null> => {
    let extension: "MP3" | "WAV" | "AAC" | "FLAC" | "OGG" = "MP3";
    const fileExt = file.name.split(".").pop()?.toUpperCase();

    if (["MP3", "WAV", "AAC", "FLAC", "OGG"].includes(fileExt || "")) {
      extension = fileExt as "MP3" | "WAV" | "AAC" | "FLAC" | "OGG";
    }

    const urlResponse = await handleGetEpisodeAudioUploadUrl(
      podcastId,
      episode.episodeId.toString(),
      extension,
    );

    if (!urlResponse.success || !urlResponse.data) {
      toast.error("Failed to get audio upload URL");
      return null;
    }

    const uploadResult = await fetch(urlResponse.data.uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type,
      },
    });

    if (!uploadResult.ok) {
      toast.error("Failed to upload audio");
      return null;
    }

    return urlResponse.data.blobPath;
  };

  const onSubmit = async (data: UpdateEpisodeFormInputs) => {
    if (!token) {
      toast.error("You must be logged in");
      return;
    }

    setIsLoading(true);

    try {
      const updateData: UpdateEpisodeRequest = {};

      // Only include changed text fields
      if (data.title !== episode.title) {
        updateData.title = data.title;
      }
      if (data.description !== episode.description) {
        updateData.description = data.description;
      }

      // Only include imageUrl if a new thumbnail was uploaded
      if (imageFile) {
        const uploadedImageUrl = await uploadImage(imageFile);
        if (!uploadedImageUrl) {
          setIsLoading(false);
          return;
        }
        updateData.imageUrl = uploadedImageUrl;
      }

      // Only include audioUrl if a new audio file was uploaded
      if (audioFile) {
        const uploadedAudioUrl = await uploadAudio(audioFile);
        if (!uploadedAudioUrl) {
          setIsLoading(false);
          return;
        }
        updateData.audioUrl = uploadedAudioUrl;
        // Update duration if new audio was uploaded
        updateData.durationSeconds = audioDuration;
      }

      // Check if anything changed
      if (Object.keys(updateData).length === 0) {
        toast.info("No changes to save");
        setIsLoading(false);
        return;
      }

      const result = await handleUpdateEpisode(podcastId, episode.episodeId.toString(), updateData);

      if (result.success) {
        toast.success(result.message);
        router.push(`/dashboard/podcasts/${encodeURIComponent(podcastId)}`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setImageFile(null);
    setAudioFile(null);
    setImagePreview(episode.coverUrl || "/placeholder/placeholder-1080x1080.webp");
    setAudioPreview(episode.audioUrl || null);
    setAudioDuration(episode.durationSeconds || 0);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form id="update-episode-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="update-episode-form-title">Episode Title</FieldLabel>
                <Input
                  {...field}
                  id="update-episode-form-title"
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
                <FieldLabel htmlFor="update-episode-form-description">Description</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id="update-episode-form-description"
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
              <FieldLabel>Episode Thumbnail</FieldLabel>
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
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                />
                <p className="text-muted-foreground text-xs">PNG, JPG, or WEBP (max 5MB)</p>
              </div>
            </div>

            {/* Audio File */}
            <div className="flex-1 space-y-2">
              <FieldLabel>Audio File</FieldLabel>
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
        <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
          <Undo2 className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button
          type="submit"
          form="update-episode-form"
          disabled={isLoading}
          size="lg"
          className="flex-1"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
