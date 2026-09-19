import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import PortfolioGallery from "./PortfolioGallery";

import type { Metadata } from "next";

export const revalidate = 0; // Disable static rendering for this page

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: profile } = await supabase.from("profile").select("name").limit(1).single();
  const titleName = profile?.name || "Shashank Goyal";

  return {
    title: `Portfolio | ${titleName}`,
    description: `Explore the modeling portfolio of ${titleName}. View fashion, editorial, and commercial selected works.`,
    openGraph: {
      title: `Portfolio | ${titleName}`,
      description: `Explore the modeling portfolio of ${titleName}.`,
    }
  };
}

export default async function PortfolioPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [{ data: photos }, { data: categories }] = await Promise.all([
    supabase.from("photos").select("*").order("display_order", { ascending: true }),
    supabase.from("categories").select("*").order("display_order", { ascending: true }),
  ]);

  const categoryNames = categories ? categories.map(c => c.name) : ["FASHION", "EDITORIAL", "COMMERCIAL", "ETHNIC", "LIFESTYLE"];

  return (
    <main className="min-h-screen pt-24 pb-16 px-8 md:px-16 max-w-7xl mx-auto">
      <div className="mb-16 text-center">
        <h1 className="text-5xl mb-4">Portfolio</h1>
        <p className="text-muted tracking-widest uppercase text-sm">Selected Works</p>
      </div>

      <PortfolioGallery initialPhotos={photos || []} categories={categoryNames} />
    </main>
  );
}
