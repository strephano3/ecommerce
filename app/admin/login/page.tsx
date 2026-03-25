import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin-login-form";
import { isAdminAuthenticated } from "@/lib/auth";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <section className="section narrow">
      <p className="eyebrow">Accesso amministrazione</p>
      <h1>Entra nella console</h1>
      <p className="section-copy">
        La console amministrativa e protetta da password. Cambia `ADMIN_PASSWORD` prima della
        messa online.
      </p>
      <AdminLoginForm />
    </section>
  );
}
