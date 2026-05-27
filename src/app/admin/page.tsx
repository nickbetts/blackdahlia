import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { artists } from "@/content/studio";
import { AdminDashboard } from "@/components/admin-dashboard";
import { dashboardData } from "@/lib/admin-db";
import { adminSessionFromServerCookies } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage artist calendars and incoming booking enquiries.",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await adminSessionFromServerCookies();

  if (!session) {
    redirect("/admin/login");
  }

  let data: Awaited<ReturnType<typeof dashboardData>> | null = null;
  let dataError: string | null = null;

  try {
    data = await dashboardData();
  } catch (error) {
    dataError = error instanceof Error ? error.message : "Could not connect to the admin database.";
  }

  if (dataError || !data) {
    return (
      <div className="adminPageWrap container sectionSpacing">
        <section className="adminPanel" style={{ maxWidth: "760px", marginInline: "auto" }}>
          <p className="eyebrow">Admin setup required</p>
          <h1 className="displayMix" style={{ marginTop: "0.5rem" }}>
            Database <em>not configured</em>
          </h1>
          <p style={{ color: "var(--text-200)", lineHeight: 1.6, margin: 0 }}>
            Set <strong>DATABASE_URL</strong> (Neon / Vercel Postgres) and reload this page.
          </p>
          <p className="adminNotice adminNoticeError">{dataError || "Missing dashboard data."}</p>
          <form action="/api/admin/logout" method="post">
            <button className="ghostButton" type="submit">
              Log out
            </button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className="adminPageWrap container sectionSpacing">
      <AdminDashboard
        username={session.username}
        artists={artists.map((artist) => ({ slug: artist.slug, name: artist.name }))}
        initialEnquiries={data.enquiries}
        initialBookings={data.bookings}
        initialWeeklyAvailability={data.weeklyAvailability}
        initialTimeOff={data.timeOff}
      />
    </div>
  );
}
