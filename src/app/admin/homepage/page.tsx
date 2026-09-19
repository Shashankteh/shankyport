"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { ArrowUp, ArrowDown, Trash2, Plus, Eye, EyeOff } from "lucide-react";

type Section = {
  id: string;
  type: string;
  visible: boolean;
  [key: string]: any;
};

const DEFAULT_SECTIONS: Section[] = [
  { id: "banner", type: "availability", text: "AVAILABLE FOR BOOKINGS GLOBALLY - Q3/Q4 2026", visible: true },
  { id: "hero", type: "hero", image: "", heading: "SHASHANK GOYAL", tagline: "Model · Creator · Actor", btn1Text: "View Work", btn1Link: "/portfolio", btn2Text: "Contact", btn2Link: "/contact", visible: true },
  { id: "work", type: "selected_work", heading: "Selected Work", linkText: "View All", visible: true },
  { id: "journey", type: "latest_journey", heading: "Latest Journey", count: 1, visible: true },
  { id: "about", type: "about_teaser", heading: "About", text: "Based in New York and working globally...", linkText: "Read Full Journey", image: "", visible: true },
  { id: "cta", type: "booking_cta", heading: "Book / Collaborate", text: "Available for worldwide bookings.", btnText: "Get in Touch", btnLink: "/contact", visible: true },
  { id: "instagram", type: "instagram", handle: "shashankgoyal", text: "© 2026 Shashank Goyal", visible: true }
];

