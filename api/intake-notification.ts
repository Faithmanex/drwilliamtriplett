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

    // Email templates from the guide
    const facultyConfirmationSubject = "Faculty Strategy Intensive – Next Steps";
    const facultyConfirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">Faculty Strategy Intensive – Next Steps</h2>
        <p>Dear ${firstName},</p>
        <p>Thank you for submitting your Faculty Strategy Intake.</p>
        <p>I will review your materials and contact you within <strong>48 business hours</strong> to schedule your session.</p>
        <p>All consultations are confidential.</p>
        <p>Best regards,<br/>Dr. William Triplett, PhD</p>
      </div>
    `;

    const dissertationConfirmationSubject = "Dissertation Strategy Intensive – Next Steps";
    const dissertationConfirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">Dissertation Strategy Intensive – Next Steps</h2>
        <p>Dear ${firstName},</p>
        <p>Thank you for submitting your Dissertation Strategy Intake.</p>
        <p>I will review your materials and contact you within <strong>48 business hours</strong> to coordinate scheduling.</p>
        <p>All services are advisory and confidential.</p>
        <p>Best regards,<br/>Dr. William Triplett, PhD</p>
      </div>
    `;

    // Send confirmation email to CLIENT
    await resend.emails.send({
      from: "Dr. William Triplett <onboarding@drwilliamtriplett.com>",
      to: [userEmail],
      subject: formType === 'faculty_strategy' ? facultyConfirmationSubject : dissertationConfirmationSubject,
      html: formType === 'faculty_strategy' ? facultyConfirmationHtml : dissertationConfirmationHtml,
    });

    // Build admin email content for Dr. Triplett
    let adminContent = `<h2 style="color: #1a365d;">New ${formType === 'faculty_strategy' ? 'Faculty Strategy' : 'Dissertation Strategy'} Intake Form</h2>`;
    adminContent += `<p><strong>Service:</strong> ${serviceName}</p>`;
    adminContent += `<p><strong>Client Email:</strong> ${userEmail}</p>`;
    adminContent += `<p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p><hr/>`;
    
    for (const [key, value] of Object.entries(formData)) {
      if (key !== 'acknowledgment' && value) {
        if (Array.isArray(value)) {
          adminContent += `<p><strong>${key}:</strong> ${value.join(', ')}</p>`;
        } else {
          adminContent += `<p><strong>${key}:</strong> ${value}</p>`;
        }
      }
    }

    // Send notification to Dr. Triplett
    await resend.emails.send({
      from: "Nexcellence Academy <onboarding@drwilliamtriplett.com>",
      to: [ "drtriplettdev@gmail.com"],
      subject: `New Intake: ${serviceName} - ${formData.fullName || userEmail}`,
      html: adminContent,
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