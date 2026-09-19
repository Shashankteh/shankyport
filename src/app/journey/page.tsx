import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import type { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: profile } = await supabase.from("profile").select("name").limit(1).single();
  const titleName = profile?.name || "Shashank Goyal";

  return {
    title: `Journey | ${titleName}`,
    description: `Read the career journal and latest updates from ${titleName}.`,
    openGraph: {
      title: `Journey | ${titleName}`,
      description: `Read the career journal and latest updates from ${titleName}.`,
    }
  };
}

export default async function JourneyPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: journeys } = await supabase
    .from("journey_posts")
    .select("*")
    .eq("status", "published")
    .order("date", { ascending: false });

  const posts = journeys || [];

  return (
    <main className="min-h-screen pt-24 pb-16 px-8 md:px-16 max-w-7xl mx-auto">
      <div className="mb-16 text-center">
        <h1 className="text-5xl mb-4">Journey</h1>
        <p className="text-muted tracking-widest uppercase text-sm">Career Journal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {posts.map((post) => (
          <Link href={`/journey/${post.id}`} key={post.id} className="group cursor-pointer block">
            <article>
              <div className="aspect-[4/3] relative overflow-hidden bg-muted/10 mb-6">
                {post.cover_image && (
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
              </div>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-serif">{post.title}</h2>
                <span className="text-muted uppercase tracking-widest text-xs mt-2">
                  {post.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ""}
                </span>
              </div>
              <p className="text-primary line-clamp-2 leading-relaxed">
                {post.content}
              </p>
            </article>
          </Link>
        ))}

        {posts.length === 0 && (
          <div className="col-span-full text-center py-24 text-muted">
            <p>Journey posts coming soon.</p>
          </div>
        )}
      </div>
    </main>
  );
}
