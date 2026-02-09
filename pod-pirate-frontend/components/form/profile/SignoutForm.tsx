"use client";

import { handleSignOut } from "@/actions/user/signoutAction";
import { SignoutFormInputs, signoutSchema } from "@/utils/validation/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "../../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "../../ui/field";
import { Undo2 } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SignoutForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignoutFormInputs>({
    resolver: zodResolver(signoutSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = (data: SignoutFormInputs) => {
    startTransition(async () => {
      try {
        const res = await handleSignOut(data);

        if (!res.success) {
          throw new Error(res.message ?? "Sign out failed");
        }

        toast.success(res.message);

        // Server is source of truth — end session
        form.reset();
        signOut();
      } catch (error) {
        toast.error("Failed to sign out. Please try again.");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Out</CardTitle>
        <CardDescription>
          Signing out will disable your account. It will not be deleted, and you can regain access
          by re-verifying your email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="signout-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signout-form-password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="signout-form-password"
                    type="password"
                    placeholder="Your password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="current-password"
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

          <Button
            className="flex-1"
            type="submit"
            form="signout-form"
            disabled={isPending}
            variant="destructive"
          >
            {isPending ? "Signing out…" : "Sign Out"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}

export { SignoutForm };
