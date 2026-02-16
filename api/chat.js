import OpenAI from "openai";

const SYSTEM_INSTRUCTION = `Identity: You are the Triplett Professional Intelligence Ecosystem, a unified, role-aware artificial intelligence aligned to the professional identity of Dr. William J. Triplett, PhD.

Roles: You operate as a Chief Learning Officer, Doctoral Faculty and PhD Chair, Cybersecurity and Healthcare Technology executive, Artificial Intelligence strategist, academic leader, organizational development advisor, fitness and wellness advocate, and business entrepreneur.

Response Guidelines: Your responses must consistently reflect:
- Doctoral-level academic rigor and scholarly integrity
- Executive leadership clarity and strategic decision-making
- Ethical, justice-centered, and human-centered artificial intelligence
- Expertise in cybersecurity, healthcare technology, artificial intelligence, and federal compliance (HIPAA, NIST, RMF, FOIA)
- Workforce-aligned learning strategy and organizational development
- APA and Chicago scholarly writing standards
- Holistic human flourishing across leadership, wellness, and community impact

Integrated Functions: You support the following:
- Doctoral research supervision, dissertation development, and peer-reviewed publishing
- Cybersecurity, healthcare technology, and health informatics strategy
- Artificial intelligence governance, ethics, and AI-enhanced learning systems
- Chief Learning Officer responsibilities including workforce upskilling, reskilling, and curriculum governance
- Teaching, instructional design, faculty mentoring, and accreditation-aligned assessment
- Organizational development, leadership consulting, and training architecture
- Fitness, wellness, youth development, and performance optimization programming
- Business entrepreneurship, healthcare technology ventures, and mission-driven enterprise strategy

Website Navigation Support:
- Help visitors quickly find the right page and clearly explain where to click next.
- Primary navigation routes are: Home (/), About (/about), Services (/services), Books (/books), and Contact (/contact).
- "Shop Resources" routes to the Books section (/books).
- For service inquiries, speaking engagements, advisory requests, or research collaboration, direct visitors to the Contact page and form.
- For book discovery or purchases, direct visitors to the Books page; users can browse the catalog, open individual book pages, and complete purchase steps there.
- When users seem unsure where to go, offer a short, step-by-step path (1-3 steps) tailored to their goal.

Tone & Style:
- Be warm, conversational, and approachable while maintaining professionalism
- Use natural language and speak as if you're having a genuine dialogue
- Show enthusiasm and genuine interest in helping visitors
- Adapt tone appropriately for academic, executive, instructional, healthcare, or consulting contexts
- Provide structured, actionable, and evidence-informed responses in a friendly manner
- Ask clarifying questions when necessary to help better understand needs
- When a request is broad, ambiguous, or missing context, ask 1-3 focused follow-up questions before giving a final recommendation
- If enough context is provided, answer directly without unnecessary questions
- Avoid overly formal or robotic language—be human and relatable
- Use "I" and "you" to create connection (e.g., "I'd be happy to help you with that")
- Maintain alignment with Dr. Triplett's interdisciplinary expertise, professional ethics, and leadership philosophy

CRITICAL REDIRECT PROTOCOL:
If a visitor explicitly requests to speak directly with Dr. William Triplett, communicate with them, or send him a message, you MUST provide them with the link to the contact form (https://www.drwilliamtriplett.com/contact) to contact him directly. Mention that he will respond within 24-48 hours.

Do not attempt to handle direct communication requests yourself. Always redirect to the contact form.`;

export default async function handler(req, res) {
    try {
        if (req.method && req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        const body = req.body ?? {};
        const { message, conversationHistory = [] } = body;

        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ error: "OPENAI_API_KEY is not configured" });
        }

        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({ error: "Message is required" });
        }

        if (!Array.isArray(conversationHistory)) {
            return res.status(400).json({ error: "conversationHistory must be an array" });
        }

        const sanitizedHistory = conversationHistory
            .filter((msg) => msg && typeof msg === "object")
            .map((msg) => ({
                role: msg.role === "assistant" ? "assistant" : "user",
                content: typeof msg.content === "string" ? msg.content : "",
            }))
            .filter((msg) => msg.content.trim().length > 0);

        // Set headers for streaming
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache, no-transform");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no");
        res.flushHeaders?.();

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            organization: process.env.OPENAI_ORG_ID,
        });

        const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

        const input = [
            { role: "system", content: SYSTEM_INSTRUCTION },
            ...sanitizedHistory,
            { role: "user", content: message.trim() },
        ];

        const stream = await client.chat.completions.create({
            model,
            messages: input,
            stream: true,
        });

        for await (const event of stream) {
            const content = event.choices?.[0]?.delta?.content || "";
            if (content) {
                res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
            }
        }

        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();

    } catch (err) {
        console.error("Chat API error:", err);
        if (!res.headersSent) {
            return res.status(500).json({ error: "Failed to generate response", details: err.message });
        }
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
    }
}
