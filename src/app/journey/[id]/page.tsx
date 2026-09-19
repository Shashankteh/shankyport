import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 0;

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data: post } = await supabase.from("journey_posts").select("title, content, cover_image").eq("id", resolvedParams.id).single();
  const { data: profile } = await supabase.from("profile").select("name").limit(1).single();
  const titleName = profile?.name || "Shashank Goyal";

  if (!post) return { title: "Not Found" };

  return {
    title: `${post.title} | ${titleName}`,
    description: post.content?.substring(0, 160) || `Read ${post.title}`,
    openGraph: {
      title: `${post.title} | ${titleName}`,
      description: post.content?.substring(0, 160) || `Read ${post.title}`,
      images: post.cover_image ? [{ url: post.cover_image }] : [],
    }
  };
}

export default async function JourneyDetail({ params }: { params: Params }) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: post, error } = await supabase
    .from("journey_posts")
    .select("*, shoots(location, photographer, stylist, mua, brand, photos(*))")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !post) {
    notFound();
  }

  const { data: allPosts } = await supabase
    .from("journey_posts")
    .select("id, title")
    .eq("status", "published")
    .order("date", { ascending: false });

  const currentIndex = allPosts?.findIndex(p => p.id === post.id) ?? -1;
  const nextPost = currentIndex > 0 ? allPosts![currentIndex - 1] : null;
  const prevPost = currentIndex !== -1 && currentIndex < (allPosts?.length || 0) - 1 ? allPosts![currentIndex + 1] : null;

  const credits = post.shoots;
  const gallery = post.shoots?.photos || [];

  return (
    <main className="min-h-screen pt-24 pb-16 px-8 md:px-16 max-w-4xl mx-auto">
      <Link href="/journey" className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors uppercase tracking-widest text-xs mb-12">
        <ArrowLeft size={16} /> Back to Journey
      </Link>

      <article>
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-serif mb-6">{post.title}</h1>
          <div className="flex justify-center items-center gap-4 text-muted uppercase tracking-widest text-sm">
            <span>{post.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ""}</span>
            {credits?.location && (
              <>
                <span>&bull;</span>
                <span>{credits.location}</span>
              </>
            )}
          </div>
        </header>

        {post.cover_image && (
          <div className="relative w-full aspect-[21/9] mb-16 bg-muted/10">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL={post.cover_image.replace('/upload/', '/upload/e_blur:1000,q_1,f_webp,w_100/')}
            />
          </div>
        )}

        <div className="prose prose-lg prose-neutral mx-auto text-primary whitespace-pre-wrap mb-16">
          {post.content}
        </div>

        {gallery.length > 0 && (
          <div className="my-16">
            <h3 className="text-xl font-serif text-center mb-8">Shoot Gallery</h3>
            <div className="columns-1 sm:columns-2 gap-4 space-y-4">
              {gallery.map((photo: any) => (
                <div key={photo.id} className="relative w-full break-inside-avoid">
                  <Image
                    src={photo.image_url}
                    alt={photo.title || 'Shoot image'}
                    width={800}
                    height={1200}
                    className="w-full h-auto object-cover bg-muted/10"
                    placeholder="blur"
                    blurDataURL={photo.image_url.replace('/upload/', '/upload/e_blur:1000,q_1,f_webp,w_100/')}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {credits && (credits.photographer || credits.stylist || credits.mua || credits.brand) && (
          <div className="border-t border-border pt-12 mt-12 max-w-2xl mx-auto text-center">
            <h3 className="text-xs uppercase tracking-widest text-muted mb-6">Credits</h3>
            <div className="grid grid-cols-2 gap-4 text-sm uppercase tracking-wider">
              {credits.brand && <div><span className="text-muted">Brand:</span> {credits.brand}</div>}
              {credits.photographer && <div><span className="text-muted">Photographer:</span> {credits.photographer}</div>}
              {credits.stylist && <div><span className="text-muted">Stylist:</span> {credits.stylist}</div>}
              {credits.mua && <div><span className="text-muted">MUA:</span> {credits.mua}</div>}
            </div>
          </div>
        )}
      </article>

      <div className="border-t border-border mt-16 pt-8 flex justify-between items-center">
        {prevPost ? (
          <Link href={`/journey/${prevPost.id}`} className="group flex flex-col gap-1 max-w-[45%] text-left">
            <span className="text-xs uppercase tracking-widest text-muted group-hover:text-primary transition-colors flex items-center gap-1"><ArrowLeft size={14}/> Previous</span>
            <span className="font-serif text-lg truncate">{prevPost.title}</span>
          </Link>
        ) : <div />}
        
        {nextPost ? (
          <Link href={`/journey/${nextPost.id}`} className="group flex flex-col gap-1 max-w-[45%] text-right items-end">
            <span className="text-xs uppercase tracking-widest text-muted group-hover:text-primary transition-colors flex items-center gap-1">Next <ArrowRight size={14}/></span>
            <span className="font-serif text-lg truncate">{nextPost.title}</span>
          </Link>
        ) : <div />}
      </div>
    </main>
  );
}
