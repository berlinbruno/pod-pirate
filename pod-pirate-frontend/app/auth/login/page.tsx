import LoginForm from "@/components/form/auth/LoginForm";
import { PageSection } from "@/components/layout/PageSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Pod Pirate",
  description: "Sign in to your Pod Pirate account",
};

export default function AuthLoginPage() {
  return (
    <PageSection>
      <div className="flex min-h-screen items-center justify-center">
        <LoginForm />
      </div>
    </PageSection>
  );
}
