import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceData, VMP_VILLA_DETAILS } from '../../types/invoice.types';
import { format } from 'date-fns';
import { numberToWords } from '../../utils/numberToWords';

interface PDFExportOptions {
  filename?: string;
  download?: boolean;
}

export class InvoicePDFGenerator {
  // Generate PDF from HTML element
  static async generateFromHTML(
    element: HTMLElement,
    options: PDFExportOptions = {}
  ): Promise<jsPDF> {
    const { filename = 'invoice.pdf', download = true } = options;

    // Create canvas from HTML
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    if (download) {
      pdf.save(filename);
    }

    return pdf;
  }

  // Generate PDF programmatically (without HTML rendering)
  static generateProgrammatically(
    invoiceData: InvoiceData,
    options: PDFExportOptions = {}
  ): jsPDF {
    const { filename = `Invoice-${invoiceData.invoiceNo}.pdf`, download = true } = options;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageWidth - 2 * margin;

    let yPosition = margin;

    // Helper function to add text
    const addText = (
      text: string,
      x: number,
      y: number,
      options: {
        fontSize?: number;
        fontStyle?: 'normal' | 'bold' | 'italic';
        align?: 'left' | 'center' | 'right';
      } = {}
    ) => {
      const { fontSize = 10, fontStyle = 'normal', align = 'left' } = options;
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontStyle);
      pdf.text(text, x, y, { align });
    };

    // Draw border
    pdf.setLineWidth(0.5);
    pdf.rect(margin, margin, contentWidth, pageHeight - 2 * margin);

