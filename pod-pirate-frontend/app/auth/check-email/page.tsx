"use client";
import { PageSection } from "@/components/layout/PageSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VerificationType } from "@/types/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as VerificationType | null;
  const router = useRouter();

  useEffect(() => {
    if (!type || (type !== "EMAIL" && type !== "PASSWORD_RESET" && type !== "DELETION")) {
      router.push("/");
    }
  }, [type, router]);

  if (!type || (type !== "EMAIL" && type !== "PASSWORD_RESET" && type !== "DELETION")) {
    return null;
  }

  return (
    <PageSection>
      <div className="flex min-h-screen items-center justify-center">
        <Card className="mx-auto w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              {type === "EMAIL"
                ? "Email Verification"
                : type === "PASSWORD_RESET"
                  ? "Password Reset"
                  : "Account Deletion"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {type === "EMAIL" && (
              <>
                <p className="text-foreground leading-relaxed">
                  We&apos;ve sent you an email with a verification link. Please check your inbox and
                  follow the instructions to activate your account.
                </p>
                <p className="text-muted-foreground text-sm">
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <Link
                    href="/auth/verify-email"
                    className="text-foreground font-medium hover:underline"
                  >
                    request a new verification link
                  </Link>
                  .
                </p>
              </>
            )}
            {type === "PASSWORD_RESET" && (
              <>
                <p className="text-foreground leading-relaxed">
                  We&apos;ve sent you an email with a password reset link. Please check your inbox
                  and follow the instructions to reset your password.
                </p>
                <p className="text-muted-foreground text-sm">
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <Link
                    href="/auth/reset-password"
                    className="text-foreground font-medium hover:underline"
                  >
                    request a new reset link
                  </Link>
                  .
                </p>
              </>
            )}
            {type === "DELETION" && (
              <>
                <p className="text-foreground leading-relaxed">
                  We&apos;ve sent you an email with an account deletion link. Please check your
                  inbox and follow the instructions to permanently delete your account.
                </p>
                <p className="text-muted-foreground text-sm">
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <Link
                    href="/auth/request-deletion"
                    className="text-foreground font-medium hover:underline"
                  >
                    request a new deletion link
                  </Link>
                  .
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PageSection>
  );
}

export default function AuthCheckEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckEmailContent />
    </Suspense>
  );
}
