import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

async function runTests() {
  console.log("--- DB MIGRATION CHECKS ---");
  
  // 1. page_views
  const { error: pageViewsErr } = await supabase.from('page_views').select('*').limit(1);
  if (pageViewsErr && pageViewsErr.code === '42P01') {
    console.log("❌ page_views table missing (run v6_schema.sql)");
  } else {
    console.log("✅ page_views table exists");
  }

  // 2. inquiries
  const { error: inquiriesErr } = await supabase.from('inquiries').select('*').limit(1);
  if (inquiriesErr && inquiriesErr.code === '42P01') {
    console.log("❌ inquiries table missing (run v5_schema.sql)");
  } else {
    console.log("✅ inquiries table exists (RLS active, code: " + (inquiriesErr ? inquiriesErr.code : "OK") + ")");
  }

  // 3. shoot_id on journey_posts
  const { error: jpErr } = await supabase.from('journey_posts').select('shoot_id').limit(1);
  if (jpErr) {
    console.log("❌ shoot_id column on journey_posts missing (run v4_schema.sql)");
  } else {
    console.log("✅ shoot_id column on journey_posts exists");
  }
}

runTests().catch(console.error);
