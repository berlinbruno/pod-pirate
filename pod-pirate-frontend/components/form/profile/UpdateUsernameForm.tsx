"use client";

import { handleUpdateUsername } from "@/actions/me/profile";
import { UpdateUsernameFormInputs, updateUsernameSchema } from "@/utils/validation/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Undo2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface UpdateUsernameFormProps {
  user?: UserProfileResponse;
}

export default function UpdateUsernameForm({ user }: UpdateUsernameFormProps) {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateUsernameFormInputs>({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: {
      username: user?.username ?? "",
    },
  });

  const onSubmit = (data: UpdateUsernameFormInputs) => {
    if (data.username === user?.username) {
      toast.info("No changes to update.");
      return;
    }

    const previous = user?.username ?? "";

    // 🔥 optimistic update: form already contains new value
    startTransition(async () => {
      try {
        const res = await handleUpdateUsername(data);
        if (!res.success) {
          throw new Error(res.message ?? "Update failed");
        }

        toast.success(res.message);

        // Update session with new username
        await updateSession({ userName: data.username });
        router.refresh(); // future renders only
      } catch {
        // ⛔ rollback
        form.setValue("username", previous, {
          shouldDirty: false,
          shouldTouch: false,
        });
        toast.error("Failed to update username");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Username</CardTitle>
        <CardDescription>Change your unique username identifier</CardDescription>
      </CardHeader>

      <CardContent>
        <form id="update-username-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-username-form-username">Username</FieldLabel>
                  <Input
                    {...field}
                    id="update-username-form-username"
                    placeholder="Enter your username"
                    aria-invalid={fieldState.invalid}
                    autoComplete="username"
                    disabled={isPending}
                  />
                  <FieldDescription>
                    3–20 characters, lowercase letters and up to 3 digits only
                  </FieldDescription>
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
            onClick={() => form.reset({ username: user?.username ?? "" })}
          >
            <Undo2 />
          </Button>
          <Button type="submit" form="update-username-form" className="flex-1" disabled={isPending}>
            {isPending ? "Updating…" : "Update Username"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
