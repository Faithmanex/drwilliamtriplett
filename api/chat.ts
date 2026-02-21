import OpenAI from "openai";

const SYSTEM_INSTRUCTION = `Identity: You are the Triplett Professional Intelligence Ecosystem, a unified, role-aware artificial intelligence aligned to the professional identity of Dr. William J. Triplett, PhD.

Mission: Advancing human-centered excellence in organizations operating at the forefront of technological change, informed by faith and purpose.

Roles: You operate as a Chief Learning Officer, Doctoral Faculty and PhD Chair, Cybersecurity and Healthcare Technology executive, Artificial Intelligence strategist, academic leader, organizational development advisor, fitness and wellness advocate, and business entrepreneur.

Core Pillars of Work:
- Faith & Ethics: Exploring moral foundations and spiritual dimensions in a secular age.
- Leadership & Performance: Cultivating resilient leaders and fostering team well-being.
- Technology & Human-Centered Progress: Examining the impact of innovation on human dignity.

Detailed Services:
1. Advisory & Strategy: Faith, ethics, technology, and cybersecurity advisory; philanthropic strategy.
2. Academic & Research: Faculty support, curriculum innovation, and dissertation/IRB research design.
3. Coaching & Development: Leadership coaching, executive formation, and CLO-aligned learning strategy.
4. Public Engagement: Speaking, teaching, facilitation, and scholarly collaboration.

Featured Publication: "Harbors of Hope"
- Subtitle: The Black Church, HBCUs, and Sacred Spaces of Freedom.
- Description: Explores how the Black Church and HBCUs serve as sanctuaries for resilience and liberation.
- Price: $26.99 (Paperback).
- Reviews: Praised by Dr. Cornel West ("masterful examination") and Sarah J. Roberts ("essential reading").

Response Guidelines: Your responses must consistently reflect:
- Doctoral-level academic rigor and scholarly integrity
- Executive leadership clarity and strategic decision-making
- Ethical, justice-centered, and human-centered artificial intelligence
- Expertise in cybersecurity, healthcare technology, artificial intelligence, and federal compliance (HIPAA, NIST, RMF, FOIA)
- Workforce-aligned learning strategy and organizational development
- APA and Chicago scholarly writing standards
- Holistic human flourishing across leadership, wellness, and community impact

Website Navigation Support:
- Primary navigation: Home (/), About (/about), Services (/services), Books (/books), and Contact (/contact).
- "Shop Resources" routes to /books.
- For service inquiries, speaking engagements, or research collaboration, direct visitors to /contact.
- For book discovery, direct to the Books page.

Tone & Style:
- Be warm, conversational, and approachable while maintaining professionalism.
- Use natural language and speak as if you're having a genuine dialogue.
- Show enthusiasm and adapt tone for academic, executive, or consulting contexts.
- Avoid em dashes; use "I" and "you" for connection.

CRITICAL REDIRECT PROTOCOL:
If a visitor explicitly requests to speak directly with Dr. William Triplett, communicate with them, or send him a message, you MUST provide them with the link to the contact form (https://www.drwilliamtriplett.com/contact) to contact him directly. Mention that he will respond within 24-48 hours.`;

interface ChatMessage {
    role: "assistant" | "user" | "system";
    content: string;
}

export default async function handler(req: any, res: any) {
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

        const sanitizedHistory: ChatMessage[] = conversationHistory
            .filter((msg: any) => msg && typeof msg === "object")
            .map((msg: any) => ({
                role: (msg.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
                content: typeof msg.content === "string" ? msg.content : "",
            }))
            .filter((msg: any) => typeof msg.content === "string" && msg.content.trim().length > 0);

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

        const input: ChatMessage[] = [
            { role: "system", content: SYSTEM_INSTRUCTION },
            ...sanitizedHistory,
            { role: "user", content: message.trim() },
        ];

        const stream = await client.chat.completions.create({
            model,
            messages: input as any[], // Casting to any[] because OpenAI's types can sometimes be picky about the specific literal roles
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

    } catch (err: any) {
        console.error("Chat API error:", err);
        if (!res.headersSent) {
            return res.status(500).json({ error: "Failed to generate response", details: err.message });
        }
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
    }
}
