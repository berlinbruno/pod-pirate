import { ConfirmAccountDeletionForm } from "@/components/form/profile/ConfirmAccountDeletionForm";
import { DeleteAccountForm } from "@/components/form/profile/DeleteAccountForm";
import { PageSection } from "@/components/layout/PageSection";
import { Metadata } from "next";

interface DeleteAccountPageProps {
  searchParams: Promise<{ token?: string | null }>;
}

export const metadata: Metadata = {
  title: "Delete Account - Pod Pirate",
  description: "Verify your email address to delete your Pod Pirate account",
};

export default async function AuthRequestDeletionPage({ searchParams }: DeleteAccountPageProps) {
  const { token } = await searchParams;
  const hasToken = Boolean(token);

  if (!hasToken) {
    return (
      <PageSection>
        <DeleteAccountForm />
      </PageSection>
    );
  }

  return (
    <PageSection>
      <ConfirmAccountDeletionForm />
    </PageSection>
  );
}
