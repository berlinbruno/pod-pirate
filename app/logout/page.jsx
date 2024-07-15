import LogoutForm from "@/components/form/LogoutForm";

export const metadata = {
  title: "Logout",
};

export default function LogoutPage() {
  return (
    <section className=" container mx-auto h-screen flex justify-center items-center">
      <LogoutForm />
    </section>
  );
}
