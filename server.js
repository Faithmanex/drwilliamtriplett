import express from 'express';
import { Resend } from 'resend';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const app = express();
const port = 3001;

// Initialize Resend with the API key
// Using the key found in the code if not in env, though env is preferred
const resend = new Resend(process.env.RESEND_API_KEY || 're_VUQPxKxm_8krL3hXocyTpN4K4NkTtahQy');

app.use(cors());
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

    // Securely look up download URL from environment variables
    const envKey = `DOWNLOAD_URL_${bookId.replace(/-/g, '_').toUpperCase()}`;
    const downloadUrl = process.env[envKey];

    if (!downloadUrl) {
        console.error(`Download URL not found for book ID: ${bookId} (Key: ${envKey})`);
        return res.status(404).json({ error: 'Resource not available' });
    }

    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        
        <!-- Header -->
        <div style="background-color: #0f172a; padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; font-family: 'Georgia', serif; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 0.5px;">Dr. William Triplett</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 8px; text-transform: uppercase; letter-spacing: 2px;">Faith • Leadership • Flourishing</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #1e293b; font-family: 'Georgia', serif; font-size: 24px; margin-top: 0; margin-bottom: 20px;">Thank you for your purchase</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            We are pleased to confirm your order. Your digital resource is now available for download. We hope this work enriches your journey and provides valuable insights.
          </p>

          <!-- Book Card -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
            <div style="font-family: 'Georgia', serif; font-size: 20px; font-weight: bold; color: #1e293b; margin-bottom: 5px;">${bookTitle}</div>
            <div style="color: #64748b; font-style: italic; font-size: 14px; margin-bottom: 20px;">${bookSubtitle}</div>
            
            <div style="text-align: center;">
              <a href="${downloadUrl}" style="background-color: #CCA43B; color: #ffffff; display: inline-block; padding: 14px 28px; font-weight: bold; text-decoration: none; border-radius: 6px; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                Download Digital Copy
              </a>
            </div>
            <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 15px; margin-bottom: 0;">This secure link is valid for 24 hours.</p>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 30px;">
            <p style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0;">
              <strong>Next Steps:</strong><br/>
              1. Click the button above to save the PDF to your device.<br/>
              2. If you have any trouble accessing the file, simply reply to this email for support.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 12px;">
          <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} Dr. William Triplett. All rights reserved.</p>
          <p style="margin: 0;">
            <a href="https://drwilliamtriplett.com" style="color: #64748b; text-decoration: underline;">Visit Website</a>
          </p>
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
