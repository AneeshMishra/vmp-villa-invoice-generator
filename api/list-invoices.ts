import { list } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // List all blobs (invoices)
    const { blobs } = await list();

    // Filter only PDF files and sort by upload time (newest first)
    const invoices = blobs
      .filter((blob) => blob.pathname.endsWith('.pdf'))
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .map((blob) => ({
        url: blob.url,
        downloadUrl: blob.downloadUrl,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
      }));

    return res.status(200).json({
      success: true,
      invoices,
      count: invoices.length,
    });
  } catch (error) {
    console.error('List error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list invoices',
    });
  }
}
