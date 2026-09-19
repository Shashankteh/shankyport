"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company_or_brand: "",
    shoot_type: "Fashion & Editorial",
    message: ""
  });
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const { error } = await supabase.from("inquiries").insert([formData]);
      
      if (error) throw error;
      
      // Optionally trigger email route here if configured
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(err => console.error("Email notification failed", err));

      setStatus("success");
      setFormData({ name: "", email: "", company_or_brand: "", shoot_type: "Fashion & Editorial", message: "" });
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl mb-4">Thank you for your inquiry.</h3>
        <p className="text-muted">I will get back to you as soon as possible.</p>
        <button 
          onClick={() => setStatus("idle")}
          className="mt-8 uppercase tracking-widest text-sm text-accent hover:text-primary transition-colors border-b border-transparent hover:border-primary"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === "error" && (
        <div className="bg-red-50 text-red-600 p-4 rounded-sm text-sm border border-red-100">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="uppercase tracking-widest text-xs text-muted">Name *</label>
          <input 
            type="text" 
            id="name" 
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full border-b border-border bg-transparent py-2 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="uppercase tracking-widest text-xs text-muted">Email *</label>
          <input 
            type="email" 
            id="email" 
            required
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full border-b border-border bg-transparent py-2 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="company" className="uppercase tracking-widest text-xs text-muted">Company / Brand (Optional)</label>
          <input 
            type="text" 
            id="company" 
            value={formData.company_or_brand}
            onChange={e => setFormData({ ...formData, company_or_brand: e.target.value })}
            className="w-full border-b border-border bg-transparent py-2 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="shoot_type" className="uppercase tracking-widest text-xs text-muted">Inquiry Type *</label>
          <select 
            id="shoot_type" 
            value={formData.shoot_type}
            onChange={e => setFormData({ ...formData, shoot_type: e.target.value })}
            className="w-full border-b border-border bg-transparent py-2 focus:outline-none focus:border-primary transition-colors rounded-none"
          >
            <option value="Fashion & Editorial">Fashion & Editorial</option>
            <option value="Commercial">Commercial</option>
            <option value="Brand Collaboration">Brand Collaboration</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="uppercase tracking-widest text-xs text-muted">Message *</label>
        <textarea 
          id="message" 
          required
          rows={5}
          value={formData.message}
          onChange={e => setFormData({ ...formData, message: e.target.value })}
          className="w-full border-b border-border bg-transparent py-2 focus:outline-none focus:border-primary transition-colors resize-none"
        ></textarea>
      </div>

      <button 
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-primary text-background uppercase tracking-widest text-sm py-4 hover:bg-accent transition-colors disabled:opacity-50"
      >
        {status === "submitting" ? "Sending..." : "Submit Inquiry"}
      </button>
    </form>
  );
}
