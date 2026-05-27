import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { adminSessionFromServerCookies } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to The Black Dahlia admin dashboard.",
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await adminSessionFromServerCookies();

  if (session) {
    redirect("/admin");
  }

  return (
    <div className="adminLoginPage">
      <div className="container">
        <AdminLoginForm />
      </div>
    </div>
  );
}
