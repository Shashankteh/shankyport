import { Mail, MessageCircle } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import ContactForm from "./ContactForm";

export const revalidate = 0;

export default async function ContactPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: profiles } = await supabase.from("profile").select("email, phone, instagram").limit(1);
  const profile = profiles?.[0] || {
    email: "booking@shashankgoyal.com",
    phone: "+1234567890",
    instagram: "shashankgoyal"
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-8 md:px-16 max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-start">
      {/* Contact Info */}
      <div className="w-full md:w-1/3">
        <h1 className="text-5xl mb-6">Book / Collaborate</h1>
        <p className="text-muted mb-12 text-lg">
          For fashion, editorial, commercial, and brand inquiries, please use the form or reach out directly.
        </p>

        <div className="space-y-6">
          <a href={`mailto:${profile.email}`} className="flex items-center gap-4 text-primary hover:text-accent transition-colors">
            <Mail size={20} className="text-muted" />
            <span className="uppercase tracking-widest text-sm">{profile.email}</span>
          </a>
          {profile.phone && (
            <a href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}`} className="flex items-center gap-4 text-primary hover:text-accent transition-colors">
              <MessageCircle size={20} className="text-muted" />
              <span className="uppercase tracking-widest text-sm">WhatsApp</span>
            </a>
          )}
          {profile.instagram && (
            <a href={`https://instagram.com/${profile.instagram}`} target="_blank" className="flex items-center gap-4 text-primary hover:text-accent transition-colors">
              <FaInstagram size={20} className="text-muted" />
              <span className="uppercase tracking-widest text-sm">@{profile.instagram}</span>
            </a>
          )}
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="w-full md:w-2/3 bg-white p-8 md:p-12 border border-border shadow-sm">
        <ContactForm />
      </div>
    </main>
  );
}
