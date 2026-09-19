import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Only initialize Resend if the API key is present
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Fallback if no resend key is configured
    if (!resend) {
      console.warn("RESEND_API_KEY is not configured. Email notification skipped.");
      return NextResponse.json({ success: true, warning: "Email skipped, no API key" });
    }

    const { name, email, company_or_brand, shoot_type, message } = data;

    // We'll send it to a default email, or pull the email from process.env
    // Using a verified domain is required by Resend in production. For now we use the onboarding email
    const notificationEmail = process.env.NOTIFICATION_EMAIL || 'kana8432474451@gmail.com'; 

    await resend.emails.send({
      from: 'Portfolio Inquiries <onboarding@resend.dev>',
      to: notificationEmail,
      subject: `New Inquiry: ${shoot_type} from ${name}`,
      html: `
        <h2>New Inquiry Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company/Brand:</strong> ${company_or_brand || 'N/A'}</p>
        <p><strong>Shoot Type:</strong> ${shoot_type}</p>
        <hr />
        <h3>Message:</h3>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
