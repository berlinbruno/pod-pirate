import ForgetPasswordForm from "@/components/form/ForgetPasswordForm";

export const metadata = {
  title: "Reset Credentials",
};

export default function ResetCredentialsPage() {
  return (
    <section className=" container mx-auto h-screen flex justify-center items-center">
      <ForgetPasswordForm />
    </section>
  );
}
