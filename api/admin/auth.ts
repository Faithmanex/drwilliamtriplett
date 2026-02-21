import { validateOrigin } from '../_utils/security';

export function checkAdminAuth(req: any): boolean {
    const authHeader = req.headers.authorization;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
        console.error("ADMIN_PASSWORD not set in environment");
        return false;
    }
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }
    
    const password = authHeader.substring(7);
    return password === adminPassword;
}

export default async function handler(req: any, res: any) {
    try {
        if (!validateOrigin(req, res)) return;
        
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }
        
        if (checkAdminAuth(req)) {
            return res.status(200).json({ authenticated: true });
        } else {
            return res.status(401).json({ authenticated: false, error: "Invalid password" });
        }
    } catch (error: any) {
        console.error("Auth handler error:", error);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
}
