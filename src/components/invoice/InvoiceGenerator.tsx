import React, { useState, useRef } from 'react';
import { InvoiceData, InvoiceItem, CustomerDetails, VMP_VILLA_DETAILS, STATE_CODES } from '../../types/invoice.types';
import { VMPLogo } from '@components/common/VMPLogo';
import { numberToWords, calculateGST } from '../../utils/numberToWords';
import { format } from 'date-fns';
import { InvoicePDFGenerator } from './PDFExport';
import { uploadInvoice } from '../../services/invoiceStorage';

interface InvoiceGeneratorProps {
  initialData?: Partial<InvoiceData>;
}

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ initialData }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNo: initialData?.invoiceNo || generateInvoiceNumber(),
    invoiceDate: initialData?.invoiceDate || new Date(),
    checkInTime: initialData?.checkInTime || new Date(),
    checkOutTime: initialData?.checkOutTime || new Date(),
    customer: initialData?.customer || {
      name: '',
      companyName: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      contactNo: '',
      gstin: '',
    },
    items: initialData?.items || [],
    subTotal: 0,
    sgst: 0,
    cgst: 0,
    igst: 0,
    total: 0,
    amountReceived: 0,
    balance: 0,
    paymentType: initialData?.paymentType || 'Cash',
    termsAndConditions: '',
  });

  const [newItem, setNewItem] = useState<Partial<InvoiceItem>>({
    itemName: '',
    hsnCode: '996311',
    quantity: 1,
    pricePerUnit: 0,
    gstRate: 5,
  });

  // Generate invoice number based on date
  function generateInvoiceNumber(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `VMP-${day}${month}${year}-${random}`;
  }

  // Calculate item amount with GST
  const calculateItemAmount = (item: Partial<InvoiceItem>): number => {
    if (!item.quantity || !item.pricePerUnit || !item.gstRate) return 0;
    const baseAmount = item.quantity * item.pricePerUnit;
    const gstAmount = (baseAmount * item.gstRate) / 100;
    return baseAmount + gstAmount;
  };

  // Add item to invoice
  const addItem = () => {
    if (!newItem.itemName || !newItem.pricePerUnit) {
      alert('Please fill in all item details');
      return;
    }

    const item: InvoiceItem = {
      id: Date.now().toString(),
      itemName: newItem.itemName!,
      hsnCode: newItem.hsnCode!,
      quantity: newItem.quantity!,
      pricePerUnit: newItem.pricePerUnit!,
      gstRate: newItem.gstRate!,
      amount: calculateItemAmount(newItem),
    };

    const updatedItems = [...invoiceData.items, item];
    updateInvoiceTotals(updatedItems);

    // Reset new item form
    setNewItem({
      itemName: '',
      hsnCode: '996311',
      quantity: 1,
      pricePerUnit: 0,
      gstRate: 5,
    });
  };

  // Remove item from invoice
  const removeItem = (id: string) => {
    const updatedItems = invoiceData.items.filter(item => item.id !== id);
    updateInvoiceTotals(updatedItems);
  };

  // Update invoice totals
  const updateInvoiceTotals = (items: InvoiceItem[]) => {
    const subTotal = items.reduce((sum, item) => {
      const baseAmount = item.quantity * item.pricePerUnit;
      return sum + baseAmount;
    }, 0);

    const isInterstate = invoiceData.customer.state !== VMP_VILLA_DETAILS.state;

    let totalGST = 0;
    let sgst = 0;
    let cgst = 0;
    let igst = 0;

    items.forEach(item => {
      const baseAmount = item.quantity * item.pricePerUnit;
      const gst = calculateGST(baseAmount, item.gstRate, isInterstate);
      totalGST += gst.total;

      if (isInterstate) {
        igst += gst.igst;
      } else {
        sgst += gst.sgst;
        cgst += gst.cgst;
      }
    });

    const total = subTotal + totalGST;
    const balance = total - invoiceData.amountReceived;

    setInvoiceData(prev => ({
      ...prev,
      items,
      subTotal,
      sgst,
      cgst,
      igst,
      total,
      balance,
    }));
  };

  // Update customer details
  const updateCustomer = (field: keyof CustomerDetails, value: string) => {
    const updatedCustomer = { ...invoiceData.customer, [field]: value };
    setInvoiceData(prev => ({ ...prev, customer: updatedCustomer }));

    // Recalculate GST if state changes
    if (field === 'state') {
      updateInvoiceTotals(invoiceData.items);
    }
  };

  // Update amount received
  const updateAmountReceived = (amount: number) => {
    const balance = invoiceData.total - amount;
    setInvoiceData(prev => ({ ...prev, amountReceived: amount, balance }));
  };

  const isInterstate = Boolean(
    invoiceData.customer.state &&
    invoiceData.customer.state !== VMP_VILLA_DETAILS.state
  );

  // PDF Export handlers
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    try {
      await InvoicePDFGenerator.generateFromHTML(invoiceRef.current, {
        filename: `Invoice-${invoiceData.invoiceNo}.pdf`,
        download: true,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleDownloadProgrammatic = () => {
    try {
      InvoicePDFGenerator.generateProgrammatically(invoiceData, {
        filename: `Invoice-${invoiceData.invoiceNo}.pdf`,
        download: true,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handlePrint = async () => {
    if (!invoiceRef.current) return;
    try {
      await InvoicePDFGenerator.print(invoiceRef.current);
    } catch (error) {
      console.error('Error printing:', error);
      alert('Failed to print. Please try again.');
    }
  };

  const handleSaveToCloud = async () => {
    setUploading(true);
    setUploadSuccess(false);
    setUploadedUrl('');

    try {
      // Generate PDF blob using the programmatic method
      const pdfResult = InvoicePDFGenerator.generateProgrammatically(invoiceData, {
        filename: `Invoice-${invoiceData.invoiceNo}.pdf`,
        download: false,
      });

      // Since download is false, it should return a Blob
      if (!(pdfResult instanceof Blob)) {
        throw new Error('Failed to generate PDF blob');
      }

      // Upload to Vercel Blob Storage
      const result = await uploadInvoice(pdfResult, `Invoice-${invoiceData.invoiceNo}.pdf`);

      if (result.success && result.url) {
        setUploadSuccess(true);
        setUploadedUrl(result.url);
        alert('Invoice saved to cloud successfully!');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error saving to cloud:', error);
      alert('Failed to save invoice to cloud. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="invoice-generator-container max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Input Form */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Invoice Details</h2>

          {/* Invoice Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Invoice Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={invoiceData.invoiceNo}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Invoice Date
                </label>
                <input
                  type="datetime-local"
                  value={format(invoiceData.invoiceDate, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceDate: new Date(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Check-in Time
                </label>
                <input
                  type="datetime-local"
                  value={format(invoiceData.checkInTime, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, checkInTime: new Date(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Check-out Time
                </label>
                <input
                  type="datetime-local"
                  value={format(invoiceData.checkOutTime, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, checkOutTime: new Date(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Customer Details</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Customer Name"
                value={invoiceData.customer.name}
                onChange={(e) => updateCustomer('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="Company Name (Optional)"
                value={invoiceData.customer.companyName || ''}
                onChange={(e) => updateCustomer('companyName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                placeholder="Address"
                value={invoiceData.customer.address}
                onChange={(e) => updateCustomer('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="City"
                value={invoiceData.customer.city}
                onChange={(e) => updateCustomer('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={invoiceData.customer.state}
                onChange={(e) => updateCustomer('state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select State</option>
                {Object.keys(STATE_CODES).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Pincode"
                value={invoiceData.customer.pincode}
                onChange={(e) => updateCustomer('pincode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="Contact Number"
                value={invoiceData.customer.contactNo}
                onChange={(e) => updateCustomer('contactNo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="GSTIN (Optional)"
                value={invoiceData.customer.gstin || ''}
                onChange={(e) => updateCustomer('gstin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Add Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Add Items</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  placeholder="Item Name"
                  value={newItem.itemName}
                  onChange={(e) => setNewItem(prev => ({ ...prev, itemName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  HSN Code
                </label>
                <select
                  value={newItem.hsnCode}
                  onChange={(e) => setNewItem(prev => ({ ...prev, hsnCode: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="996311">996311 - Room Accommodation</option>
                  <option value="996331">996331 - Food Services</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Price per Unit (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Price/Unit"
                    value={newItem.pricePerUnit}
                    onChange={(e) => setNewItem(prev => ({ ...prev, pricePerUnit: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  GST Rate
                </label>
                <select
                  value={newItem.gstRate}
                  onChange={(e) => setNewItem(prev => ({ ...prev, gstRate: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">0% GST</option>
                  <option value="5">5% GST</option>
                  <option value="12">12% GST</option>
                  <option value="18">18% GST</option>
                </select>
              </div>

              <button
                onClick={addItem}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Add Item
              </button>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Payment</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Payment Type
                </label>
                <select
                  value={invoiceData.paymentType}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, paymentType: e.target.value as 'Cash' | 'Online' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Amount Received
                </label>
                <input
                  type="number"
                  value={invoiceData.amountReceived}
                  onChange={(e) => updateAmountReceived(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Invoice Preview */}
        <div className="lg:col-span-2">
          <InvoicePreview
            invoiceData={invoiceData}
            removeItem={removeItem}
            isInterstate={isInterstate}
            ref={invoiceRef}
          />

          {/* Export Buttons */}
          {invoiceData.items.length > 0 && (
            <div className="mt-4 sm:mt-6 bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">Export Options</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Choose how you want to export your invoice:
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <button
                  onClick={handleDownloadPDF}
                  className="bg-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="truncate">Download PDF (High Quality)</span>
                </button>

                <button
                  onClick={handleDownloadProgrammatic}
                  className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="truncate">Download PDF (Fast)</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="bg-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  <span className="truncate">Print</span>
                </button>

                <button
                  onClick={handleSaveToCloud}
                  disabled={uploading}
                  className={`${
                    uploadSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-orange-600 hover:bg-orange-700'
                  } text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="truncate">Saving...</span>
                    </>
                  ) : uploadSuccess ? (
                    <>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="truncate">Saved to Cloud!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="truncate">Save to Cloud</span>
                    </>
                  )}
                </button>
              </div>

              {uploadSuccess && uploadedUrl && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 break-words">
                    <span className="font-semibold">Invoice saved!</span> Your invoice is now stored in the cloud.
                  </p>
                  <a
                    href={uploadedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 hover:text-green-800 underline break-all"
                  >
                    View saved invoice
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Invoice Preview Component
interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  removeItem: (id: string) => void;
  isInterstate: boolean;
}

const InvoicePreview = React.forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ invoiceData, removeItem, isInterstate }, ref) => {
    return (
      <div className="bg-white rounded-lg shadow-lg p-2 sm:p-4 md:p-8 overflow-x-auto" ref={ref}>
        {/* Header with Logo and Company Details */}
        <div className="border-2 sm:border-4 border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start p-3 sm:p-4 md:p-6 border-b-2 border-gray-800 gap-4">
            {/* Company Details */}
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg md:text-xl font-bold mb-2 break-words">{VMP_VILLA_DETAILS.name}</h1>
              <div className="text-xs sm:text-sm space-y-1">
                <p className="break-words"><span className="font-semibold">Address:</span> {VMP_VILLA_DETAILS.address}</p>
                <p className="break-words"><span className="font-semibold">Phone No:</span> {VMP_VILLA_DETAILS.phone}</p>
                <p><span className="font-semibold">Email ID:</span> {VMP_VILLA_DETAILS.email}</p>
                <p><span className="font-semibold">GSTIN:</span> {VMP_VILLA_DETAILS.gstin}</p>
                <p><span className="font-semibold">State:</span> {VMP_VILLA_DETAILS.state}</p>
              </div>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0">
              <VMPLogo size="small" className="sm:hidden" />
              <VMPLogo size="medium" className="hidden sm:block" />
            </div>
          </div>

          {/* Tax Invoice Title */}
          <div className="bg-pink-50 py-3 sm:py-4 text-center border-b-2 border-gray-800">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-600">Tax Invoice</h2>
          </div>

          {/* Customer and Invoice Details */}
          <div className="p-3 sm:p-4 md:p-6 border-b-2 border-gray-800">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              {/* Customer Details */}
              <div className="flex-1 min-w-0">
                <p className="mb-2 text-xs sm:text-sm break-words">
                  <span className="font-semibold">Bill To:</span> {invoiceData.customer.companyName || invoiceData.customer.name}
                </p>
                {invoiceData.customer.companyName && (
                  <p className="mb-2 text-xs sm:text-sm break-words"><span className="font-semibold">Name:</span> {invoiceData.customer.name}</p>
                )}
                <p className="text-xs sm:text-sm mb-2 break-words">
                  <span className="font-semibold">Address:</span> {invoiceData.customer.address}
                  {invoiceData.customer.city && `, ${invoiceData.customer.city}`}
                  {invoiceData.customer.state && `, ${invoiceData.customer.state}`}
                  {invoiceData.customer.pincode && `, ${invoiceData.customer.pincode}`}
                </p>
                <p className="text-xs sm:text-sm mb-1 break-words">
                  <span className="font-semibold">Contact No.:</span> {invoiceData.customer.contactNo}
                </p>
                {invoiceData.customer.gstin && (
                  <p className="text-xs sm:text-sm mb-1 break-words">
                    <span className="font-semibold">GSTIN No.:</span> {invoiceData.customer.gstin}
                  </p>
                )}
                {invoiceData.customer.state && (
                  <p className="text-xs sm:text-sm break-words">
                    <span className="font-semibold">State:</span> {invoiceData.customer.state}
                  </p>
                )}
              </div>

              {/* Invoice Info */}
              <div className="text-left md:text-right min-w-0">
                <p className="mb-2 text-xs sm:text-sm break-words">
                  <span className="font-semibold">Check-in Time:</span>{' '}
                  {format(invoiceData.checkInTime, 'dd/MM/yyyy hh:mm a')}
                </p>
                <p className="mb-2 text-xs sm:text-sm break-words">
                  <span className="font-semibold">Check-out Time:</span>{' '}
                  {format(invoiceData.checkOutTime, 'dd/MM/yyyy hh:mm a')}
                </p>
                <p className="mb-1 text-xs sm:text-sm break-words">
                  <span className="font-semibold">Invoice No.:</span> {invoiceData.invoiceNo}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{' '}
                  {format(invoiceData.invoiceDate, 'dd/MM/yyyy')}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-800">
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold border-r border-gray-300">#</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold border-r border-gray-300">Item name</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold border-r border-gray-300">HSN Code</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold border-r border-gray-300">Qty.</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold border-r border-gray-300">Price/Unit</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold border-r border-gray-300">GST</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold border-r border-gray-300">Amount</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-2 sm:px-4 py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500">
                      No items added yet. Add items using the form on the left.
                    </td>
                  </tr>
                ) : (
                  invoiceData.items.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border-r border-gray-200">{index + 1}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border-r border-gray-200">{item.itemName}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border-r border-gray-200">{item.hsnCode}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-center border-r border-gray-200">{item.quantity}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right border-r border-gray-200">
                        ₹ {item.pricePerUnit.toFixed(2)}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-center border-r border-gray-200">
                        {item.gstRate.toFixed(0)}%
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right border-r border-gray-200">
                        {item.amount.toFixed(2)}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-xs sm:text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="bg-pink-50 border-t-2 border-b-2 border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center px-3 sm:px-6 py-3 sm:py-4 gap-2">
              <div className="text-lg sm:text-xl font-bold text-pink-700">Total</div>
              <div className="flex flex-wrap justify-center gap-4 sm:space-x-8 items-center">
                <div className="text-center">
                  <div className="text-xs sm:text-sm text-gray-600">Total Qty</div>
                  <div className="font-bold text-sm sm:text-base">
                    {invoiceData.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-sm text-gray-600">Sub Total</div>
                  <div className="font-bold text-sm sm:text-base">{invoiceData.subTotal.toFixed(2)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-sm text-gray-600">Total Amount</div>
                  <div className="font-bold text-base sm:text-xl">{invoiceData.total.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Amount in Words and GST Breakdown */}
          <div className="flex flex-col md:flex-row border-b-2 border-gray-800">
            {/* Amount in Words */}
            <div className="flex-1 p-3 sm:p-4 md:p-6 border-b-2 md:border-b-0 md:border-r-2 border-gray-800">
              <p className="font-semibold mb-2 text-sm sm:text-base">Amount in words:</p>
              <p className="text-xs sm:text-sm break-words">{numberToWords(invoiceData.total)}</p>
              <div className="mt-4 sm:mt-6">
                <p className="font-semibold text-sm sm:text-base">Terms & Conditions</p>
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="w-full md:w-80 bg-pink-50">
              <div className="p-3 sm:p-4 md:p-6 space-y-2">
                <div className="flex justify-between items-center bg-pink-200 px-3 sm:px-4 py-2 rounded">
                  <span className="font-bold text-xs sm:text-sm">Sub Total:</span>
                  <span className="font-bold text-xs sm:text-sm">{invoiceData.subTotal.toFixed(2)}</span>
                </div>

                {isInterstate ? (
                  <div className="flex justify-between px-3 sm:px-4 py-1 text-xs sm:text-sm">
                    <span>IGST</span>
                    <span>{invoiceData.igst?.toFixed(2) || '0.00'}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between px-3 sm:px-4 py-1 text-xs sm:text-sm">
                      <span>SGST</span>
                      <span>{invoiceData.sgst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between px-3 sm:px-4 py-1 text-xs sm:text-sm">
                      <span>CGST</span>
                      <span>{invoiceData.cgst.toFixed(2)}</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center px-3 sm:px-4 py-2 font-bold border-t-2 border-gray-400 text-xs sm:text-sm">
                  <span>Total</span>
                  <span>{invoiceData.total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center px-3 sm:px-4 py-1 text-xs sm:text-sm">
                  <span>Payment Type</span>
                  <span className="font-semibold text-pink-600">{invoiceData.paymentType}</span>
                </div>

                <div className="flex justify-between items-center px-3 sm:px-4 py-1 text-xs sm:text-sm">
                  <span>Received</span>
                  <span>{invoiceData.amountReceived.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center px-3 sm:px-4 py-1 font-bold text-red-600 text-xs sm:text-sm">
                  <span>Balance</span>
                  <span>{invoiceData.balance.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="p-6 text-right">
            <p className="font-semibold">Company seal and Sign</p>
          </div>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';
