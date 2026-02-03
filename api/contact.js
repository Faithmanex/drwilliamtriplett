import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, subject, message } = req.body;

    const emailHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; font-family: 'Georgia', serif; font-size: 28px; font-weight: bold; margin: 0;">Dr. William Triplett</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 8px; text-transform: uppercase; letter-spacing: 2px;">New Contact Inquiry</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <div style="background-color: #fef3c7; border-left: 4px solid #CCA43B; padding: 16px 20px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
            <p style="color: #92400e; font-size: 14px; font-weight: 600; margin: 0;">Topic: ${subject}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <tr>
              <td style="padding: 16px 20px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                <p style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px 0;">From</p>
                <p style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0;">${name}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 16px 20px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                <p style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px 0;">Email Address</p>
                <p style="color: #1e293b; font-size: 16px; margin: 0;">
                  <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                </p>
              </td>
            </tr>
          </table>

          <div style="margin-bottom: 30px;">
            <p style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px 0;">Message</p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
              <p style="color: #334155; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="mailto:${email}?subject=Re: ${subject}" style="background-color: #CCA43B; color: #ffffff; display: inline-block; padding: 14px 32px; font-weight: bold; text-decoration: none; border-radius: 6px; font-size: 14px;">
              Reply to ${name.split(' ')[0]}
            </a>
          </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 12px;">
          <p style="margin: 0 0 8px 0;">This message was sent via the contact form on drwilliamtriplett.com</p>
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Dr. William Triplett. All rights reserved.</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: "Contact Inquiries <onboarding@resend.dev>",
      to: ["will@drwilliamtriplett.com"],
      reply_to: email,
      subject: `📩 New Inquiry: ${subject} — from ${name}`,
      html: emailHtml,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email sending error:", err);
    return res.status(500).json({ success: false, error: "Email failed" });
  }
}
