import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { Image as ImageIcon, Camera, BookOpen, Eye } from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [
    { count: photoCount },
    { count: shootCount },
    { count: journeyCount },
    { count: viewsCount }
  ] = await Promise.all([
    supabase.from("photos").select("*", { count: "exact", head: true }),
    supabase.from("shoots").select("*", { count: "exact", head: true }),
    supabase.from("journey_posts").select("*", { count: "exact", head: true }),
    supabase.from("page_views").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Total Photos", value: photoCount || 0, icon: ImageIcon, href: "/admin/photos" },
    { label: "Total Shoots", value: shootCount || 0, icon: Camera, href: "/admin/shoots" },
    { label: "Journey Posts", value: journeyCount || 0, icon: BookOpen, href: "/admin/journey" },
    { label: "Page Views", value: viewsCount || 0, icon: Eye, href: "#" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-serif mb-8 text-primary">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white p-6 rounded-lg shadow-sm border border-border flex items-center gap-4 hover:border-primary transition-colors">
            <div className="p-4 bg-muted/10 rounded-full text-primary">
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-muted text-sm uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl text-primary mt-1">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
