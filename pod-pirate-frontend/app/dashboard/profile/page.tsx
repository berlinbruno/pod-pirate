import { auth } from "@/lib/utils";
import { getCurrentUser } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";
import { SignoutForm } from "@/components/form/profile/SignoutForm";
import ChangePasswordForm from "@/components/form/profile/ChangePasswordForm";
import UpdateBioForm from "@/components/form/profile/UpdateBioForm";
import UpdateUsernameForm from "@/components/form/profile/UpdateUsernameForm";
import { PageSection } from "@/components/layout/PageSection";
import UpdateProfileImageForm from "@/components/form/profile/UpdateProfileImageForm";
import PageHeader from "@/components/header/PageHeader";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();
  const currentUser = await getCurrentUser(session?.user.accessToken);

  const username = currentUser?.username || "User";

  return {
    title: `Profile Settings - ${username} - Pod Pirate`,
    description: `Manage your profile settings for ${username}. Update your username, bio, profile image, password, and account preferences on Pod Pirate.`,
  };
}

export default async function UserProfilePage() {
  const session = await auth();
  const { accessToken } = session?.user || {};
  const currentUser = await getCurrentUser(accessToken);

  if (!currentUser) {
    return null;
  }

  return (
    <PageSection>
      <PageHeader title="Settings" description="Manage your account settings and preferences" />

      <Separator className="hidden sm:block" />

      <UpdateProfileImageForm user={currentUser} />
      <UpdateUsernameForm user={currentUser} />
      <UpdateBioForm user={currentUser} />
      <ChangePasswordForm />
      <SignoutForm />

      <Card>
        <CardHeader>
          <CardTitle>Account Deletion</CardTitle>
          <CardDescription>
            Request permanent deletion of your account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="destructive" className="w-full" asChild>
            <Link href="/auth/request-deletion">Request Deletion</Link>
          </Button>
        </CardFooter>
      </Card>
    </PageSection>
  );
}
