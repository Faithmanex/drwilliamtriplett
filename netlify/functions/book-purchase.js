import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const downloadUrls = {
  "harbor-hopes": process.env.DOWNLOAD_URL_HARBOR_HOPES || "#",
  "ethical-algorithm": process.env.DOWNLOAD_URL_ETHICAL_ALGORITHM || "#",
  "sacred-signals": process.env.DOWNLOAD_URL_SACRED_SIGNALS || "#",
  "fractured-foundations": process.env.DOWNLOAD_URL_FRACTURED_FOUNDATIONS || "#",
};

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { email, bookId, bookTitle, bookSubtitle } = JSON.parse(event.body);
    const downloadUrl = downloadUrls[bookId] || "#";

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
              <a href="${downloadUrl}" style="background-color: #CCA43B; color: #ffffff; display: inline-block; padding: 14px 28px; font-weight: bold; text-decoration: none; border-radius: 6px; font-size: 16px;">
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

    await resend.emails.send({
      from: "Dr. William Triplett <onboarding@resend.dev>",
      to: ["fmanekponne@gmail.com"],
      subject: `Your Resource: ${bookTitle}`,
      html: emailHtml,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Email sending error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Email failed" }),
    };
  }
}
