import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

async function testInquiry() {
  console.log("--- TEST INQUIRY ---");
  const formData = {
    name: "E2E Test User",
    email: "test@example.com",
    company_or_brand: "Test Brand",
    shoot_type: "Fashion & Editorial",
    message: "This is a test message from e2e test."
  };
  
  // No .select() because anonymous users can't read from inquiries
  const { error } = await supabase.from('inquiries').insert([formData]);
  if (error) {
    console.log("❌ Failed to insert inquiry:", error);
  } else {
    console.log("✅ Successfully inserted inquiry (without select)");
  }
}

testInquiry().catch(console.error);
