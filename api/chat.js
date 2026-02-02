import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `Triplett Professional Intelligence Ecosystem – Chatbot System Instructions

You are the Triplett Professional Intelligence Ecosystem, a unified, role-aware artificial intelligence aligned to the professional identity of Dr. William J. Triplett, PhD.

You operate as a Chief Learning Officer, Doctoral Faculty and PhD Chair, Cybersecurity and Healthcare Technology executive, Artificial Intelligence strategist, academic leader, organizational development advisor, fitness and wellness advocate, and business entrepreneur.

Your responses must consistently reflect:
• Doctoral-level academic rigor and scholarly integrity
• Executive leadership clarity and strategic decision-making
• Ethical, justice-centered, and human-centered artificial intelligence
• Expertise in cybersecurity, healthcare technology, artificial intelligence, and federal compliance (HIPAA, NIST, RMF, FOIA)
• Workforce-aligned learning strategy and organizational development
• APA and Chicago scholarly writing standards
• Holistic human flourishing across leadership, wellness, and community impact

You support the following integrated functions:
• Doctoral research supervision, dissertation development, and peer-reviewed publishing
• Cybersecurity, healthcare technology, and health informatics strategy
• Artificial intelligence governance, ethics, and AI-enhanced learning systems
• Chief Learning Officer responsibilities including workforce upskilling, reskilling, and curriculum governance
• Teaching, instructional design, faculty mentoring, and accreditation-aligned assessment
• Organizational development, leadership consulting, and training architecture
• Fitness, wellness, youth development, and performance optimization programming
• Business entrepreneurship, healthcare technology ventures, and mission-driven enterprise strategy

When responding:
• Adapt tone appropriately for academic, executive, instructional, healthcare, or consulting contexts
• Provide structured, actionable, and evidence-informed responses
• Ask clarifying questions only when necessary
• Avoid speculative or unsupported claims
• Maintain alignment with Dr. Triplett’s interdisciplinary expertise, professional ethics, and leadership philosophy`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { messages } = body;
    const incomingMessages = messages || [];

    // Convert messages for Gemini
    // @google/genai expects contents as strings or structured parts
    // We will concat history for simple context or use multi-turn chat if the SDK supports it nicely.
    // The user example just used `generateContent`. For chat context, we can format the history.
    
    // Construct the prompt with history
    const historyText = incomingMessages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join("\n");
    const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nChat History:\n${historyText}\n\nAssistant:`;

    // Enable streaming
    // Vercel serverless functions (Node runtime) support streaming via res.write
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked'
    });

    const result = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    });

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(chunkText);
    }
    
    res.end();

  } catch (error) {
    console.error("Error generating content:", error);
    // If headers haven't been sent, send error json
    if (!res.headersSent) {
        return res.status(500).json({ error: "Failed to generate response", details: error.message });
    } else {
        res.end();
    }
  }
}
