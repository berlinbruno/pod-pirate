"use client";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleGetVerification } from "@/actions";
import { EmailInputs, emailSchema } from "@/utils/validation/formSchema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

export const DeleteAccountForm = () => {
  const router = useRouter();

  const form = useForm<EmailInputs>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: EmailInputs) => {
    try {
      const result = await handleGetVerification(data, "DELETION");

      if (result.success) {
        toast.success(result.message);
        router.push("/auth/check-email?type=DELETION");
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
        <CardTitle className="text-center">Request Account Deletion</CardTitle>
        <CardDescription className="text-center">
          Enter your email address to receive a verification link. This action cannot be undone once
          confirmed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="delete-account-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="delete-account-form-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="delete-account-form-email"
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
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="delete-account-form"
          disabled={form.formState.isSubmitting}
          variant="destructive"
          className="w-full"
        >
          {form.formState.isSubmitting ? "Sending..." : "Send Verification Email"}
        </Button>
      </CardFooter>
    </Card>
  );
};
