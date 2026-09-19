import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import PdfDownloadButton from "./PdfDownloadButton";

export const revalidate = 0;

export default async function AboutPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [
    { data: profiles },
    { data: featuredPhotos }
  ] = await Promise.all([
    supabase.from("profile").select("*").limit(1),
    supabase.from("photos").select("image_url, title").eq("is_featured", true).order("display_order").limit(6)
  ]);
    
  const profile = profiles?.[0] || {
    name: "Shashank Goyal",
    bio: "Based in New York and working globally, Shashank brings a unique blend of classical elegance and modern edge to every shoot. With extensive experience across editorial, commercial, and runway.",
    height: "6'2\" (188cm)",
    location: "New York / Global",
    instagram: "shashankgoyal",
    hero_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2940&auto=format&fit=crop"
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-8 md:px-16 max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-start">
      {/* Portrait */}
      <div className="w-full md:w-1/2 aspect-[3/4] relative bg-muted/10">
        {profile.hero_image && (
          <Image
            src={profile.hero_image}
            alt={profile.name}
            fill
            className="object-cover object-top"
            priority
          />
        )}
      </div>

      {/* Details */}
      <div className="w-full md:w-1/2 pt-8">
        <h1 className="text-5xl mb-8">{profile.name}</h1>
        
        <div className="prose prose-neutral mb-12 text-lg leading-relaxed text-primary">
          <p>{profile.bio}</p>
        </div>

        <div className="grid grid-cols-2 gap-y-6 gap-x-12 border-t border-border pt-8">
          <div>
            <h3 className="text-muted uppercase tracking-widest text-xs mb-2">Height</h3>
            <p className="text-primary">{profile.height || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-muted uppercase tracking-widest text-xs mb-2">Location</h3>
            <p className="text-primary">{profile.location || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-muted uppercase tracking-widest text-xs mb-2">Instagram</h3>
            <a href={`https://instagram.com/${profile.instagram}`} target="_blank" className="text-primary hover:text-accent transition-colors">
              @{profile.instagram}
            </a>
          </div>
        </div>
        
        <div className="mt-12">
          <PdfDownloadButton profile={profile} photos={featuredPhotos || []} />
        </div>
      </div>
    </main>
  );
}
