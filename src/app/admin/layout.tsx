"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Image as ImageIcon, Camera, BookOpen, User, Settings, LogOut, Home, Inbox } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/photos", label: "Photos", icon: ImageIcon },
  { href: "/admin/shoots", label: "Shoots", icon: Camera },
  { href: "/admin/journey", label: "Journey", icon: BookOpen },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/profile", label: "Profile", icon: User },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    fetchInquiriesCount();
    
    // Subscribe to realtime changes in inquiries
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, () => {
        fetchInquiriesCount();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchInquiriesCount = async () => {
    const { count } = await supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new");
    if (count !== null) setNewCount(count);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-border h-screen sticky top-0">
        <div className="p-6">
          <h2 className="text-xl font-serif">Admin Panel</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-md transition-colors ${
                  isActive ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </div>
                {item.href === "/admin/inquiries" && newCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {newCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-border flex justify-around p-2 z-50 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-md relative flex-shrink-0 ${
                isActive ? "text-primary" : "text-gray-500"
              }`}
            >
              <div className="relative">
                <item.icon size={20} />
                {item.href === "/admin/inquiries" && newCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {newCount}
                  </span>
                )}
              </div>
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
