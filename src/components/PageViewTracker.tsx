"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function PageViewTracker() {
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    // Only track public routes, not admin or api
    if (pathname && !pathname.startsWith("/admin") && !pathname.startsWith("/api") && !pathname.startsWith("/login")) {
      supabase.from("page_views").insert([{ path: pathname }]).then();
    }
  }, [pathname, supabase]);

  return null;
}
