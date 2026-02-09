import VerificationRequestForm from "@/components/form/auth/VerificationRequestForm";
import VerifyEmailForm from "@/components/form/auth/VerifyEmailForm";
import { PageSection } from "@/components/layout/PageSection";
import { Metadata } from "next";

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string | null }>;
}

export const metadata: Metadata = {
  title: "Verify Email - Pod Pirate",
  description: "Verify your email address to activate your Pod Pirate account",
};

export default async function AuthVerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { token } = await searchParams;
  const hasToken = Boolean(token);

  if (!hasToken) {
    return (
      <PageSection>
        <div className="flex min-h-screen items-center justify-center">
          <VerificationRequestForm type="EMAIL" />
        </div>
      </PageSection>
    );
  }

  return (
    <PageSection>
      <div className="flex min-h-screen items-center justify-center">
        <VerifyEmailForm />
      </div>
    </PageSection>
  );
}
