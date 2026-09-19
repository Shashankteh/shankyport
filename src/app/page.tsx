import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const revalidate = 0;

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: featuredPhotos } = await supabase
    .from("photos")
    .select("*")
    .eq("is_featured", true)
    .order("display_order", { ascending: true })
    .limit(4);
    
  const { data: latestJourneys } = await supabase
    .from("journey_posts")
    .select("*")
    .eq("status", "published")
    .order("date", { ascending: false });

  const { data: settingsData } = await supabase.from("site_settings").select("*").limit(1);
  const sections = settingsData?.[0]?.homepage_sections || [
    { id: "banner", type: "availability", text: "AVAILABLE FOR BOOKINGS GLOBALLY - Q3/Q4 2026", visible: true },
    { id: "hero", type: "hero", image: "", heading: "SHASHANK GOYAL", tagline: "Model · Creator · Actor", btn1Text: "View Work", btn1Link: "/portfolio", btn2Text: "Contact", btn2Link: "/contact", visible: true },
    { id: "work", type: "selected_work", heading: "Selected Work", linkText: "View All", visible: true },
    { id: "about", type: "about_teaser", heading: "About", text: "Based in New York and working globally...", linkText: "Read Full Journey", image: "", visible: true },
    { id: "footer", type: "instagram", handle: "shashankgoyal", text: "© 2026 Shashank Goyal. All rights reserved.", visible: true }
  ];

  return (
    <main className="min-h-screen">
      {sections.filter((s: any) => s.visible).map((section: any) => {
        switch (section.type) {
          case "availability":
            return (
              <div key={section.id} className="bg-primary text-background py-2 text-center text-xs tracking-widest uppercase">
                {section.text}
              </div>
            );
            
          case "hero":
            return (
              <section key={section.id} className="relative h-[90vh] w-full">
                <div className="absolute inset-0 bg-muted/20">
                  <Image
                    src={section.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2940&auto=format&fit=crop"}
                    alt="Hero"
                    fill
                    className="object-cover object-top opacity-90"
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                
                <div className="absolute bottom-0 w-full p-8 md:p-16 flex flex-col items-center text-center text-primary">
                  <h1 className="text-5xl md:text-8xl tracking-tight mb-4">{section.heading}</h1>
                  <p className="text-lg md:text-xl tracking-widest uppercase mb-8">{section.tagline}</p>
                  <div className="flex gap-6">
                    <Link href={section.btn1Link} className="border border-primary px-8 py-3 uppercase tracking-wider text-sm hover:bg-primary hover:text-background transition-colors">
                      {section.btn1Text}
                    </Link>
                    <Link href={section.btn2Link} className="bg-accent text-white px-8 py-3 uppercase tracking-wider text-sm hover:bg-primary transition-colors">
                      {section.btn2Text}
                    </Link>
                  </div>
                </div>
              </section>
            );

          case "selected_work":
            return (
              <section key={section.id} className="py-24 px-8 md:px-16 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                  <h2 className="text-4xl">{section.heading}</h2>
                  <Link href="/portfolio" className="flex items-center gap-2 hover:text-accent transition-colors uppercase tracking-wider text-sm">
                    {section.linkText} <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredPhotos && featuredPhotos.length > 0 ? (
                    featuredPhotos.map((photo) => (
                      <div key={photo.id} className="aspect-[3/4] relative bg-muted/10 group overflow-hidden">
                        <Image src={photo.image_url} alt="work" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    ))
                  ) : (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="aspect-[3/4] relative bg-muted/10 flex items-center justify-center">
                        <span className="text-muted text-sm uppercase tracking-wider">Empty Slot</span>
                      </div>
                    ))
                  )}
                </div>
              </section>
            );

          case "latest_journey":
            const postsToShow = latestJourneys ? latestJourneys.slice(0, section.count || 1) : [];
            return (
              <section key={section.id} className="py-24 px-8 md:px-16 max-w-7xl mx-auto border-t border-border">
                <h2 className="text-4xl mb-12 text-center">{section.heading}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {postsToShow.map(post => (
                    <Link href={`/journey/${post.id}`} key={post.id} className="group cursor-pointer block">
                      <article>
                        <div className="aspect-[4/3] relative overflow-hidden bg-muted/10 mb-6">
                          {post.cover_image && (
                            <Image src={post.cover_image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                          )}
                        </div>
                        <h3 className="text-2xl font-serif mb-2">{post.title}</h3>
                        <p className="text-primary line-clamp-2 leading-relaxed">{post.content}</p>
                      </article>
                    </Link>
                  ))}
                  {postsToShow.length === 0 && <p className="text-muted text-center w-full col-span-2">No posts available.</p>}
                </div>
              </section>
            );

          case "about_teaser":
            return (
              <section key={section.id} className="py-24 bg-surface px-8">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
                  {section.image && (
                    <div className="w-full md:w-1/3 aspect-[3/4] relative bg-muted/10">
                      <Image src={section.image} alt="about" fill className="object-cover" />
                    </div>
                  )}
                  <div className={`w-full ${section.image ? 'md:w-2/3' : 'text-center max-w-2xl mx-auto'}`}>
                    <h2 className="text-4xl mb-6">{section.heading}</h2>
                    <p className="text-lg mb-8 leading-relaxed whitespace-pre-wrap">{section.text}</p>
                    {section.linkText && (
                      <Link href="/about" className="border-b border-primary pb-1 uppercase tracking-wider text-sm hover:text-accent hover:border-accent transition-colors">
                        {section.linkText}
                      </Link>
                    )}
                  </div>
                </div>
              </section>
            );

          case "booking_cta":
            return (
              <section key={section.id} className="py-24 px-8 text-center max-w-3xl mx-auto border-t border-border">
                <h2 className="text-4xl mb-4">{section.heading}</h2>
                <p className="text-lg text-muted mb-8">{section.text}</p>
                <Link href={section.btnLink} className="inline-block bg-primary text-white px-8 py-3 uppercase tracking-wider text-sm hover:bg-accent transition-colors">
                  {section.btnText}
                </Link>
              </section>
            );

          case "custom":
            return (
              <section key={section.id} className="py-24 px-8 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
                {section.image && (
                  <div className="w-full md:w-1/2 aspect-video relative bg-muted/10">
                    <Image src={section.image} alt="custom" fill className="object-cover" />
                  </div>
                )}
                <div className={`w-full ${section.image ? 'md:w-1/2' : 'text-center max-w-2xl mx-auto'}`}>
                  {section.heading && <h2 className="text-3xl mb-6">{section.heading}</h2>}
                  <div className="text-lg leading-relaxed whitespace-pre-wrap">{section.text}</div>
                </div>
              </section>
            );

          case "instagram":
            return (
              <footer key={section.id} className="py-12 border-t border-border px-8 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-muted text-sm uppercase tracking-wider">{section.text}</p>
                <Link href={`https://instagram.com/${section.handle}`} target="_blank" className="hover:text-accent transition-colors">
                  <FaInstagram size={20} />
                </Link>
              </footer>
            );

          default:
            return null;
        }
      })}
    </main>
  );
}
