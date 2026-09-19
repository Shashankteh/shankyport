"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Trash2, GripVertical, Star, Plus } from "lucide-react";

type Photo = {
  id: string;
  title: string | null;
  image_url: string;
  cloudinary_public_id: string;
  category: string | null;
  display_order: number;
  is_featured: boolean;
};

type Category = {
  id: string;
  name: string;
};

export default function PhotosManager() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [photosRes, categoriesRes] = await Promise.all([
      supabase.from("photos").select("*").order("display_order", { ascending: true }),
      supabase.from("categories").select("*").order("display_order", { ascending: true })
    ]);
    if (photosRes.data) setPhotos(photosRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    setLoading(false);
  };

  const handleUploadSuccess = async (result: any) => {
    const info = result.info;
    const newPhoto = {
      image_url: info.secure_url,
      cloudinary_public_id: info.public_id,
      display_order: photos.length,
      is_featured: false,
    };

    const { data, error } = await supabase.from("photos").insert([newPhoto]).select();
    if (data) {
      setPhotos([...photos, data[0]]);
    } else {
      console.error("Error saving photo to DB:", error);
    }
  };

  const updatePhoto = async (id: string, updates: Partial<Photo>) => {
    const { error } = await supabase.from("photos").update(updates).eq("id", id);
    if (!error) {
      setPhotos(photos.map(p => p.id === id ? { ...p, ...updates } : p));
    }
  };

  const deletePhoto = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    const { error } = await supabase.from("photos").delete().eq("id", id);
    if (!error) {
      setPhotos(photos.filter(p => p.id !== id));
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    const categoryName = newCategory.trim().toUpperCase();
    
    const { data, error } = await supabase.from("categories").insert([{ name: categoryName, display_order: categories.length }]).select();
    if (data) {
      setCategories([...categories, data[0]]);
      setNewCategory("");
    } else {
      alert("Error adding category (it might already exist).");
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category? Photos in this category will become uncategorized.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  if (loading) return <div>Loading photos...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-primary">Photos</h1>
        <CldUploadWidget 
          uploadPreset="shanky_portfolio"
          onSuccess={handleUploadSuccess}
          options={{ multiple: true }}
        >
          {({ open }) => (
            <button 
              onClick={() => open()}
              className="bg-primary text-white px-4 py-2 uppercase tracking-widest text-sm hover:bg-accent transition-colors rounded-sm"
            >
              Upload Photos
            </button>
          )}
        </CldUploadWidget>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Manager Sidebar */}
        <div className="lg:col-span-1 bg-white p-4 border border-border shadow-sm rounded-lg h-fit">
          <h2 className="text-lg font-serif mb-4">Categories</h2>
          <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="NEW CATEGORY"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              className="w-full border border-border p-2 focus:outline-none focus:border-primary text-xs uppercase"
            />
            <button type="submit" className="bg-primary text-white p-2 hover:bg-accent"><Plus size={16} /></button>
          </form>
          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat.id} className="flex justify-between items-center p-2 bg-gray-50 border border-border text-xs uppercase tracking-wider">
                <span>{cat.name}</span>
                <button onClick={() => deleteCategory(cat.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Photos List */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-border p-4">
          {photos.length === 0 ? (
            <p className="text-muted text-center py-12">No photos uploaded yet.</p>
          ) : (
            <div className="space-y-4">
              {photos.map((photo) => (
                <div key={photo.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-border rounded-md bg-gray-50">
                  <div className="flex items-center gap-4">
                    <GripVertical className="text-gray-400 cursor-move hidden md:block" />
                    <div className="relative w-20 h-24 bg-gray-200 flex-shrink-0">
                      <Image src={photo.image_url} alt="thumbnail" fill className="object-cover" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <select 
                      value={photo.category || ""}
                      onChange={(e) => updatePhoto(photo.id, { category: e.target.value })}
                      className="w-full md:w-auto border border-border p-2 rounded-sm text-sm uppercase tracking-wider"
                    >
                      <option value="">UNCATEGORIZED</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <button 
                      onClick={() => updatePhoto(photo.id, { is_featured: !photo.is_featured })}
                      className={`p-2 rounded-full ${photo.is_featured ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                      title="Feature on Home Page"
                    >
                      <Star size={20} fill={photo.is_featured ? "currentColor" : "none"} />
                    </button>
                    <button 
                      onClick={() => deletePhoto(photo.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
