import React from 'react';
import { InvoiceGenerator } from '../components/invoice/InvoiceGenerator';
import { SavedInvoices } from '../components/invoice/SavedInvoices';

export const InvoicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            VMP Villa Home Stay - GST Invoice Generator
          </h1>
          <p className="text-gray-600">
            Create professional GST invoices for your homestay bookings
          </p>
        </div>

        <InvoiceGenerator />

        <div className="mt-8">
          <SavedInvoices />
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
