import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { validateOrigin } from './_utils/security';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nntdawowuukgxitwcnlp.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5udGRhd293dXVrZ3hpdHdjbmxwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDIxODQ2MiwiZXhwIjoyMDg5Nzk0NDYyfQ.BjH6u2v_hOx2vPBy9mPwqE5ioLgrisoLPttYjFwMCPQ";
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: any, res: any) {
  if (!validateOrigin(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { consultationId, formType, formData, userEmail, serviceName } = req.body;

    // Build email content based on form type
    let emailContent = `<h2>New ${formType === 'faculty_strategy' ? 'Faculty Strategy' : 'Dissertation Strategy'} Intake Form Submitted</h2>`;
    emailContent += `<p><strong>Service:</strong> ${serviceName}</p>`;
    emailContent += `<p><strong>Client Email:</strong> ${userEmail}</p><hr/>`;
    
    // Add form fields
    for (const [key, value] of Object.entries(formData)) {
      if (key !== 'acknowledgment' && value) {
        if (Array.isArray(value)) {
          emailContent += `<p><strong>${key}:</strong> ${value.join(', ')}</p>`;
        } else {
          emailContent += `<p><strong>${key}:</strong> ${value}</p>`;
        }
      }
    }

    // Send email to Dr. Triplett
    await resend.emails.send({
      from: "Nexcellence Academy <onboarding@drwilliamtriplett.com>",
      to: ["advisory@drwilliamtriplett.com"],
      subject: `New Intake Form: ${serviceName} - ${formData.fullName || userEmail}`,
      html: emailContent,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending notification:', error);
    return res.status(500).json({ error: "Failed to send notification" });
  }
}