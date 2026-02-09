import RegisterForm from "@/components/form/auth/RegisterForm";
import { PageSection } from "@/components/layout/PageSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Pod Pirate",
  description: "Create a new Pod Pirate account to start listening to podcasts",
};

export default function AuthRegisterPage() {
  return (
    <PageSection>
      <div className="flex min-h-screen items-center justify-center">
        <RegisterForm />
      </div>
    </PageSection>
  );
}
