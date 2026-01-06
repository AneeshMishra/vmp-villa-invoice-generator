# VMP Villa Home Stay - Setup Guide

## Quick Start

Follow these steps to get your GST invoice generator up and running:

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React and React DOM
- TypeScript
- Tailwind CSS
- jsPDF and html2canvas for PDF generation
- date-fns for date formatting
- And other development dependencies

### 2. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Project Structure

```
d:\VMP webSite/
├── public/                   # Static assets
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── VMPLogo.tsx          # VMP Villa logo SVG component
│   │   └── invoice/
│   │       ├── InvoiceGenerator.tsx  # Main invoice form and preview
│   │       └── PDFExport.tsx         # PDF generation utilities
│   ├── pages/
│   │   └── InvoicePage.tsx          # Invoice page component
│   ├── types/
│   │   └── invoice.types.ts         # TypeScript interfaces
│   ├── utils/
│   │   └── numberToWords.ts         # Utility functions
│   ├── App.tsx                      # Main app component with routing
│   ├── main.tsx                     # App entry point
│   └── index.css                    # Global styles with Tailwind
├── index.html                       # HTML template
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite build configuration
├── tailwind.config.js               # Tailwind CSS configuration
└── README.md                        # Documentation

```

## How to Use the Invoice Generator

### Step 1: Navigate to Invoice Page
- Open the application in your browser
- Click on "Create Invoice" button in the navigation

### Step 2: Fill Invoice Information
1. **Invoice Number**: Auto-generated (format: VMP-DDMMYYYY-XXXX)
2. **Invoice Date**: Current date/time (editable)
3. **Check-in Time**: Set your customer's check-in date/time
4. **Check-out Time**: Set your customer's check-out date/time

### Step 3: Enter Customer Details
- Customer Name
- Company Name (optional)
- Complete Address
- City
- State (select from dropdown)
- Pincode
- Contact Number
- GSTIN (optional - for registered businesses)

### Step 4: Add Items
For each item/service:
1. **Item Name**: e.g., "Single Room", "Breakfast", "Dinner"
2. **HSN Code**:
   - 996311 for Room Accommodation
   - 996331 for Food Services
3. **Quantity**: Number of units
4. **Price/Unit**: Price per unit in ₹
5. **GST Rate**: Select 0%, 5%, 12%, or 18%

Click "Add Item" after filling each item.

### Step 5: Enter Payment
- **Amount Received**: Enter the payment received
- Balance will be calculated automatically

### Step 6: Export Invoice
Three export options:
1. **Download PDF (High Quality)**: Best for official records
2. **Download PDF (Fast)**: Quicker generation for internal use
3. **Print**: Direct print to printer

## GST Calculation Rules

### Intrastate Transactions (Same State)
When customer state = Uttar Pradesh:
- Total GST split equally into CGST and SGST
- Example: 12% GST = 6% CGST + 6% SGST

### Interstate Transactions (Different State)
When customer state ≠ Uttar Pradesh:
- Total GST charged as IGST
- Example: 12% GST = 12% IGST

### HSN Codes and Rates

**Room Accommodation (HSN: 996311)**
- Declared Tariff < ₹7,500: 0% GST
- Declared Tariff ₹7,500 - ₹10,000: 12% GST
- Declared Tariff > ₹10,000: 18% GST

**Food Services (HSN: 996331)**
- Restaurant services: 5% GST

## Customization

### Update Company Logo
Edit `src/components/common/VMPLogo.tsx` to customize the logo SVG.

### Change Company Details
Edit `src/types/invoice.types.ts`:
```typescript
export const VMP_VILLA_DETAILS: CompanyDetails = {
  name: 'Your Company Name',
  address: 'Your Address',
  phone: 'Your Phone',
  email: 'Your Email',
  gstin: 'Your GSTIN',
  state: 'Your State',
  stateCode: 'Your State Code',
};
```

### Modify Invoice Layout
Edit `src/components/invoice/InvoiceGenerator.tsx` - specifically the `InvoicePreview` component.

## Troubleshooting

### PDFs not generating
- Check browser console for errors
- Ensure all required dependencies are installed
- Try the "Fast" PDF option if "High Quality" fails

### Styling issues
- Clear browser cache
- Rebuild Tailwind: `npm run build`
- Check that Tailwind config is correct

### TypeScript errors
- Run: `npm run build` to see all errors
- Check path aliases in `tsconfig.json`

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Format code
npm run format
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Need Help?

Contact: support@vmpvilla.in

---

**VMP Villa Home Stay**
Your home, away from home 🏡
