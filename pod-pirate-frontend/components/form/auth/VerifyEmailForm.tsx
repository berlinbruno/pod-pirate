"use client";

import { handleVerifyEmail } from "@/actions/auth/registration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmailInputs, emailSchema } from "@/utils/validation/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";
import { GenericResult } from "@/types/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [result, setResult] = useState<GenericResult | null>(
    !token ? { success: false, message: "Verification Token Missing" } : null,
  );

  const form = useForm<EmailInputs>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: EmailInputs) => {
    if (!token) {
      toast.error("Verification token is missing. Please try again.");
      return;
    }
    try {
      const result = await handleVerifyEmail(data, token);
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
        <CardTitle className="text-center">Verify Email</CardTitle>
        <CardDescription className="text-center">
          Enter your email address to verify your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="verify-email-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Email Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="verify-email-form-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="verify-email-form-email"
                    type="email"
                    placeholder="example@gmail.com"
                    aria-invalid={fieldState.invalid}
                    autoComplete="email"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          {/* Success or Error Message */}
          <div className="my-4">
            {result?.success && <FormSuccess message={result.message} />}
            {result?.success === false && <FormError message={result.message} />}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="verify-email-form"
          disabled={form.formState.isSubmitting || !token}
          className="w-full"
        >
          {form.formState.isSubmitting ? "Verifying..." : "Verify Email"}
        </Button>
      </CardFooter>
    </Card>
  );
}
