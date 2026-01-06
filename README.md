# VMP Villa Home Stay - GST Invoice Generator

Professional GST invoice generation system for VMP Villa Home Stay with PDF export functionality.

🌐 **[Live Demo](https://vmp-villa-invoice-generator.vercel.app)** (Replace with your actual URL after deployment)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/vmp-villa-invoice-generator)

## Features

- **Professional Invoice Layout**: Matches your existing bill format exactly
- **GST Compliance**: Automatic GST calculations (CGST/SGST for intrastate, IGST for interstate)
- **VMP Villa Logo**: Custom SVG logo integrated into invoices
- **PDF Export**:
  - High-quality PDF generation using html2canvas
  - Fast programmatic PDF generation using jsPDF
  - Print functionality
- **Real-time Calculations**: Automatic calculation of totals, GST, and balance
- **Number to Words**: Converts invoice amount to Indian currency words
- **Customer Management**: Complete customer details including GSTIN
- **Item Management**: Add multiple items with different GST rates
- **HSN Code Support**: Pre-configured HSN codes for accommodation and food services
- **Responsive Design**: Works on all devices

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Usage

### Creating an Invoice

1. Navigate to the Invoice page
2. Fill in invoice details (invoice number, dates, check-in/out times)
3. Enter customer details (name, address, GSTIN, etc.)
4. Add items:
   - Item name (e.g., Single Room, Breakfast, Dinner)
   - HSN Code (996311 for rooms, 996331 for food)
   - Quantity
   - Price per unit
   - GST rate (0%, 5%, 12%, 18%)
5. Enter amount received
6. Preview the invoice in real-time
7. Export as PDF or print

### PDF Export Options

- **Download PDF (High Quality)**: Converts the HTML invoice to high-resolution PDF
- **Download PDF (Fast)**: Generates PDF programmatically for faster processing
- **Print**: Opens print dialog with PDF preview

## GST Configuration

### Current GST Rates
- **Room Accommodation (HSN: 996311)**:
  - Below ₹7,500: 0% GST
  - ₹7,500 - ₹10,000: 12% GST
  - Above ₹10,000: 18% GST
- **Food Services (HSN: 996331)**: 5% GST

### Interstate vs Intrastate
- **Intrastate** (Same state): CGST + SGST (split equally)
- **Interstate** (Different state): IGST (full amount)

## Company Details

**VMP Villa Home Stay**
- Address: A-73, KPS Town, Baroli Ahir, Shamsabad Road, Agra, UP. 283125
- Phone: 9258555345
- Email: support@vmpvilla.in
- GSTIN: 09CAFPB2385C1Z1
- State: Uttar Pradesh

## File Structure

```
src/
├── components/
│   ├── common/
│   │   └── VMPLogo.tsx          # VMP Villa logo component
│   └── invoice/
│       ├── InvoiceGenerator.tsx # Main invoice form and preview
│       └── PDFExport.tsx        # PDF generation utilities
├── pages/
│   └── InvoicePage.tsx          # Invoice page
├── types/
│   └── invoice.types.ts         # TypeScript interfaces
└── utils/
    └── numberToWords.ts         # Number to words conversion
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **jsPDF** - PDF generation
- **html2canvas** - HTML to canvas conversion
- **date-fns** - Date formatting
- **Vite** - Build tool
- **Vercel** - Deployment platform

## 🚀 Deployment

This app is configured for **zero-configuration deployment** on Vercel.

### Quick Deploy (5 minutes)

See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for the fastest deployment guide.

### Detailed Guide

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete step-by-step instructions.

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/vmp-villa-invoice-generator)

**Cost**: $0/month for low traffic (5 times/month = FREE forever)

## Customization

### Changing Company Details
Edit `src/types/invoice.types.ts`:
```typescript
export const VMP_VILLA_DETAILS: CompanyDetails = {
  name: 'Your Company Name',
  address: 'Your Address',
  // ... other details
};
```

### Modifying Invoice Layout
Edit `src/components/invoice/InvoiceGenerator.tsx` - InvoicePreview component

### Adding Custom HSN Codes
Edit `src/types/invoice.types.ts`:
```typescript
export const HSN_CODES = {
  ROOM_ACCOMMODATION: '996311',
  FOOD_SERVICES: '996331',
  YOUR_CUSTOM_SERVICE: '999999',
};
```

## Development

### Running Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

## Support

For issues or questions, contact: support@vmpvilla.in

## License

Proprietary - VMP Villa Home Stay
