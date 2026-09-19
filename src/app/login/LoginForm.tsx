"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-muted">Email</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-border p-2 focus:outline-none focus:border-primary"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-muted">Password</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-border p-2 focus:outline-none focus:border-primary"
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-primary text-background py-3 uppercase tracking-widest text-sm hover:bg-accent transition-colors disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
