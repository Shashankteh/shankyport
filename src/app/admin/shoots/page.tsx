"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Trash2, Edit2, Plus, X } from "lucide-react";

type Shoot = {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  location: string | null;
  photographer: string | null;
  stylist: string | null;
  mua: string | null;
  brand: string | null;
  cover_image: string | null;
};

export default function ShootsManager() {
  const [shoots, setShoots] = useState<Shoot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentShoot, setCurrentShoot] = useState<Partial<Shoot>>({});
  const supabase = createClient();

  useEffect(() => {
    fetchShoots();
  }, []);

  const fetchShoots = async () => {
    setLoading(true);
    const { data } = await supabase.from("shoots").select("*").order("date", { ascending: false });
    if (data) setShoots(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentShoot.title) return alert("Title is required");

    if (currentShoot.id) {
      const { error } = await supabase.from("shoots").update(currentShoot).eq("id", currentShoot.id);
      if (!error) {
        setShoots(shoots.map(s => s.id === currentShoot.id ? { ...s, ...currentShoot } as Shoot : s));
      }
    } else {
      const { data, error } = await supabase.from("shoots").insert([currentShoot]).select();
      if (data) {
        setShoots([data[0], ...shoots]);
      }
    }
    setIsEditing(false);
    setCurrentShoot({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this shoot?")) return;
    const { error } = await supabase.from("shoots").delete().eq("id", id);
    if (!error) {
      setShoots(shoots.filter(s => s.id !== id));
    }
  };

  const handleUploadSuccess = (result: any) => {
    setCurrentShoot({ ...currentShoot, cover_image: result.info.secure_url });
  };

  if (loading) return <div>Loading shoots...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-primary">Shoots</h1>
        {!isEditing && (
          <button 
            onClick={() => { setCurrentShoot({}); setIsEditing(true); }}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 uppercase tracking-widest text-sm hover:bg-accent transition-colors rounded-sm"
          >
            <Plus size={16} /> Add Shoot
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm border border-border p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif">{currentShoot.id ? "Edit Shoot" : "New Shoot"}</h2>
            <button type="button" onClick={() => setIsEditing(false)} className="text-muted hover:text-primary"><X size={20} /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted">Title *</label>
              <input 
                type="text" required
                value={currentShoot.title || ""}
                onChange={e => setCurrentShoot({...currentShoot, title: e.target.value})}
                className="w-full border border-border p-2 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted">Date</label>
              <input 
                type="date"
                value={currentShoot.date || ""}
                onChange={e => setCurrentShoot({...currentShoot, date: e.target.value})}
                className="w-full border border-border p-2 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-muted">Description</label>
              <textarea 
                rows={3}
                value={currentShoot.description || ""}
                onChange={e => setCurrentShoot({...currentShoot, description: e.target.value})}
                className="w-full border border-border p-2 focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted">Location</label>
              <input 
                type="text"
                value={currentShoot.location || ""}
                onChange={e => setCurrentShoot({...currentShoot, location: e.target.value})}
                className="w-full border border-border p-2 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted">Brand</label>
              <input 
                type="text"
                value={currentShoot.brand || ""}
                onChange={e => setCurrentShoot({...currentShoot, brand: e.target.value})}
                className="w-full border border-border p-2 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted">Photographer</label>
              <input 
                type="text"
                value={currentShoot.photographer || ""}
                onChange={e => setCurrentShoot({...currentShoot, photographer: e.target.value})}
                className="w-full border border-border p-2 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted">Stylist & MUA</label>
              <div className="flex gap-2">
                <input 
                  type="text" placeholder="Stylist"
                  value={currentShoot.stylist || ""}
                  onChange={e => setCurrentShoot({...currentShoot, stylist: e.target.value})}
                  className="w-1/2 border border-border p-2 focus:outline-none focus:border-primary"
                />
                <input 
                  type="text" placeholder="MUA"
                  value={currentShoot.mua || ""}
                  onChange={e => setCurrentShoot({...currentShoot, mua: e.target.value})}
                  className="w-1/2 border border-border p-2 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <label className="text-xs uppercase tracking-widest text-muted">Cover Image</label>
            <div className="flex items-center gap-4">
              {currentShoot.cover_image && (
                <div className="relative w-24 h-24 bg-gray-100">
                  <Image src={currentShoot.cover_image} alt="Cover" fill className="object-cover" />
                </div>
              )}
              <CldUploadWidget uploadPreset="shanky_portfolio" onSuccess={handleUploadSuccess}>
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="border border-primary px-4 py-2 uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-colors">
                    Upload Cover
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>

          <button type="submit" className="bg-primary text-white px-6 py-2 uppercase tracking-widest text-sm hover:bg-accent transition-colors">
            Save Shoot
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-border p-4">
          {shoots.length === 0 ? (
            <p className="text-muted text-center py-12">No shoots added yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {shoots.map(shoot => (
                <div key={shoot.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-gray-100 flex-shrink-0">
                      {shoot.cover_image && <Image src={shoot.cover_image} alt={shoot.title} fill className="object-cover" />}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-primary">{shoot.title}</h3>
                      <p className="text-muted text-sm">{shoot.date ? new Date(shoot.date).toLocaleDateString() : 'No date'} • {shoot.location || 'No location'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setCurrentShoot(shoot); setIsEditing(true); }} className="p-2 text-gray-500 hover:text-primary"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(shoot.id)} className="p-2 text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
