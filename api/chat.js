import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are the Triplett Professional Intelligence Ecosystem, a unified, role-aware artificial intelligence aligned to the professional identity of Dr. William J. Triplett, PhD.

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

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, history } = req.body;

    // Convert frontend history to SDK format if needed, or just append new message
    // The SDK v2 can take a simple string or an array of contents.
    // We'll assume 'history' is an array of { role: 'user' | 'model', parts: [{ text: ... }] }
    
    // Construct the contents for the API
    // We prepend the system instruction behavior by sending it as a system instruction config if supported, 
    // or we can't easily do "system" role in standard generateContent without config.
    // SDK v2 'models.generateContent' has a 'config' param where we can pass systemInstruction.
    
    // Map history to the format expected by the SDK user/model
    // The frontend should send: [{ role: 'user', content: '...' }, { role: 'assistant', content: '...' }]
    // We map 'assistant' -> 'model'
    
    const contents = (history || []).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Add the current new message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Set up the stream
    const result = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        }
      }
    });

    // Set headers for SSE (Server-Sent Events) or just raw stream
    // Using simple streaming response here
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache, no-transform'
    });

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        res.write(chunkText);
      }
    }

    res.end();

  } catch (error) {
    console.error("Gemini API Error:", error);
    // If headers sent, we can't send JSON error, so check
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate response" });
    } else {
      res.end();
    }
  }
}
