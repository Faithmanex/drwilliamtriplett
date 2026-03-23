import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { booksCatalog } from "../data/books";
import { validateOrigin } from './_utils/security';

const resend = new Resend(process.env.RESEND_API_KEY);

// Supabase client for purchases table
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nntdawowuukgxitwcnlp.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5udGRhd293dXVrZ3hpdHdjbmxwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDIxODQ2MiwiZXhwIjoyMDg5Nzk0NDYyfQ.BjH6u2v_hOx2vPBy9mPwqE5ioLgrisoLPttYjFwMCPQ";
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: any, res: any) {
  if (!validateOrigin(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, bookId, bookTitle, bookSubtitle, price } = req.body;
    
    // Validate bookId against central catalog
    const book = booksCatalog.find(b => b.id === bookId);
    if (!book) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    // Use the central proxy for all digital downloads
    const downloadUrl = book.blobUrl ? `/api/download?file=${bookId}` : "#";
    
    // Get country info from Vercel headers
    const countryCode = req.headers["x-vercel-ip-country"] || "US";
    const flagEmoji = (countryCode as string)
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

    const emailHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; font-family: 'Georgia', serif; font-size: 28px; font-weight: bold; margin: 0;">Dr. William Triplett</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 8px; text-transform: uppercase; letter-spacing: 2px;">Faith • Leadership • Flourishing</p>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #1e293b; font-family: 'Georgia', serif; font-size: 24px; margin-top: 0; margin-bottom: 20px;">Thank you for your purchase</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            We are pleased to confirm your order. Your digital resource is now available for download.
          </p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
            <div style="font-family: 'Georgia', serif; font-size: 20px; font-weight: bold; color: #1e293b; margin-bottom: 5px;">${bookTitle}</div>
            <div style="color: #64748b; font-style: italic; font-size: 14px; margin-bottom: 20px;">${bookSubtitle}</div>
            <div style="text-align: center;">
              <a href="https://drwilliamtriplett.com${downloadUrl}" style="background-color: #CCA43B; color: #ffffff; display: inline-block; padding: 14px 28px; font-weight: bold; text-decoration: none; border-radius: 6px; font-size: 16px;">
                Download Digital Copy
              </a>
            </div>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 12px;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Dr. William Triplett. All rights reserved.</p>
        </div>
      </div>
    `;

    // 1. Save purchase to database (with email, no user_id - will link on signup)
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        email: email,
        book_id: bookId,
        amount: price,
        status: 'completed',
      })
      .select()
      .single();

    if (purchaseError) {
      console.error('Purchase insert error:', purchaseError);
      // Continue anyway - email is more important
    }

    // 2. Send download email to the buyer
    await resend.emails.send({
      from: "Dr. William Triplett <onboarding@drwilliamtriplett.com>",
      to: [email],
      subject: `Your Resource: ${bookTitle}`,
      html: emailHtml,
    });

    // 2. Send notification email (admin notification logic remains ...)
    // ... (Keeping it simple for this task as it was already working)
    
     const adminEmailHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #0f172a; padding: 25px 15px; text-align: center;">
          <h1 style="color: #ffffff; font-family: 'Georgia', serif; font-size: 22px; font-weight: bold; margin: 0;">Dr. William Triplett</h1>
          <p style="color: #CCA43B; font-size: 12px; margin-top: 6px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">Sales Notification</p>
        </div>
        
        <div style="padding: 25px 20px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 12px 15px; background-color: #f8fafc; border: 1px solid #f1f5f9;">
                <p style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 2px 0;">Product</p>
                <p style="color: #1e293b; font-size: 15px; font-weight: 600; margin: 0;">${bookTitle}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 15px; background-color: #ffffff; border: 1px solid #f1f5f9;">
                <p style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 2px 0;">Amount Received</p>
                <p style="color: #1e293b; font-size: 20px; font-weight: bold; margin: 0;">$${price ? parseFloat(price).toFixed(2) : "0.00"}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 15px; background-color: #f8fafc; border: 1px solid #f1f5f9;">
                <p style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 2px 0;">Customer</p>
                <p style="color: #1e293b; font-size: 14px; margin: 0;">${email}</p>
              </td>
            </tr>
          </table>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: "Sales Notification <onboarding@resend.dev>",
      to: ["will@drwilliamtriplett.com"],
      subject: `🔔 New Sale: $${price ? parseFloat(price).toFixed(2) : "0.00"} - ${bookTitle}`,
      html: adminEmailHtml,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email sending error:", err);
    return res.status(500).json({ success: false, error: "Email failed" });
  }
}
