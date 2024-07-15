import RegisterForm from "@/components/form/RegisterForm";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <section className=" container mx-auto h-screen flex justify-center items-center mt-6">
      <RegisterForm />
    </section>
  );
}
