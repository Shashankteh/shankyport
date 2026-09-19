"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Trash2, Edit2, Plus, X } from "lucide-react";

type JourneyPost = {
  id: string;
  title: string;
  content: string | null;
  cover_image: string | null;
  date: string | null;
  status: string;
  shoot_id?: string | null;
};

export default function JourneyManager() {
  const [posts, setPosts] = useState<JourneyPost[]>([]);
  const [shoots, setShoots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<JourneyPost>>({});
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [postsRes, shootsRes] = await Promise.all([
      supabase.from("journey_posts").select("*").order("date", { ascending: false }),
      supabase.from("shoots").select("id, title, date").order("date", { ascending: false })
    ]);
    if (postsRes.data) setPosts(postsRes.data);
    if (shootsRes.data) setShoots(shootsRes.data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost.title) return alert("Title is required");

    // Default status if not set
    const postToSave = { ...currentPost, status: currentPost.status || 'draft' };

    if (currentPost.id) {
      const { error } = await supabase.from("journey_posts").update(postToSave).eq("id", currentPost.id);
      if (!error) {
        setPosts(posts.map(p => p.id === currentPost.id ? { ...p, ...postToSave } as JourneyPost : p));
      }
    } else {
      const { data, error } = await supabase.from("journey_posts").insert([postToSave]).select();
      if (data) {
        setPosts([data[0], ...posts]);
      }
    }
    setIsEditing(false);
    setCurrentPost({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("journey_posts").delete().eq("id", id);
    if (!error) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const toggleStatus = async (post: JourneyPost) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    const { error } = await supabase.from("journey_posts").update({ status: newStatus }).eq("id", post.id);
    if (!error) {
      setPosts(posts.map(p => p.id === post.id ? { ...p, status: newStatus } : p));
    }
  };

  const handleUploadSuccess = (result: any) => {
    setCurrentPost({ ...currentPost, cover_image: result.info.secure_url });
  };

  if (loading) return <div>Loading journey posts...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-primary">Journey</h1>
        {!isEditing && (
          <button 
            onClick={() => { setCurrentPost({ status: 'draft' }); setIsEditing(true); }}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 uppercase tracking-widest text-sm hover:bg-accent transition-colors rounded-sm"
          >
            <Plus size={16} /> Add Post
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm border border-border p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif">{currentPost.id ? "Edit Post" : "New Post"}</h2>
            <button type="button" onClick={() => setIsEditing(false)} className="text-muted hover:text-primary"><X size={20} /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted">Title *</label>
              <input 
                type="text" required
                value={currentPost.title || ""}
                onChange={e => setCurrentPost({...currentPost, title: e.target.value})}
                className="w-full border border-border p-2 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted">Date</label>
              <input 
                type="date"
                value={currentPost.date || ""}
                onChange={e => setCurrentPost({...currentPost, date: e.target.value})}
                className="w-full border border-border p-2 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-muted">Content</label>
              <textarea 
                rows={8}
                value={currentPost.content || ""}
                onChange={e => setCurrentPost({...currentPost, content: e.target.value})}
                className="w-full border border-border p-2 focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted">Status</label>
              <select 
                value={currentPost.status || "draft"}
                onChange={e => setCurrentPost({...currentPost, status: e.target.value})}
                className="w-full border border-border p-2 focus:outline-none focus:border-primary rounded-none bg-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted">Linked Shoot (Optional)</label>
              <select 
                value={currentPost.shoot_id || ""}
                onChange={e => setCurrentPost({...currentPost, shoot_id: e.target.value || null})}
                className="w-full border border-border p-2 focus:outline-none focus:border-primary rounded-none bg-transparent"
              >
                <option value="">None</option>
                {shoots.map(shoot => (
                  <option key={shoot.id} value={shoot.id}>{shoot.title} ({shoot.date || 'No Date'})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <label className="text-xs uppercase tracking-widest text-muted">Cover Image</label>
            <div className="flex items-center gap-4">
              {currentPost.cover_image && (
                <div className="relative w-32 h-24 bg-gray-100">
                  <Image src={currentPost.cover_image} alt="Cover" fill className="object-cover" />
                </div>
              )}
              <CldUploadWidget uploadPreset="shanky_portfolio" onSuccess={handleUploadSuccess}>
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="border border-primary px-4 py-2 uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-colors">
                    Upload Image
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>

          <button type="submit" className="bg-primary text-white px-6 py-2 uppercase tracking-widest text-sm hover:bg-accent transition-colors">
            Save Post
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-border p-4">
          {posts.length === 0 ? (
            <p className="text-muted text-center py-12">No posts added yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {posts.map(post => (
                <div key={post.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-12 bg-gray-100 flex-shrink-0">
                      {post.cover_image && <Image src={post.cover_image} alt={post.title} fill className="object-cover" />}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-primary">{post.title}</h3>
                      <p className="text-muted text-sm">{post.date ? new Date(post.date).toLocaleDateString() : 'No date'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleStatus(post)}
                      className={`text-xs uppercase tracking-widest px-3 py-1 border rounded-sm transition-colors ${post.status === 'published' ? 'border-accent text-accent' : 'border-gray-300 text-gray-500'}`}
                    >
                      {post.status}
                    </button>
                    <div className="flex gap-2 border-l border-border pl-4">
                      <button onClick={() => { setCurrentPost(post); setIsEditing(true); }} className="p-2 text-gray-500 hover:text-primary"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(post.id)} className="p-2 text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                    </div>
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
