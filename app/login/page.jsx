import LoginForm from "@/components/form/LoginForm";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <section className=" container mx-auto h-screen flex justify-center items-center">
      <LoginForm />
    </section>
  );
}
