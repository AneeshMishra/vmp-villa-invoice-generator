# Vercel Blob Storage Integration

Complete guide for the invoice cloud storage feature using Vercel Blob Storage.

---

## 🎯 What It Does

Your VMP Villa Invoice Generator now includes **cloud storage** functionality:

- ✅ **Save invoices** to Vercel Blob Storage with one click
- ✅ **View all saved invoices** in a searchable list
- ✅ **Download invoices** anytime from the cloud
- ✅ **FREE storage** - 1 GB free tier (enough for 5,000+ invoices!)
- ✅ **Automatic deployment** - No manual configuration needed

---

## 🚀 How It Works

### On Vercel (Production)

When you deploy to Vercel, **everything works automatically**:

1. Vercel automatically creates a Blob Storage for your project
2. Environment variable `BLOB_READ_WRITE_TOKEN` is injected automatically
3. Your app can immediately save and retrieve invoices
4. **No setup required!** 🎉

### API Routes

The app uses serverless API routes to interact with Vercel Blob:

#### 1. `/api/upload-invoice` (POST)
- Uploads a PDF invoice to Vercel Blob Storage
- Returns the URL where the invoice is stored

#### 2. `/api/list-invoices` (GET)
- Lists all saved invoices
- Returns metadata (filename, size, upload date, URL)

---

## 📁 File Structure

```
d:\VMP webSite\
├── api/
│   ├── upload-invoice.ts       # API route to upload PDFs
│   └── list-invoices.ts        # API route to list saved PDFs
├── src/
│   ├── services/
│   │   └── invoiceStorage.ts   # Service layer for storage operations
│   ├── components/
│   │   └── invoice/
│   │       ├── InvoiceGenerator.tsx  # Upload button added
│   │       └── SavedInvoices.tsx     # Component to view saved invoices
│   └── pages/
│       └── InvoicePage.tsx     # Main page with SavedInvoices component
└── .env.example                # Documentation for environment variables
```

---

## 🎨 Features

### 1. Save to Cloud Button

After generating an invoice, click **"Save to Cloud"** to:
- Generate the PDF
- Upload to Vercel Blob Storage
- Show success message with link to view

### 2. Saved Invoices List

Below the invoice generator, you'll see:
- **All saved invoices** with metadata
- **View** button to open in new tab
- **Download** button to save locally
- **Refresh** button to reload the list
- Responsive table showing:
  - Invoice name (auto-formatted from timestamp)
  - File size
  - Upload date/time
  - Action buttons

---

## 💰 Pricing

### Free Tier (Hobby Plan)
- ✅ **1 GB storage** - enough for ~5,000 invoices
- ✅ **10 GB bandwidth/month** - plenty for low traffic
- ✅ **Unlimited** read/write operations
- ✅ **FREE FOREVER** for your use case (5 invoices/month)

### Estimated Storage
- Each invoice PDF: ~150-200 KB
- Your usage: 5 invoices/month = ~1 MB/month
- Free tier supports: 1,000 MB = 1,000 invoices/month
- **You'll never hit the limit!** ✅

---

## 🔧 Local Development

### Option 1: Mock Storage (Recommended for Testing UI)

The app will work locally, but uploads will fail without a token. This is fine for:
- Testing the UI
- Developing features
- Building the PDF generation

### Option 2: Use Vercel Blob Locally

To test cloud storage locally:

