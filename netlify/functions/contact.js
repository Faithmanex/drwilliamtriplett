import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { name, email, subject, message } = JSON.parse(event.body);

    await resend.emails.send({
      from: "Contact Inquiries <onboarding@resend.dev>",
      to: ["fmanekponne@gmail.com"],
      reply_to: email,
      subject: `Platform Inquiry: ${subject} from ${name}`,
      html: `
        <div>
          <h1>New Inquiry</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
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
