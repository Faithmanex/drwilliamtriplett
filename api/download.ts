import { head } from '@vercel/blob';
import { booksCatalog } from '../data/books.js';
import { validateOrigin } from './_utils/security.js';

export default async function handler(req: any, res: any) {
  if (!validateOrigin(req, res)) return;

  const { file } = req.query;

  // Find book in the central catalog
  const book = booksCatalog.find(b => b.id === file);
  const url = book?.blobUrl;

  if (!url) {
    return res.status(404).json({ error: "File not found" });
  }

  try {
    // Optionally use @vercel/blob head to verify existence/metadata
    // This also validates the BLOB_READ_WRITE_TOKEN
    await head(url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blob: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "application/pdf";
    const filename = url.split('/').pop()?.split('?')[0] || "document.pdf";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    return res.status(200).send(buffer);
  } catch (error) {
    console.error("Download error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
