import { put } from '@vercel/blob';
import { validateOrigin } from '../_utils/security';
import { checkAdminAuth } from './auth';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: any, res: any) {
    if (!validateOrigin(req, res)) return;

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    if (!checkAdminAuth(req)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const file = req.body; // In a real browser, this would be a multipart/form-data or binary
        const filename = req.headers['x-filename'] || 'upload-' + Date.now();
        const contentType = req.headers['content-type'] || 'application/octet-stream';

        if (!file) {
            return res.status(400).json({ error: "No file provided" });
        }

        const { url } = await put(`resources/${filename}`, file, {
            access: 'public',
            contentType: contentType,
        });

        return res.status(200).json({ url });
    } catch (error: any) {
        console.error("Upload error:", error);
        return res.status(500).json({ error: "Upload failed", details: error.message });
    }
}
