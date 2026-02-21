const ALLOWED_ORIGINS = [
  "https://drwilliamtriplett.com",
  "https://www.drwilliamtriplett.com",
  "https://dr-william-triplett.vercel.app", // Vercel preview/default domain
  "http://localhost:5173",
  "http://localhost:3000",
];

export function validateOrigin(req: any, res: any): boolean {
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // Set CORS headers
  let requestOrigin = origin;
  if (!requestOrigin && referer) {
    try {
      requestOrigin = new URL(referer).origin;
    } catch (e) {
      requestOrigin = null;
    }
  }
  
  if (requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-filename");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return false;
  }

  // For GET requests like downloads, they might be triggered by direct links in emails
  // In those cases, 'origin' is absent and 'referer' might be an email client or empty.
  // We allow requests with no origin/referer for GET only IF we want to support direct email links.
  if (req.method === "GET" && !origin && !referer) {
      return true; 
  }

  // Validate that the request comes from an allowed origin
  const isAllowed = ALLOWED_ORIGINS.some(allowed => 
    (origin && origin === allowed) || 
    (referer && referer.startsWith(allowed))
  );

  if (!isAllowed) {
    res.status(403).json({ error: "Access forbidden from this domain." });
    return false;
  }

  return true;
}
