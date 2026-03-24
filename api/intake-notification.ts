import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { validateOrigin } from './_utils/security';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

    // Log to Google Sheets (if credentials provided)
    if (process.env.GOOGLE_SHEETS_API_KEY) {
      // Google Sheets logging would go here
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: "Failed to send notification" });
  }
}