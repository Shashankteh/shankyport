"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Trash2, CheckCircle, Circle, Mail, Building } from "lucide-react";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  company_or_brand: string | null;
  shoot_type: string | null;
  message: string;
  status: string;
  created_at: string;
};

export default function InquiriesManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    if (data) setInquiries(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("inquiries").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setInquiries(inquiries.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc));
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Delete this inquiry completely?")) return;
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (!error) {
      setInquiries(inquiries.filter(inc => inc.id !== id));
    }
  };

  if (loading) return <div>Loading inquiries...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-primary">Inquiries</h1>
      </div>

      <div className="space-y-4">
        {inquiries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-border p-12 text-center text-muted">
            No inquiries received yet.
          </div>
        ) : (
          inquiries.map((inq) => (
            <div key={inq.id} className={`bg-white rounded-lg shadow-sm border p-6 flex flex-col md:flex-row gap-6 transition-colors ${inq.status === 'new' ? 'border-primary shadow-md' : 'border-border'}`}>
              
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-serif text-primary mb-1">{inq.name}</h3>
                    <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-muted flex-wrap">
                      <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-primary transition-colors"><Mail size={14} /> {inq.email}</a>
                      {inq.company_or_brand && <span className="flex items-center gap-1"><Building size={14} /> {inq.company_or_brand}</span>}
                      <span className="px-2 py-1 bg-gray-100 rounded-sm">{inq.shoot_type}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted uppercase tracking-widest">{new Date(inq.created_at).toLocaleDateString()}</span>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-sm border border-border text-primary whitespace-pre-wrap leading-relaxed text-sm">
                  {inq.message}
                </div>
              </div>

              <div className="flex md:flex-col items-center justify-end gap-3 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                {inq.status === 'new' ? (
                  <button 
                    onClick={() => updateStatus(inq.id, 'read')}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2 bg-primary text-white hover:bg-accent transition-colors w-full justify-center rounded-sm"
                  >
                    <Circle size={14} /> Mark Read
                  </button>
                ) : (
                  <button 
                    onClick={() => updateStatus(inq.id, 'new')}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2 border border-border text-muted hover:text-primary transition-colors w-full justify-center rounded-sm"
                  >
                    <CheckCircle size={14} className="text-green-500" /> Read
                  </button>
                )}
                <button 
                  onClick={() => deleteInquiry(inq.id)}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 transition-colors w-full justify-center rounded-sm"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
