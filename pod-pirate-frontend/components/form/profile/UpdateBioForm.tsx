"use client";

import { handleUpdateBio, handleRemoveBio } from "@/actions/me/profile";
import { UpdateBioFormInputs, updateBioSchema } from "@/utils/validation/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { UserProfileResponse } from "@/types/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

interface UpdateBioFormProps {
  user?: UserProfileResponse;
}

export default function UpdateBioForm({ user }: UpdateBioFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateBioFormInputs>({
    resolver: zodResolver(updateBioSchema),
    defaultValues: {
      bio: user?.bio ?? "",
    },
  });

  const onSubmit = (data: UpdateBioFormInputs) => {
    if (data.bio === user?.bio) {
      toast.info("No changes to update.");
      return;
    }

    const previous = user?.bio ?? "";

    // 🔥 optimistic: textarea already shows new value
    startTransition(async () => {
      try {
        const res = await handleUpdateBio(data);
        if (!res.success) {
          throw new Error(res.message ?? "Update failed");
        }

        toast.success(res.message);
        router.refresh(); // future renders only
      } catch {
        // ⛔ rollback
        form.setValue("bio", previous, {
          shouldDirty: false,
          shouldTouch: false,
        });
        toast.error("Failed to update bio");
      }
    });
  };

  const remove = () => {
    if (!user?.bio) {
      toast.info("No bio to remove.");
      return;
    }

    const previous = user.bio;

    // 🔥 optimistic clear
    form.setValue("bio", "", {
      shouldDirty: true,
      shouldTouch: true,
    });

    startTransition(async () => {
      try {
        const res = await handleRemoveBio();
        if (!res.success) {
          throw new Error(res.message ?? "Remove failed");
        }

        toast.success(res.message);
        router.refresh();
      } catch {
        // ⛔ rollback
        form.setValue("bio", previous, {
          shouldDirty: false,
          shouldTouch: false,
        });
        toast.error("Failed to remove bio");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Bio</CardTitle>
        <CardDescription>Share a brief description about yourself</CardDescription>
      </CardHeader>

      <CardContent>
        <form id="update-bio-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="bio"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-bio-form-bio">Bio</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="update-bio-form-bio"
                      placeholder="Tell us about yourself"
                      rows={4}
                      className="resize-none"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>Maximum 100 characters</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="w-full">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={isPending}
            onClick={() => form.reset({ bio: user?.bio ?? "" })}
          >
            <Undo2 />
          </Button>

          {user?.bio && (
            <Button type="button" variant="destructive" disabled={isPending} onClick={remove}>
              <Trash2 className="h-4 w-4 md:mr-2" />
              <span className="hidden md:block">{isPending ? "Removing…" : "Remove Bio"}</span>
            </Button>
          )}

          <Button type="submit" form="update-bio-form" className="flex-1" disabled={isPending}>
            {isPending ? "Updating…" : "Update Bio"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