    // Company Header
    yPosition += 5;
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPosition, contentWidth, 35, 'F');

    yPosition += 7;
    addText(VMP_VILLA_DETAILS.name, margin + 5, yPosition, {
      fontSize: 12,
      fontStyle: 'bold',
    });

    yPosition += 6;
    addText('Address: ' + VMP_VILLA_DETAILS.address, margin + 5, yPosition, { fontSize: 9 });

    yPosition += 5;
    addText('Phone No: ' + VMP_VILLA_DETAILS.phone, margin + 5, yPosition, { fontSize: 9 });

    yPosition += 5;
    addText('Email ID: ' + VMP_VILLA_DETAILS.email, margin + 5, yPosition, { fontSize: 9 });

    yPosition += 5;
    addText('GSTIN: ' + VMP_VILLA_DETAILS.gstin, margin + 5, yPosition, { fontSize: 9 });

    yPosition += 5;
    addText('State: ' + VMP_VILLA_DETAILS.state, margin + 5, yPosition, { fontSize: 9 });

    // Logo (right side of header) - Pink/Magenta theme
    const logoX = pageWidth - margin - 30;
    const logoY = margin + 7;
    const pinkColor = [233, 30, 140]; // RGB for #E91E8C

    // Outer circle
    pdf.setDrawColor(pinkColor[0], pinkColor[1], pinkColor[2]);
    pdf.setLineWidth(0.8);
    pdf.circle(logoX + 15, logoY + 15, 15);

    // Inner circle
    pdf.setLineWidth(0.5);
    pdf.circle(logoX + 15, logoY + 15, 13);

    // House roof
    pdf.setLineWidth(0.8);
    pdf.line(logoX + 8, logoY + 10, logoX + 15, logoY + 5);
    pdf.line(logoX + 15, logoY + 5, logoX + 22, logoY + 10);

    // Bed icon simplified
    pdf.setFillColor(pinkColor[0], pinkColor[1], pinkColor[2]);
    pdf.rect(logoX + 10, logoY + 12, 10, 4, 'F'); // Mattress

    // VMP Text
    pdf.setTextColor(pinkColor[0], pinkColor[1], pinkColor[2]);
    addText('VMP', logoX + 15, logoY + 21, {
      fontSize: 10,
      fontStyle: 'bold',
      align: 'center',
    });

    // VILLA Text
    addText('VILLA', logoX + 15, logoY + 26, {
      fontSize: 7,
      fontStyle: 'bold',
      align: 'center',
    });

    // Tagline
    addText('you feel comfortable', logoX + 15, logoY + 29, {
      fontSize: 4,
      fontStyle: 'normal',
      align: 'center',
    });

    // Reset text color to black
    pdf.setTextColor(0, 0, 0);

    // Tax Invoice Title
    yPosition += 8;
    pdf.setFillColor(252, 231, 243); // Light pink color
    pdf.rect(margin, yPosition, contentWidth, 12, 'F');
    yPosition += 8;
    pdf.setTextColor(pinkColor[0], pinkColor[1], pinkColor[2]);
    addText('Tax Invoice', pageWidth / 2, yPosition, {
      fontSize: 18,
      fontStyle: 'bold',
      align: 'center',
    });
    pdf.setTextColor(0, 0, 0); // Reset to black

    // Customer and Invoice Details
    yPosition += 10;
    const detailsStartY = yPosition;

    // Left side - Customer details
    addText('Bill To: ' + (invoiceData.customer.companyName || invoiceData.customer.name), margin + 5, yPosition, {
      fontSize: 10,
      fontStyle: 'bold',
    });

    yPosition += 5;
    if (invoiceData.customer.companyName) {
      addText('Name: ' + invoiceData.customer.name, margin + 5, yPosition, { fontSize: 9 });
      yPosition += 5;
    }

    const addressLines = pdf.splitTextToSize(
      'Address: ' + invoiceData.customer.address +
      (invoiceData.customer.city ? ', ' + invoiceData.customer.city : '') +
      (invoiceData.customer.state ? ', ' + invoiceData.customer.state : '') +
      (invoiceData.customer.pincode ? ', ' + invoiceData.customer.pincode : ''),
      100
    );
    addressLines.forEach((line: string) => {
      addText(line, margin + 5, yPosition, { fontSize: 9 });
      yPosition += 4;
    });

    yPosition += 2;
    addText('Contact No.: ' + invoiceData.customer.contactNo, margin + 5, yPosition, { fontSize: 9 });

    yPosition += 5;
    if (invoiceData.customer.gstin) {
      addText('GSTIN No.: ' + invoiceData.customer.gstin, margin + 5, yPosition, { fontSize: 9 });
      yPosition += 5;
    }

    if (invoiceData.customer.state) {
      addText('State: ' + invoiceData.customer.state, margin + 5, yPosition, { fontSize: 9 });
    }

    // Right side - Invoice details
    let rightY = detailsStartY;
    const rightX = pageWidth - margin - 60;

    addText(
      'Check-in Time: ' + format(invoiceData.checkInTime, 'dd/MM/yyyy hh:mm a'),
      rightX,
      rightY,
      { fontSize: 9, align: 'right' }
    );

    rightY += 5;
    addText(
      'Check-out Time: ' + format(invoiceData.checkOutTime, 'dd/MM/yyyy hh:mm a'),
      rightX,
      rightY,
      { fontSize: 9, align: 'right' }
    );

    rightY += 7;
    addText('Invoice No.: ' + invoiceData.invoiceNo, rightX, rightY, {
      fontSize: 10,
      fontStyle: 'bold',
      align: 'right',
    });

    rightY += 5;
    addText('Date: ' + format(invoiceData.invoiceDate, 'dd/MM/yyyy'), rightX, rightY, {
      fontSize: 10,
      fontStyle: 'bold',
      align: 'right',
    });

    // Items Table
    yPosition = Math.max(yPosition, rightY) + 10;
    const tableStartY = yPosition;

    // Table header
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPosition, contentWidth, 8, 'F');

    const colWidths = {
      num: 10,
      item: 50,
      hsn: 25,
      qty: 15,
      price: 25,
      gst: 15,
      amount: 25,
    };

    let xPos = margin + 2;
    addText('#', xPos, yPosition + 5, { fontSize: 9, fontStyle: 'bold' });

    xPos += colWidths.num;
    addText('Item name', xPos, yPosition + 5, { fontSize: 9, fontStyle: 'bold' });

    xPos += colWidths.item;
    addText('HSN Code', xPos, yPosition + 5, { fontSize: 9, fontStyle: 'bold' });

    xPos += colWidths.hsn;
    addText('Qty.', xPos, yPosition + 5, { fontSize: 9, fontStyle: 'bold' });

    xPos += colWidths.qty;
    addText('Price/Unit', xPos, yPosition + 5, { fontSize: 9, fontStyle: 'bold' });

    xPos += colWidths.price;
    addText('GST', xPos, yPosition + 5, { fontSize: 9, fontStyle: 'bold' });

    xPos += colWidths.gst;
    addText('Amount', xPos, yPosition + 5, { fontSize: 9, fontStyle: 'bold' });

    // Table rows
    yPosition += 8;
    invoiceData.items.forEach((item, index) => {
      xPos = margin + 2;

      addText((index + 1).toString(), xPos, yPosition + 5, { fontSize: 9 });

      xPos += colWidths.num;
      addText(item.itemName, xPos, yPosition + 5, { fontSize: 9 });

      xPos += colWidths.item;
      addText(item.hsnCode, xPos, yPosition + 5, { fontSize: 9 });

      xPos += colWidths.hsn;
      addText(item.quantity.toString(), xPos, yPosition + 5, { fontSize: 9 });

      xPos += colWidths.qty;
      addText('₹ ' + item.pricePerUnit.toFixed(2), xPos, yPosition + 5, { fontSize: 9 });

      xPos += colWidths.price;
      addText(item.gstRate.toFixed(0) + '%', xPos, yPosition + 5, { fontSize: 9 });

      xPos += colWidths.gst;
      addText(item.amount.toFixed(2), xPos, yPosition + 5, { fontSize: 9 });

      yPosition += 7;
    });

    // Total row
    yPosition += 3;
    pdf.setFillColor(252, 231, 243); // Light pink
    pdf.rect(margin, yPosition, contentWidth, 10, 'F');

    addText('Total', margin + 20, yPosition + 6, {
      fontSize: 11,
      fontStyle: 'bold',
    });

    addText(
      invoiceData.items.reduce((sum, item) => sum + item.quantity, 0).toString(),
      margin + colWidths.num + colWidths.item + colWidths.hsn + 5,
      yPosition + 6,
      { fontSize: 11, fontStyle: 'bold' }
    );

    addText(
      invoiceData.subTotal.toFixed(2),
      margin + colWidths.num + colWidths.item + colWidths.hsn + colWidths.qty + colWidths.price,
      yPosition + 6,
      { fontSize: 11, fontStyle: 'bold' }
    );

    addText(invoiceData.total.toFixed(2), pageWidth - margin - 30, yPosition + 6, {
      fontSize: 11,
      fontStyle: 'bold',
    });

    // Amount in words and totals
    yPosition += 15;

    // Left side - Amount in words
    addText('Amount in words:', margin + 5, yPosition, {
      fontSize: 10,
      fontStyle: 'bold',
    });

    yPosition += 5;
    const wordsLines = pdf.splitTextToSize(numberToWords(invoiceData.total), 100);
    wordsLines.forEach((line: string) => {
      addText(line, margin + 5, yPosition, { fontSize: 9 });
      yPosition += 5;
    });

    // Right side - Totals breakdown
    const totalsX = pageWidth - margin - 60;
    let totalsY = yPosition - wordsLines.length * 5;

    pdf.setFillColor(252, 231, 243); // Light pink
    pdf.rect(totalsX - 5, totalsY - 5, 65, 8, 'F');
    addText('Sub Total:', totalsX, totalsY, { fontSize: 10, fontStyle: 'bold' });
    addText(invoiceData.subTotal.toFixed(2), pageWidth - margin - 5, totalsY, {
      fontSize: 10,
      fontStyle: 'bold',
      align: 'right',
    });

    totalsY += 6;
    const isInterstate = invoiceData.customer.state !== VMP_VILLA_DETAILS.state;

    if (isInterstate && invoiceData.igst) {
      addText('IGST', totalsX, totalsY, { fontSize: 9 });
      addText(invoiceData.igst.toFixed(2), pageWidth - margin - 5, totalsY, {
        fontSize: 9,
        align: 'right',
      });
      totalsY += 5;
    } else {
      addText('SGST', totalsX, totalsY, { fontSize: 9 });
      addText(invoiceData.sgst.toFixed(2), pageWidth - margin - 5, totalsY, {
        fontSize: 9,
        align: 'right',
      });

      totalsY += 5;
      addText('CGST', totalsX, totalsY, { fontSize: 9 });
      addText(invoiceData.cgst.toFixed(2), pageWidth - margin - 5, totalsY, {
        fontSize: 9,
        align: 'right',
      });
      totalsY += 5;
    }

    addText('Total', totalsX, totalsY, { fontSize: 10, fontStyle: 'bold' });
    addText(invoiceData.total.toFixed(2), pageWidth - margin - 5, totalsY, {
      fontSize: 10,
      fontStyle: 'bold',
      align: 'right',
    });

    totalsY += 5;
    addText('Payment Type', totalsX, totalsY, { fontSize: 9 });
    addText(invoiceData.paymentType, pageWidth - margin - 5, totalsY, {
      fontSize: 9,
      fontStyle: 'bold',
      align: 'right',
    });

    totalsY += 5;
    addText('Received', totalsX, totalsY, { fontSize: 9 });
    addText(invoiceData.amountReceived.toFixed(2), pageWidth - margin - 5, totalsY, {
      fontSize: 9,
      align: 'right',
    });

    totalsY += 5;
    addText('Balance', totalsX, totalsY, { fontSize: 9, fontStyle: 'bold' });
    addText(invoiceData.balance.toFixed(2), pageWidth - margin - 5, totalsY, {
      fontSize: 9,
      fontStyle: 'bold',
      align: 'right',
    });

    // Terms and signature
    yPosition = Math.max(yPosition, totalsY) + 10;
    addText('Terms & Conditions', margin + 5, yPosition, {
      fontSize: 10,
      fontStyle: 'bold',
    });

    yPosition = pageHeight - margin - 15;
    addText('Company seal and Sign', pageWidth - margin - 5, yPosition, {
      fontSize: 10,
      align: 'right',
    });

    if (download) {
      pdf.save(filename);
    }

    return pdf;
  }

  // Print invoice
  static async print(element: HTMLElement): Promise<void> {
    const pdf = await this.generateFromHTML(element, { download: false });
    pdf.autoPrint();
    window.open(pdf.output('bloburl'), '_blank');
  }
}

// React component for export buttons
interface InvoiceExportButtonsProps {
  invoiceData: InvoiceData;
  invoiceRef: React.RefObject<HTMLDivElement>;
}

export const InvoiceExportButtons: React.FC<InvoiceExportButtonsProps> = ({
  invoiceData,
  invoiceRef,
}) => {
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

  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={handleDownloadPDF}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
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
        Download PDF (High Quality)
      </button>

      <button
        onClick={handleDownloadProgrammatic}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
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
        Download PDF (Fast)
      </button>

      <button
        onClick={handlePrint}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
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
        Print
      </button>
    </div>
  );
};
