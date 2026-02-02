import { GoogleGenAI, GoogleGenerativeAIError } from "@google/genai";

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
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] Request received`);

  if (req.method !== "POST") {
    console.warn(`[${requestId}] Method ${req.method} not allowed`);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error(`[${requestId}] Configuration Error: GEMINI_API_KEY is missing`);
    return res.status(500).json({ error: "Server Configuration Error" });
  }

  let incomingMessages = [];
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    incomingMessages = body.messages || [];
    console.log(`[${requestId}] Processing ${incomingMessages.length} messages`);
  } catch (e) {
    console.error(`[${requestId}] Failed to parse request body:`, e);
    return res.status(400).json({ error: "Invalid Request Body" });
  }

  if (incomingMessages.length === 0) {
     console.warn(`[${requestId}] Request contained zero messages`);
     return res.status(400).json({ error: "No messages provided" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Construct the prompt with history
    const historyText = incomingMessages.map(m => {
        const roleLabel = m.role === 'user' ? 'User' : 'Assistant';
        // Sanitize content slightly to avoid confusion if necessary, though usually fine
        return `${roleLabel}: ${m.content}`;
    }).join("\n");
    
    const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nChat History:\n${historyText}\n\nAssistant:`;

    console.log(`[${requestId}] Starting stream generation with model gemini-2.5-flash`);

    // Enable streaming
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
    
    console.log(`[${requestId}] Stream completed successfully`);
    res.end();

  } catch (error) {
    console.error(`[${requestId}] Upstream API Error:`, error);
    
    const errorMessage = error instanceof GoogleGenerativeAIError 
        ? `Gemini API Error: ${error.message}` 
        : `Internal Error: ${error.message}`;

    // If headers haven't been sent, send error json
    if (!res.headersSent) {
        return res.status(502).json({ error: "Failed to generate response", details: errorMessage });
    } else {
        // If stream already started, we can't send JSON. 
        // We might send a special token or just end, but usually logging on server is what matters most here.
        // We can append a visible error message to the stream if appropriate.
        console.warn(`[${requestId}] Stream interrupted. Ending response.`);
        
        // Optionally send a final chunk indicating error if client can parse it, 
        // but for now we just end to stop the client waiting.
        res.end();
    }
  }
}
