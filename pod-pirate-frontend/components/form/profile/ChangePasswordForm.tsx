"use client";

import { handleChangePassword } from "@/actions/auth/password";
import { ChangePasswordFormInputs, changePasswordSchema } from "@/utils/validation/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Undo2 } from "lucide-react";

export const ChangePasswordForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChangePasswordFormInputs>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordFormInputs) => {
    if (data.password === data.newPassword) {
      toast.info("New password must be different from current password.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await handleChangePassword(data);

        if (!res.success) {
          throw new Error(res.message ?? "Password change failed");
        }

        toast.success(res.message);

        // Security best practice: force re-auth
        form.reset();
        router.push("/auth/login");
      } catch {
        toast.error("Failed to change password");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your password to keep your account secure</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="change-password-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="change-password-form-password">Current Password</FieldLabel>
                  <Input
                    {...field}
                    id="change-password-form-password"
                    type="password"
                    placeholder="Enter your current password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="current-password"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="change-password-form-new-password">New Password</FieldLabel>
                  <Input
                    {...field}
                    id="change-password-form-new-password"
                    type="password"
                    placeholder="Enter new password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                    disabled={isPending}
                  />
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
            onClick={() => form.reset()}
          >
            <Undo2 />
          </Button>

          <Button type="submit" form="change-password-form" className="flex-1" disabled={isPending}>
            {isPending ? "Changing Password…" : "Change Password"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default ChangePasswordForm;
