"use client";
import { handleGetVerification } from "@/actions/auth/registration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmailInputs, emailSchema } from "@/utils/validation/formSchema";
import { GenericResult, VerificationType } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

interface VerificationRequestFormProps {
  type: VerificationType;
}

export default function VerificationRequestForm({ type }: VerificationRequestFormProps) {
  const router = useRouter();
  const [result, setResult] = useState<GenericResult | null>(null);

  const form = useForm<EmailInputs>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: EmailInputs) => {
    setResult(null);

    try {
      const result = await handleGetVerification(data, type);
      setResult(result);

      if (result.success) {
        toast.success(result.message);
        router.push(`/auth/check-email?type=${type}`);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("An error occurred while processing your request.");
    }
  };

  const isEmailVerification = type === "EMAIL";
  const title = isEmailVerification ? "Email Verification" : "Password Reset";
  const description = isEmailVerification
    ? "Enter your email address to receive a verification link"
    : "Enter your email address to receive a password reset link";
  const buttonText = isEmailVerification ? "Request Verification Link" : "Request Reset Link";
  const buttonLoadingText = isEmailVerification
    ? "Sending verification link..."
    : "Sending reset link...";

  return (
    <Card className="w-full sm:max-w-lg">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="verification-request-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Email Input Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="verification-request-form-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="verification-request-form-email"
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

          {/* Result Messages */}
          <div className="my-4">
            {result?.success && <FormSuccess message={result.message} />}
            {result?.success === false && <FormError message={result.message} />}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="verification-request-form"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? buttonLoadingText : buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}

export { VerificationRequestForm };
