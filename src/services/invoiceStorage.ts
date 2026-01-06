export interface StoredInvoice {
  url: string;
  downloadUrl: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

export interface UploadResponse {
  success: boolean;
  url?: string;
  downloadUrl?: string;
  pathname?: string;
  size?: number;
  error?: string;
}

export interface ListResponse {
  success: boolean;
  invoices?: StoredInvoice[];
  count?: number;
  error?: string;
}

/**
 * Upload a PDF invoice to Vercel Blob Storage
 */
export async function uploadInvoice(pdfBlob: Blob, filename?: string): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    const finalFilename = filename || `invoice-${Date.now()}.pdf`;
    formData.append('file', pdfBlob, finalFilename);

    const response = await fetch('/api/upload-invoice', {
      method: 'POST',
      body: pdfBlob,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    return data;
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Get list of all saved invoices from Vercel Blob Storage
 */
export async function listInvoices(): Promise<ListResponse> {
  try {
    const response = await fetch('/api/list-invoices', {
      method: 'GET',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to list invoices');
    }

    return data;
  } catch (error) {
    console.error('List error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list invoices',
    };
  }
}

/**
 * Download an invoice by opening it in a new tab
 */
export function downloadInvoice(url: string, filename?: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'invoice.pdf';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Get a user-friendly filename from the pathname
 */
export function getInvoiceDisplayName(pathname: string): string {
  // Extract just the filename from pathname
  const parts = pathname.split('/');
  const filename = parts[parts.length - 1];

  // Try to parse the date from the filename (format: invoice-YYYY-MM-DDTHH-MM-SS-mmmZ.pdf)
  const match = filename.match(/invoice-(\d{4})-(\d{2})-(\d{2})T(\d{2})-(\d{2})-(\d{2})/);

  if (match) {
    const [, year, month, day, hour, minute, second] = match;
    const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
    return `Invoice - ${date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  }

  return filename.replace('.pdf', '');
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
