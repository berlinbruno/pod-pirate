"use client";
import { handleResetPassword } from "@/actions/auth/password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResetPasswordFormInputs, resetPasswordSchema } from "@/utils/validation/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { GenericResult } from "@/types/auth";
import { FormSuccess } from "@/components/ui/form-success";
import { FormError } from "@/components/ui/form-error";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [result, setResult] = useState<GenericResult | null>(null);

  const form = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "", newPassword: "", confirmPassword: "" },
  });

  const initialError = useMemo(() => {
    if (!token) {
      return { success: false, message: "Verification Token Missing" } as GenericResult;
    }
    return null;
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    if (!token) {
      toast.error("Verification token is missing. Please try again.");
      return;
    }
    try {
      const result = await handleResetPassword(data, token);
      setResult(result);

      if (result.success) {
        toast.success(result.message);
        router.push("/auth/login");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Card className="w-full sm:max-w-lg">
      <CardHeader>
        <CardTitle className="text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">
          Enter your email and new password to reset your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="reset-password-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Email Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="reset-password-form-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="reset-password-form-email"
                    type="email"
                    placeholder="example@gmail.com"
                    aria-invalid={fieldState.invalid}
                    autoComplete="email"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* New Password Field */}
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="reset-password-form-new-password">New Password</FieldLabel>
                  <Input
                    {...field}
                    id="reset-password-form-new-password"
                    type="password"
                    placeholder="New Password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Confirm Password Field */}
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="reset-password-form-confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="reset-password-form-confirm-password"
                    type="password"
                    placeholder="Confirm Password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          {/* Success or Error Message */}
          <div className="my-4">
            {result?.success && <FormSuccess message={result.message} />}
            {(result?.success === false || initialError) && (
              <FormError message={result?.message || initialError?.message || ""} />
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="reset-password-form"
          disabled={form.formState.isSubmitting || !token}
          className="w-full"
        >
          {form.formState.isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </CardFooter>
    </Card>
  );
}
