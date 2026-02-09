import { auth } from "@/lib/utils";
import { getCurrentUser } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import UpdateUsernameForm from "@/components/form/profile/UpdateUsernameForm";
import UpdateBioForm from "@/components/form/profile/UpdateBioForm";
import ChangePasswordForm from "@/components/form/profile/ChangePasswordForm";
import SignoutForm from "@/components/form/profile/SignoutForm";
import { PageSection } from "@/components/layout/PageSection";
import UpdateProfileImageForm from "@/components/form/profile/UpdateProfileImageForm";
import PageHeader from "@/components/header/PageHeader";
import { Separator } from "@/components/ui/separator";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin Profile Settings - Pod Pirate",
  description:
    "Manage your profile settings, update your username, bio, profile image, password, and account preferences on Pod Pirate.",
};

export default async function AdminProfilePage() {
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
          <CardTitle className="text-xl font-semibold">Delete Account</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Warning: This action is permanent and cannot be undone. All your data will be deleted.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex">
          <Link href="/auth/request-deletion" className="w-full">
            <Button variant="destructive" className="w-full">
              Request Account Deletion
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </PageSection>
  );
}
