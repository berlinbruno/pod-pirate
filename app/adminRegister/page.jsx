import AdminRegisterForm from "@/components/form/AdminRegisterForm";

export const metadata = {
  title: "Admin Register",
};

export default function AdminRegisterPage() {
  return (
    <section className=" container mx-auto h-screen flex justify-center items-center">
      <AdminRegisterForm />
    </section>
  );
}