export default function HomepageBuilder() {
  const [sections, setSections] = useState<Section[]>([]);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*").limit(1);
    if (data && data.length > 0) {
      setSettingsId(data[0].id);
      if (data[0].homepage_sections && data[0].homepage_sections.length > 0) {
        setSections(data[0].homepage_sections);
      } else {
        setSections(DEFAULT_SECTIONS);
      }
    } else {
      setSections(DEFAULT_SECTIONS);
    }
    setLoading(false);
  };

  const saveSections = async () => {
    setSaving(true);
    if (settingsId) {
      await supabase.from("site_settings").update({ homepage_sections: sections }).eq("id", settingsId);
    } else {
      const { data } = await supabase.from("site_settings").insert([{ homepage_sections: sections }]).select();
      if (data) setSettingsId(data[0].id);
    }
    setSaving(false);
    alert("Homepage layout saved successfully!");
  };

  const updateSection = (id: string, updates: any) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newSec = [...sections];
    [newSec[index - 1], newSec[index]] = [newSec[index], newSec[index - 1]];
    setSections(newSec);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSec = [...sections];
    [newSec[index + 1], newSec[index]] = [newSec[index], newSec[index + 1]];
    setSections(newSec);
  };

  const deleteSection = (id: string) => {
    if(confirm("Remove this section entirely?")) {
      setSections(sections.filter(s => s.id !== id));
    }
  };

  const addCustomBlock = () => {
    const newId = `custom_${Date.now()}`;
    setSections([...sections, { id: newId, type: "custom", heading: "New Block", text: "Text here", image: "", visible: true }]);
  };

  const renderSectionEditor = (s: Section) => {
    switch (s.type) {
      case "availability":
        return (
          <div className="space-y-2">
            <label className="text-xs uppercase text-muted">Banner Text</label>
            <input type="text" value={s.text} onChange={e => updateSection(s.id, { text: e.target.value })} className="w-full border p-2 text-sm" />
          </div>
        );
      case "hero":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex gap-4 items-center">
              {s.image && <div className="w-24 h-16 relative bg-gray-100"><Image src={s.image} alt="hero" fill className="object-cover" /></div>}
              <CldUploadWidget uploadPreset="shanky_portfolio" onSuccess={(r: any) => updateSection(s.id, { image: r.info.secure_url })}>
                {({ open }) => <button type="button" onClick={() => open()} className="border p-2 text-xs uppercase">Upload Hero Image</button>}
              </CldUploadWidget>
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Heading</label>
              <input type="text" value={s.heading} onChange={e => updateSection(s.id, { heading: e.target.value })} className="w-full border p-2 text-sm" />
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Tagline</label>
              <input type="text" value={s.tagline} onChange={e => updateSection(s.id, { tagline: e.target.value })} className="w-full border p-2 text-sm" />
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Btn 1 Text & Link</label>
              <div className="flex gap-2">
                <input type="text" value={s.btn1Text} onChange={e => updateSection(s.id, { btn1Text: e.target.value })} className="w-1/2 border p-2 text-sm" />
                <input type="text" value={s.btn1Link} onChange={e => updateSection(s.id, { btn1Link: e.target.value })} className="w-1/2 border p-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Btn 2 Text & Link</label>
              <div className="flex gap-2">
                <input type="text" value={s.btn2Text} onChange={e => updateSection(s.id, { btn2Text: e.target.value })} className="w-1/2 border p-2 text-sm" />
                <input type="text" value={s.btn2Link} onChange={e => updateSection(s.id, { btn2Link: e.target.value })} className="w-1/2 border p-2 text-sm" />
              </div>
            </div>
          </div>
        );
      case "selected_work":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase text-muted">Heading</label>
              <input type="text" value={s.heading} onChange={e => updateSection(s.id, { heading: e.target.value })} className="w-full border p-2 text-sm" />
            </div>
            <div>
              <label className="text-xs uppercase text-muted">View All Link Text</label>
              <input type="text" value={s.linkText} onChange={e => updateSection(s.id, { linkText: e.target.value })} className="w-full border p-2 text-sm" />
            </div>
          </div>
        );
      case "latest_journey":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase text-muted">Heading</label>
              <input type="text" value={s.heading} onChange={e => updateSection(s.id, { heading: e.target.value })} className="w-full border p-2 text-sm" />
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Post Count to Show</label>
              <input type="number" value={s.count} onChange={e => updateSection(s.id, { count: parseInt(e.target.value) })} className="w-full border p-2 text-sm" />
            </div>
          </div>
        );
      case "about_teaser":
      case "custom":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex gap-4 items-center">
              {s.image && <div className="w-24 h-16 relative bg-gray-100"><Image src={s.image} alt="img" fill className="object-cover" /></div>}
              <CldUploadWidget uploadPreset="shanky_portfolio" onSuccess={(r: any) => updateSection(s.id, { image: r.info.secure_url })}>
                {({ open }) => <button type="button" onClick={() => open()} className="border p-2 text-xs uppercase">Upload Image (Optional)</button>}
              </CldUploadWidget>
            </div>
            <div className="col-span-2">
              <label className="text-xs uppercase text-muted">Heading</label>
              <input type="text" value={s.heading} onChange={e => updateSection(s.id, { heading: e.target.value })} className="w-full border p-2 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-xs uppercase text-muted">Text</label>
              <textarea value={s.text} onChange={e => updateSection(s.id, { text: e.target.value })} className="w-full border p-2 text-sm resize-none" rows={3} />
            </div>
            {s.type === 'about_teaser' && (
              <div>
                <label className="text-xs uppercase text-muted">Link Text</label>
                <input type="text" value={s.linkText} onChange={e => updateSection(s.id, { linkText: e.target.value })} className="w-full border p-2 text-sm" />
              </div>
            )}
          </div>
        );
      case "booking_cta":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs uppercase text-muted">Heading</label>
              <input type="text" value={s.heading} onChange={e => updateSection(s.id, { heading: e.target.value })} className="w-full border p-2 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-xs uppercase text-muted">Subtext</label>
              <input type="text" value={s.text} onChange={e => updateSection(s.id, { text: e.target.value })} className="w-full border p-2 text-sm" />
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Btn Text</label>
              <input type="text" value={s.btnText} onChange={e => updateSection(s.id, { btnText: e.target.value })} className="w-full border p-2 text-sm" />
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Btn Link</label>
              <input type="text" value={s.btnLink} onChange={e => updateSection(s.id, { btnLink: e.target.value })} className="w-full border p-2 text-sm" />
            </div>
          </div>
        );
      case "instagram":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase text-muted">Copyright Text</label>
              <input type="text" value={s.text} onChange={e => updateSection(s.id, { text: e.target.value })} className="w-full border p-2 text-sm" />
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Instagram Handle</label>
              <input type="text" value={s.handle} onChange={e => updateSection(s.id, { handle: e.target.value })} className="w-full border p-2 text-sm" />
            </div>
          </div>
        );
      default: return null;
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-primary">Homepage Builder</h1>
        <div className="flex gap-4">
          <button onClick={addCustomBlock} className="flex items-center gap-2 border border-primary text-primary px-4 py-2 uppercase text-xs hover:bg-gray-50">
            <Plus size={16} /> Add Custom Block
          </button>
          <button onClick={saveSections} disabled={saving} className="bg-primary text-white px-6 py-2 uppercase text-xs hover:bg-accent disabled:opacity-50">
            {saving ? "Saving..." : "Save Layout"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((s, index) => (
          <div key={s.id} className={`bg-white border ${s.visible ? 'border-border' : 'border-dashed border-gray-300 opacity-60'} rounded-lg shadow-sm overflow-hidden`}>
            
            {/* Header / Controls */}
            <div className="flex items-center justify-between bg-gray-50 p-4 border-b border-border">
              <div className="flex items-center gap-4">
                <span className="font-serif text-lg uppercase">{s.type.replace('_', ' ')}</span>
                <span className="text-xs text-muted uppercase tracking-widest">{s.visible ? 'Visible' : 'Hidden'}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateSection(s.id, { visible: !s.visible })} className="p-2 hover:bg-gray-200 rounded">
                  {s.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button onClick={() => moveUp(index)} disabled={index === 0} className="p-2 hover:bg-gray-200 rounded disabled:opacity-30">
                  <ArrowUp size={18} />
                </button>
                <button onClick={() => moveDown(index)} disabled={index === sections.length - 1} className="p-2 hover:bg-gray-200 rounded disabled:opacity-30">
                  <ArrowDown size={18} />
                </button>
                <button onClick={() => deleteSection(s.id)} className="p-2 hover:bg-gray-200 text-red-500 rounded">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Content Editor */}
            <div className="p-6">
              {renderSectionEditor(s)}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
