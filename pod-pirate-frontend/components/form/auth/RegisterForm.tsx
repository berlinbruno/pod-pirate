"use client";

import { handleRegistration } from "@/actions/auth/registration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RegisterFormInputs, registerSchema } from "@/utils/validation/formSchema";
import { RegisterResult } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Undo2 } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [result, setResult] = useState<RegisterResult | null>(null);

  const form = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      bio: "",
    },
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const result = await handleRegistration(data);
      setResult(result);

      if (result.success) {
        toast.success(result.message);
        router.push("/auth/check-email?type=EMAIL");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <Card className="w-full sm:max-w-lg">
      <CardHeader>
        <CardTitle className="text-center">Register</CardTitle>
        <CardDescription className="text-center">
          Create a new account to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
            {/* Username Field */}
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-form-username">Username</FieldLabel>
                  <Input
                    {...field}
                    id="register-form-username"
                    type="text"
                    placeholder="Enter your username"
                    aria-invalid={fieldState.invalid}
                    autoComplete="username"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Email Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-form-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="register-form-email"
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
                  <FieldLabel htmlFor="register-form-password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="register-form-password"
                    type="password"
                    placeholder="Enter your password"
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
                  <FieldLabel htmlFor="register-form-confirm-password">Confirm Password</FieldLabel>
                  <Input
                    {...field}
                    id="register-form-confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Bio Field */}
            <Controller
              name="bio"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="md:col-span-2">
                  <FieldLabel htmlFor="register-form-bio">Bio</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="register-form-bio"
                      placeholder="Tell us a little bit about yourself"
                      rows={4}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {(field.value || "").length} characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Optional: Share a brief introduction about yourself
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          {/* Success/Error Message */}
          <div className="my-4">
            {result?.success && <FormSuccess message={result.message} />}
            {result?.success === false && <FormError message={result.message} />}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        {/* Login Link */}
        <Link href="/auth/login" className="self-end text-xs hover:underline">
          Already have an account?
        </Link>

        {/* Action Buttons */}
        <Field orientation="horizontal" className="w-full">
          <Button
            type="button"
            variant="outline"
            size={"icon"}
            onClick={() => {
              form.reset();
              setResult(null);
            }}
            disabled={form.formState.isSubmitting}
            className="cursor-pointer"
          >
            <Undo2 />
          </Button>
          <Button
            type="submit"
            form="register-form"
            disabled={form.formState.isSubmitting}
            className="flex-1 cursor-pointer"
          >
            {form.formState.isSubmitting ? "Registering..." : "Register"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
