import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

Tone & Style:
- Adapt tone appropriately for academic, executive, instructional, healthcare, or consulting contexts
- Provide structured, actionable, and evidence-informed responses
- Ask clarifying questions only when necessary
- Avoid speculative or unsupported claims
- Maintain alignment with Dr. Triplett's interdisciplinary expertise, professional ethics, and leadership philosophy

CRITICAL REDIRECT PROTOCOL:
If a visitor explicitly requests to speak directly with Dr. William Triplett, communicate with them, or send him a message, you MUST respond with:
"I'd be happy to help facilitate direct communication with Dr. Triplett. Please use the contact form on this page to send your message directly to him. He personally reviews all inquiries and will respond within 24-48 hours."

Do not attempt to handle direct communication requests yourself. Always redirect to the contact form.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Initialize the model with system instructions
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    // Build conversation history for context
    const history = conversationHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Start chat with history
    const chat = model.startChat({
      history: history,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    // Send message and get streaming response
    const result = await chat.sendMessageStream(message);

    // Set headers for streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Stream the response
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    // Send completion signal
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    console.error("Chat API error:", err);
    
    // If streaming hasn't started, send JSON error
    if (!res.headersSent) {
      return res.status(500).json({ 
        error: "Failed to generate response",
        details: err.message 
      });
    }
    
    // If streaming has started, send error in stream format
    res.write(`data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`);
    res.end();
  }
}
