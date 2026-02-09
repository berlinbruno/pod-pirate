import ResetPasswordForm from "@/components/form/auth/ResetPasswordForm";
import VerificationRequestForm from "@/components/form/auth/VerificationRequestForm";
import { PageSection } from "@/components/layout/PageSection";
import { Metadata } from "next";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string | null }>;
}

export const metadata: Metadata = {
  title: "Reset Password - Pod Pirate",
  description: "Reset your Pod Pirate account password",
};

export default async function AuthResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;
  const hasToken = Boolean(token);

  if (!hasToken) {
    return (
      <PageSection>
        <div className="flex min-h-screen items-center justify-center">
          <VerificationRequestForm type="PASSWORD_RESET" />
        </div>
      </PageSection>
    );
  }
  return (
    <PageSection>
      <div className="flex min-h-screen items-center justify-center">
        <ResetPasswordForm />
      </div>
    </PageSection>
  );
}
