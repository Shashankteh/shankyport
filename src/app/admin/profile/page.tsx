"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

export default function ProfileManager() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data } = await supabase.from("profile").select("*").limit(1);
    if (data && data.length > 0) {
      setProfile(data[0]);
    } else {
      setProfile({
        name: "", bio: "", location: "", height: "", instagram: "", email: "", phone: "", hero_image: ""
      });
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (profile.id) {
      await supabase.from("profile").update(profile).eq("id", profile.id);
    } else {
      const { data } = await supabase.from("profile").insert([profile]).select();
      if (data) setProfile(data[0]);
    }
    
    setSaving(false);
    alert("Profile saved successfully!");
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-serif text-primary mb-8">Profile Details</h1>
      
      <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm border border-border p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted">Full Name</label>
            <input 
              type="text" 
              value={profile.name || ""}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full border border-border p-2 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted">Email</label>
            <input 
              type="email" 
              value={profile.email || ""}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className="w-full border border-border p-2 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-muted">Bio</label>
          <textarea 
            value={profile.bio || ""}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            rows={4}
            className="w-full border border-border p-2 focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted">Height</label>
            <input 
              type="text" 
              value={profile.height || ""}
              onChange={(e) => setProfile({...profile, height: e.target.value})}
              className="w-full border border-border p-2 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted">Location</label>
            <input 
              type="text" 
              value={profile.location || ""}
              onChange={(e) => setProfile({...profile, location: e.target.value})}
              className="w-full border border-border p-2 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted">Instagram Handle</label>
            <input 
              type="text" 
              value={profile.instagram || ""}
              onChange={(e) => setProfile({...profile, instagram: e.target.value})}
              className="w-full border border-border p-2 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted">WhatsApp (Phone)</label>
            <input 
              type="text" 
              value={profile.phone || ""}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              className="w-full border border-border p-2 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-border">
          <label className="text-xs uppercase tracking-widest text-muted block">About Page Hero Image</label>
          <div className="flex items-center gap-4">
            {profile.hero_image && (
              <div className="relative w-24 h-32 bg-gray-100">
                <Image src={profile.hero_image} alt="Hero" fill className="object-cover" />
              </div>
            )}
            <CldUploadWidget 
              uploadPreset="shanky_portfolio" 
              onSuccess={(result: any) => setProfile({...profile, hero_image: result.info.secure_url})}
            >
              {({ open }) => (
                <button type="button" onClick={() => open()} className="border border-primary px-4 py-2 uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-colors">
                  Upload Image
                </button>
              )}
            </CldUploadWidget>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="bg-primary text-background px-6 py-2 uppercase tracking-widest text-sm hover:bg-accent transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
