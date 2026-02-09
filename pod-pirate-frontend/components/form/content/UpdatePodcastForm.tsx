"use client";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updatePodcastSchema, type UpdatePodcastFormInputs } from "@/utils/validation/formSchema";
import { handleUpdatePodcast, handleGetPodcastImageUploadUrl } from "@/actions/me/podcasts";
import type { PodcastDetailResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { ImageIcon, Loader2, Undo2 } from "lucide-react";
import { Session } from "next-auth";
import { categories } from "@/utils/data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useCurrentUser } from "@/hooks/use-current-user";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

interface UpdatePodcastFormProps {
  podcast: PodcastDetailResponse;
}

export default function UpdatePodcastForm({ podcast }: UpdatePodcastFormProps) {
  const user = useCurrentUser() as Session["user"] & { accessToken?: string };
  const token = user?.accessToken;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>(podcast.coverUrl);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>(podcast.bannerUrl || "");

  const form = useForm<UpdatePodcastFormInputs>({
    resolver: zodResolver(updatePodcastSchema),
    defaultValues: {
      title: podcast.title,
      description: podcast.description,
      category: podcast.category,
    },
  });

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (
    file: File,
    imageType: "PODCAST_COVER" | "PODCAST_BANNER",
  ): Promise<string | null> => {
    let extension: "PNG" | "JPG" | "WEBP" = "PNG";
    if (file.type === "image/jpeg") {
      extension = "JPG";
    } else if (file.type === "image/webp") {
      extension = "WEBP";
    } else if (file.type === "image/png") {
      extension = "PNG";
    }

    const urlResponse = await handleGetPodcastImageUploadUrl(
      podcast.podcastId,
      extension,
      imageType,
    );

    if (!urlResponse.success || !urlResponse.data) {
      toast.error("Failed to get upload URL");
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
      toast.error(`Failed to upload ${imageType.toLowerCase()}`);
      return null;
    }

    return urlResponse.data.blobPath;
  };

  const onSubmit = async (data: UpdatePodcastFormInputs) => {
    if (!token) {
      toast.error("You must be logged in");
      return;
    }

    setIsLoading(true);

    try {
      const updateData: {
        title?: string;
        description?: string;
        category?: string;
        coverUrl?: string;
        bannerUrl?: string;
      } = {};

      // Only include changed text fields
      if (data.title !== podcast.title) {
        updateData.title = data.title;
      }
      if (data.description !== podcast.description) {
        updateData.description = data.description;
      }
      if (data.category !== podcast.category) {
        updateData.category = data.category;
      }

      // Only include coverUrl if a new cover was uploaded
      if (coverFile) {
        const uploadedCoverUrl = await uploadImage(coverFile, "PODCAST_COVER");
        if (!uploadedCoverUrl) {
          setIsLoading(false);
          return;
        }
        updateData.coverUrl = uploadedCoverUrl;
      }

      // Only include bannerUrl if a new banner was uploaded
      if (bannerFile) {
        const uploadedBannerUrl = await uploadImage(bannerFile, "PODCAST_BANNER");
        if (!uploadedBannerUrl) {
          setIsLoading(false);
          return;
        }
        updateData.bannerUrl = uploadedBannerUrl;
      }

      // Check if anything changed
      if (Object.keys(updateData).length === 0) {
        toast.info("No changes to save");
        setIsLoading(false);
        return;
      }

      const result = await handleUpdatePodcast(podcast.podcastId, updateData);

      if (result.success) {
        toast.success(result.message);
        router.push(`/dashboard/podcasts/${encodeURIComponent(podcast.podcastId)}`);
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
    setCoverFile(null);
    setBannerFile(null);
    setCoverPreview(podcast.coverUrl);
    setBannerPreview(podcast.bannerUrl);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form id="update-podcast-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup className="grid gap-6 md:grid-cols-2">
            {/* Title Field */}
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-podcast-form-title">Title</FieldLabel>
                  <Input
                    {...field}
                    id="update-podcast-form-title"
                    placeholder="My Awesome Podcast"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Category Field */}
            <Controller
              control={form.control}
              name="category"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-podcast-form-category">Category</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="update-podcast-form-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categories).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          {/* Description Field */}
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="update-podcast-form-description">Description</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id="update-podcast-form-description"
                    placeholder="Tell us about your podcast..."
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
            {/* Cover Image */}
            <div className="space-y-2">
              <FieldLabel>Cover Image</FieldLabel>
              <div className="space-y-3">
                <div className="bg-muted relative flex justify-center overflow-hidden rounded-lg border">
                  <div className="flex size-52 items-center justify-center lg:size-60">
                    <AspectRatio ratio={1 / 1}>
                      {coverPreview ? (
                        <Image
                          src={coverPreview}
                          alt="Cover preview"
                          fill
                          className="object-contain"
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
                  onChange={handleCoverChange}
                />
              </div>
            </div>

            {/* Banner Image */}
            <div className="flex-1 space-y-2">
              <FieldLabel>Banner Image (Optional)</FieldLabel>
              <div className="space-y-3">
                <div className="bg-muted relative h-52 w-full overflow-hidden rounded-lg border lg:h-60">
                  <div className="flex h-52 items-center justify-center lg:h-60">
                    <AspectRatio ratio={3 / 1}>
                      {bannerPreview ? (
                        <Image
                          src={bannerPreview}
                          alt="Banner preview"
                          fill
                          className="object-contain"
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
                  onChange={handleBannerChange}
                />
              </div>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex gap-3">
        <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
          <Undo2 className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button
          type="submit"
          form="update-podcast-form"
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
