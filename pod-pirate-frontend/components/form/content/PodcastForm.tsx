"use client";

import {
  handleCreatePodcast,
  handleGetPodcastImageUploadUrl,
  handleUpdatePodcast,
} from "@/actions/me/podcasts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ImageIcon, Undo2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/utils/data";
import { CreatePodcastFormInputs, createPodcastSchema } from "@/utils/validation/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm, useFormState } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const PodcastForm = () => {
  const router = useRouter();

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>(
    "/placeholder/placeholder-1080x1080.webp",
  );
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    "/placeholder/placeholder-1200x400.webp",
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const form = useForm<CreatePodcastFormInputs>({
    resolver: zodResolver(createPodcastSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
    },
  });

  const { errors, isSubmitting } = useFormState({
    control: form.control,
  });

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    setBannerFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (
    podcastId: string,
    file: File,
    imageType: "PODCAST_COVER" | "PODCAST_BANNER",
  ): Promise<string | null> => {
    if (!file) return null;

    try {
      let extension: "PNG" | "JPG" | "WEBP" = "PNG";
      if (file.type === "image/jpeg" || file.type === "image/jpg") {
        extension = "JPG";
      } else if (file.type === "image/webp") {
        extension = "WEBP";
      }

      const uploadUrlResult = await handleGetPodcastImageUploadUrl(podcastId, extension, imageType);

      if (!uploadUrlResult.success || !uploadUrlResult.data) {
        toast.error(uploadUrlResult.message || "Failed to get upload URL");
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
        toast.error(`Failed to upload ${imageType.toLowerCase()}`);
        return null;
      }

      return blobPath;
    } catch (error) {
      toast.error(`Error uploading ${imageType.toLowerCase()}`);
      return null;
    }
  };

  const onSubmit = async (data: CreatePodcastFormInputs) => {
    if (!coverFile) {
      toast.error("Please select a cover image");
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Create podcast
      const createResult = await handleCreatePodcast(data);

      if (!createResult?.success || !createResult?.data) {
        toast.error(createResult?.message || "Failed to create podcast");
        return;
      }

      const podcastId = createResult.data.podcastId;
      toast.success("Podcast created! Uploading images...");

      // Step 2: Upload cover image (required)
      const coverUrl = await uploadImage(podcastId, coverFile, "PODCAST_COVER");
      if (!coverUrl) {
        toast.error("Failed to upload cover image");
        return;
      }

      // Step 3: Upload banner image (optional)
      let bannerUrl: string | undefined = undefined;
      if (bannerFile) {
        const uploadedBannerUrl = await uploadImage(podcastId, bannerFile, "PODCAST_BANNER");
        if (uploadedBannerUrl) {
          bannerUrl = uploadedBannerUrl;
        }
      }

      // Step 4: Update podcast with image URLs
      const updateData: {
        coverUrl: string;
        bannerUrl?: string;
      } = { coverUrl };

      if (bannerUrl) {
        updateData.bannerUrl = bannerUrl;
      }

      const updateResult = await handleUpdatePodcast(podcastId, updateData);

      if (updateResult?.success) {
        toast.success("Podcast created successfully!");
        router.push(`/dashboard/podcasts/${encodeURIComponent(podcastId)}`);
      } else {
        toast.error(updateResult?.message || "Failed to update podcast images");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setCoverFile(null);
    setBannerFile(null);
    setCoverPreview("/placeholder/placeholder-1080x1080.webp");
    setBannerPreview("/placeholder/placeholder-1200x400.webp");
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form id="create-podcast-form" className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="grid gap-6 md:grid-cols-2">
            {/* Title Field */}
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-podcast-form-title">Title</FieldLabel>
                  <Input
                    {...field}
                    id="create-podcast-form-title"
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
                  <FieldLabel htmlFor="create-podcast-form-category">Category</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="create-podcast-form-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {Object.entries(categories).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
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
                <FieldLabel htmlFor="create-podcast-form-description">Description</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id="create-podcast-form-description"
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

          {/* Images Section */}
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Cover Image */}
            <div className="space-y-2">
              <FieldLabel htmlFor="cover" className="text-base">
                Cover Image (Required)
              </FieldLabel>
              <div className="space-y-3">
                <div className="bg-muted relative flex justify-center overflow-hidden rounded-lg border">
                  <div className="flex size-52 items-center justify-center lg:size-60">
                    <AspectRatio ratio={1 / 1}>
                      {coverPreview ? (
                        <Image
                          src={coverPreview || "/placeholder.svg"}
                          alt="Cover preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon className="text-muted-foreground h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
                        </div>
                      )}
                    </AspectRatio>
                  </div>
                </div>

                <Input
                  id="cover"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleCoverChange}
                  className="cursor-pointer"
                />
                <p className="text-muted-foreground text-xs">
                  Square (1:1) - PNG, JPG, or WEBP (max 5MB)
                </p>
              </div>
            </div>

            {/* Banner Image */}
            <div className="flex-1 space-y-2">
              <FieldLabel htmlFor="banner" className="text-base">
                Banner Image (Optional)
              </FieldLabel>
              <div className="space-y-3">
                <div className="bg-muted relative h-52 w-full overflow-hidden rounded-lg border lg:h-60">
                  <div className="flex h-52 items-center justify-center lg:h-60">
                    <AspectRatio ratio={3 / 1}>
                      {bannerPreview ? (
                        <Image
                          src={bannerPreview || "/placeholder.svg"}
                          alt="Banner preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon className="text-muted-foreground h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
                        </div>
                      )}
                    </AspectRatio>
                  </div>
                </div>
                <Input
                  id="banner"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleBannerChange}
                  className="cursor-pointer"
                />
                <p className="text-muted-foreground text-xs">
                  1200x400 (3:1) - PNG, JPG, or WEBP (max 5MB)
                </p>
              </div>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          size={"icon"}
          onClick={handleReset}
          disabled={isSubmitting || isUploading}
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          type="submit"
          form="create-podcast-form"
          className="flex-1"
          size="lg"
          disabled={isSubmitting || isUploading}
        >
          {isUploading
            ? "Creating & Uploading..."
            : isSubmitting
              ? "Creating..."
              : "Create Podcast"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PodcastForm;
