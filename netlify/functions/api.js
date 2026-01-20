import serverless from 'serverless-http';
import express from 'express';
import { Resend } from 'resend';

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(express.json());

app.post('/api/send-email', async (req, res) => {
  try {
    const { from, to, subject, html, reply_to } = req.body;

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      reply_to
    });

    if (error) {
      console.error('Resend Error:', error);
      return res.status(400).json({ error });
    }

    res.status(200).json({ data });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/purchase-confirmation', async (req, res) => {
  try {
    const { to, bookId, bookTitle, bookSubtitle } = req.body;

    if (!to || !bookId) {
       return res.status(400).json({ error: 'Missing required fields' });
    }

    const envKey = `DOWNLOAD_URL_${bookId.replace(/-/g, '_').toUpperCase()}`;
    const downloadUrl = process.env[envKey];

    if (!downloadUrl) {
        console.error(`Download URL not found for book ID: ${bookId} (Key: ${envKey})`);
        return res.status(404).json({ error: 'Resource not available' });
    }

    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; font-family: 'Georgia', serif; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 0.5px;">Dr. William Triplett</h1>
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

    const { data, error } = await resend.emails.send({
      from: 'Dr. William Triplett <onboarding@resend.dev>',
      to,
      subject: `Your Resource: ${bookTitle}`,
      html,
    });

    if (error) {
      console.error('Resend Error:', error);
      return res.status(400).json({ error });
    }

    res.status(200).json({ data });

  } catch (error) {
     console.error('Purchase Confirmation Error:', error);
     res.status(500).json({ error: error.message });
  }
});

export const handler = serverless(app);
