"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginFormInputs, loginSchema } from "@/utils/validation/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { signIn, getSession } from "next-auth/react";
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

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setError(null);
    setSuccess(null);
    setErrorType(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        switch (result.error) {
          case "ACCOUNT_NEED_VERIFICATION": {
            const message = "Invalid email or password. Please try again.";
            setError(message);
            setErrorType("ACCOUNT_NEED_VERIFICATION");
            toast.error(message);
            break;
          }

          case "INVALID_CREDENTIALS": {
            const message = "Authentication failed. Please check your credentials.";
            setError(message);
            setErrorType("INVALID_CREDENTIALS");
            toast.error(message);
            break;
          }

          default:
            setError("An unexpected error occurred. Please try again.");
            toast.error("An unexpected error occurred. Please try again.");
            break;
        }
      } else if (result?.ok) {
        setSuccess("Login successful! Redirecting...");
        toast.success("Login successful!");

        // Get session to check user role
        const session = await getSession();

        if (session?.user?.roles?.includes("ADMIN")) {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }

        router.refresh();
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Card className="w-full sm:max-w-lg">
      <CardHeader>
        <CardTitle className="text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Email Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-form-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="login-form-email"
                    type="email"
                    placeholder="example@gmail.com"
                    aria-invalid={fieldState.invalid}
                    autoComplete="email"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-form-password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="login-form-password"
                    type="password"
                    placeholder="Your password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="current-password"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          {/* Success/Error Message */}
          <div className="my-4">
            {success && <FormSuccess message={success} />}
            {error && <FormError message={error} />}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        {/* Links Section */}
        <div className="flex w-full flex-col items-end gap-2">
          {errorType === "INVALID_CREDENTIALS" && (
            <Link href="/auth/reset-password" className="text-xs hover:underline">
              Forgot your password?
            </Link>
          )}
          {errorType === "ACCOUNT_NEED_VERIFICATION" && (
            <Link href="/auth/verify-email" className="text-xs hover:underline">
              Verify your email address
            </Link>
          )}

          <Link href="/auth/register" className="text-xs hover:underline">
            Don&apos;t have an account? Sign up
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          form="login-form"
          disabled={form.formState.isSubmitting}
          className="w-full cursor-pointer"
        >
          {form.formState.isSubmitting ? "Authenticating..." : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
}
