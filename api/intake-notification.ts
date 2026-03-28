import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { validateOrigin } from './_utils/security.js';
import { logToGoogleSheet } from './_utils/google-sheets.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (!validateOrigin(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { consultationId, formType, formData, userEmail, serviceName } = req.body;
    const firstName = formData.fullName?.split(' ')[0] || 'Client';

    const facultyConfirmationSubject = "Faculty Strategy Intensive – Next Steps";
    const dissertationConfirmationSubject = "Dissertation Strategy Intensive – Next Steps";

    // Professional confirmation email for CLIENT
    const clientEmailHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Nexcellence Academy</h1>
        </div>
        <div style="padding: 32px; background-color: #ffffff;">
          <h2 style="color: #0f172a; margin-top: 0;">Submission Confirmation</h2>
          <p style="color: #475569; line-height: 1.6;">Dear ${firstName},</p>
          <p style="color: #475569; line-height: 1.6;">
            Thank you for submitting your <strong>${serviceName}</strong> intake form. 
            I have received your information and will review it carefully.
          </p>
          <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="color: #0f172a; margin: 0; font-weight: bold;">Next Steps:</p>
            <p style="color: #475569; margin: 8px 0 0; font-size: 14px;">
              I will contact you within <strong>48 business hours</strong> to coordinate scheduling and discuss the next phase of our engagement.
            </p>
          </div>
          <p style="color: #475569; line-height: 1.6; font-size: 14px; margin-bottom: 0;">
            Best regards,<br/>
            <strong>Dr. William Triplett, PhD</strong>
          </p>
        </div>
      </div>
    `;

    // Send confirmation email to CLIENT
    await resend.emails.send({
      from: "Dr. William Triplett <onboarding@drwilliamtriplett.com>",
      to: [userEmail],
      subject: formType === 'faculty_strategy' ? facultyConfirmationSubject : dissertationConfirmationSubject,
      html: clientEmailHtml,
    });

    // Build ENHANCED admin email content for Dr. Triplett
    const formatLabel = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
    
    let rowsHtml = '';
    for (const [key, value] of Object.entries(formData)) {
      if (key !== 'acknowledgment' && value) {
        const displayValue = Array.isArray(value) ? value.join(', ') : String(value);
        rowsHtml += `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px; width: 35%;">${formatLabel(key)}</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px; font-weight: 500;">${displayValue}</td>
          </tr>
        `;
      }
    }

    const adminEmailHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
        <div style="background-color: #0f172a; padding: 20px 32px; display: flex; align-items: center; justify-content: space-between;">
          <h2 style="color: #ffffff; margin: 0; font-size: 18px;">New Intake Notification</h2>
          <span style="background-color: #334155; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;">Priority</span>
        </div>
        <div style="padding: 32px;">
          <div style="margin-bottom: 32px;">
            <p style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Service Type</p>
            <h1 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800;">${serviceName}</h1>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
            <tr>
              <td style="padding-bottom: 24px;">
                <p style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 4px 0;">Client Email</p>
                <a href="mailto:${userEmail}" style="color: #2563eb; text-decoration: none; font-weight: 600; font-size: 16px;">${userEmail}</a>
              </td>
              <td style="padding-bottom: 24px; text-align: right;">
                <p style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 4px 0;">Submitted On</p>
                <p style="color: #0f172a; margin: 0; font-weight: 600; font-size: 16px;">${new Date().toLocaleDateString()}</p>
              </td>
            </tr>
          </table>

          <div style="border-top: 2px solid #0f172a; padding-top: 24px;">
            <h3 style="color: #0f172a; margin: 0 0 16px 0; font-size: 16px;">Intake Form Data</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${rowsHtml}
            </table>
          </div>

          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center;">
            <a href="https://drwilliamtriplett.com/admin/consultations" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">View in Dashboard</a>
          </div>
        </div>
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">&copy; ${new Date().getFullYear()} Nexcellence Academy. Confidential Client Data.</p>
        </div>
      </div>
    `;

    // Send notification to Dr. Triplett
    await resend.emails.send({
      from: "Nexcellence Academy <onboarding@drwilliamtriplett.com>",
      to: [ "drtriplettdev@gmail.com"],
      subject: `New Intake: ${serviceName} - ${formData.fullName || userEmail}`,
      html: adminEmailHtml,
    });

    // Log to Google Sheets
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      try {
        // Build a readable summary of all form fields
        const details = Object.entries(formData)
          .filter(([key]) => key !== 'acknowledgment')
          .map(([key, value]) => {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
            const val = Array.isArray(value) ? value.join(', ') : String(value || '—');
            return `${label}: ${val}`;
          })
          .join(' | ');

        await logToGoogleSheet({
          sheetId: process.env.GOOGLE_SHEET_ID!,
          tabName: process.env.GOOGLE_SHEET_TAB || 'Sheet1',
          values: [
            new Date().toISOString(),
            formData.fullName || '',
            userEmail,
            formData.phone || formData.phoneNumber || '',
            serviceName,
            formType,
            details,
          ],
        });
      } catch (sheetError) {
        console.error('Google Sheets logging failed:', sheetError);
        // Don't fail the request — email was sent successfully
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: "Failed to send notification" });
  }
}