1. **Deploy to Vercel first** (one-time setup)
2. Get your token from Vercel Dashboard:
   - Go to: [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to: **Settings** → **Environment Variables**
   - Copy `BLOB_READ_WRITE_TOKEN` value
3. Create `.env.local` file:
   ```bash
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXXXXXXXX
   ```
4. Restart dev server:
   ```bash
   npm run dev
   ```

---

## 🐛 Troubleshooting

### Upload Fails in Production

**Check these:**

1. Vercel Blob is enabled:
   - Go to: Vercel Dashboard → Your Project → Storage
   - Ensure Blob Storage is created

2. Environment variable exists:
   - Go to: Settings → Environment Variables
   - Confirm `BLOB_READ_WRITE_TOKEN` exists

3. Redeploy if needed:
   ```bash
   git push
   ```

### List Shows Empty

**Possible reasons:**

1. No invoices uploaded yet ✅ (normal)
2. API route failing - check Vercel logs:
   - Go to: Vercel Dashboard → Your Project → Deployments
   - Click on latest deployment → Functions tab
   - Check `/api/list-invoices` logs

### File Size Too Large

**Vercel limits:**
- Serverless function: 4.5 MB max payload
- Your invoices: ~150-200 KB each ✅

If you generate a very large invoice (unlikely):
- Reduce image quality in PDF settings
- Or split into multiple pages

---

## 📊 Monitoring

### View Storage Usage

1. Go to: [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to: **Storage** tab
4. See:
   - Total storage used
   - Bandwidth consumed
   - Number of files

### View Logs

Check API errors:
1. Go to: **Deployments** → Select deployment
2. Click: **Functions** tab
3. Find: `/api/upload-invoice` or `/api/list-invoices`
4. View: Request logs and errors

---

## 🔒 Security

### Public Access

- ✅ Invoices are stored with `access: 'public'`
- ✅ Anyone with the URL can view/download
- ✅ URL is long and random - hard to guess
- ⚠️ **Not suitable for sensitive data** (bank details, passwords)

### For Private Invoices (Future Enhancement)

If you need private storage:

1. Change `api/upload-invoice.ts`:
   ```typescript
   const blob = await put(filename, buffer, {
     access: 'public', // Change to 'private'
     contentType: 'application/pdf',
   });
   ```

2. Generate signed URLs for downloads
3. Add authentication before accessing

---

## 🚀 Deployment Checklist

After deploying with Blob Storage:

- [ ] App deploys successfully to Vercel
- [ ] Can generate invoices (existing feature)
- [ ] "Save to Cloud" button appears
- [ ] Can click and upload invoice
- [ ] Success message shows after upload
- [ ] Saved invoices list loads
- [ ] Can view saved invoices in new tab
- [ ] Can download saved invoices
- [ ] Refresh button works

---

## 📝 API Reference

### Upload Invoice

**Endpoint:** `POST /api/upload-invoice`

**Request:**
- Body: PDF file (binary)
- Content-Type: `application/pdf`

**Response:**
```json
{
  "success": true,
  "url": "https://xxxx.public.blob.vercel-storage.com/invoice-2024-01-06T12-30-00-000Z.pdf",
  "downloadUrl": "https://xxxx.public.blob.vercel-storage.com/invoice-2024-01-06T12-30-00-000Z.pdf",
  "pathname": "invoice-2024-01-06T12-30-00-000Z.pdf",
  "size": 152340
}
```

### List Invoices

**Endpoint:** `GET /api/list-invoices`

**Response:**
```json
{
  "success": true,
  "invoices": [
    {
      "url": "https://xxxx.public.blob.vercel-storage.com/invoice-2024-01-06T12-30-00-000Z.pdf",
      "downloadUrl": "https://xxxx.public.blob.vercel-storage.com/invoice-2024-01-06T12-30-00-000Z.pdf",
      "pathname": "invoice-2024-01-06T12-30-00-000Z.pdf",
      "size": 152340,
      "uploadedAt": "2024-01-06T12:30:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 🎓 Learn More

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Blob Pricing](https://vercel.com/docs/storage/vercel-blob/usage-and-pricing)
- [Vercel Blob SDK](https://vercel.com/docs/storage/vercel-blob/using-blob-sdk)

---

## ✅ Summary

You now have a complete invoice storage system:

1. **Generate** invoices with the form
2. **Save** to cloud with one click
3. **View** all saved invoices
4. **Download** anytime, anywhere
5. **FREE** - No costs for your usage

**Total cost:** $0.00/month ✅

---

For support: support@vmpvilla.in
