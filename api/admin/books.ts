import { put, list } from '@vercel/blob';
import { validateOrigin } from '../_utils/security';
import { checkAdminAuth } from './auth';

const BOOKS_JSON_PATH = 'data/books.json';

export default async function handler(req: any, res: any) {
    if (!validateOrigin(req, res)) return;

    // GET: Fetch books from Blob
    if (req.method === "GET") {
        try {
            const { blobs } = await list({ prefix: BOOKS_JSON_PATH });
            if (blobs.length === 0) {
                // Fallback or empty if not found
                return res.status(200).json([]);
            }
            
            const response = await fetch(blobs[0].url);
            const books = await response.json();
            return res.status(200).json(books);
        } catch (error: any) {
            console.error("Error fetching books from blob:", error);
            return res.status(500).json({ error: "Failed to fetch books", details: error.message });
        }
    }

    // POST/PUT: Update books in Blob (Admin only)
    if (req.method === "POST" || req.method === "PUT") {
        if (!checkAdminAuth(req)) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            const books = req.body;
            if (!Array.isArray(books)) {
                return res.status(400).json({ error: "Invalid data format. Expected an array of books." });
            }

            const { url } = await put(BOOKS_JSON_PATH, JSON.stringify(books), {
                access: 'public',
                contentType: 'application/json',
                addRandomSuffix: false // We want a stable path for updates
            });

            return res.status(200).json({ success: true, url });
        } catch (error: any) {
            console.error("Error updating books blob:", error);
            return res.status(500).json({ error: "Failed to update books", details: error.message });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
