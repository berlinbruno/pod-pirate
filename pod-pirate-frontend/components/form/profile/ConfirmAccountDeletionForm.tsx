"use client";

import { handleDeleteAccount } from "@/actions/me/profile";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteAccountFormInputs, deleteAccountSchema } from "@/utils/validation/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { GenericResult } from "@/types/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { FormSuccess } from "@/components/ui/form-success";
import { FormError } from "@/components/ui/form-error";

export const ConfirmAccountDeletionForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [result, setResult] = useState<GenericResult | null>(
    !token ? { success: false, message: "Verification Token Missing" } : null,
  );

  const form = useForm<DeleteAccountFormInputs>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { confirm: "" },
  });

  const onSubmit = async (data: DeleteAccountFormInputs) => {
    if (!token) {
      toast.error("Verification token is missing. Please try again.");
      return;
    }
    try {
      const result = await handleDeleteAccount(token);
      setResult(result);

      if (result.success) {
        toast.success(result.message);
        await signOut({ callbackUrl: "/" });
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
        <CardTitle className="text-center">Confirm Account Deletion</CardTitle>
        <CardDescription className="text-center">
          This action cannot be undone. Please confirm to permanently delete your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="confirm-account-deletion-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Confirmation Field */}
            <Controller
              name="confirm"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirm-account-deletion-form-confirm">
                    Type DELETE to confirm
                  </FieldLabel>
                  <Input
                    {...field}
                    id="confirm-account-deletion-form-confirm"
                    type="text"
                    placeholder="DELETE"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  <FieldDescription>
                    Please type the word DELETE in capital letters to confirm account deletion.
                  </FieldDescription>
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
          form="confirm-account-deletion-form"
          disabled={form.formState.isSubmitting || !token}
          variant="destructive"
          className="w-full"
        >
          {form.formState.isSubmitting ? "Deleting Account..." : "Confirm Account Deletion"}
        </Button>
      </CardFooter>
    </Card>
  );
};
