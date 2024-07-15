import ChangePasswordForm from "@/components/form/ChangePasswordForm";
import DeleteAccountForm from "@/components/form/DeleteAccountForm";

export const metadata = {
  title: "Admin Settings",
};

export default async function AdminAccountPage() {
  return (
    <section className=" container mx-auto">
      <ChangePasswordForm />
      <DeleteAccountForm />
    </section>
  );
}
