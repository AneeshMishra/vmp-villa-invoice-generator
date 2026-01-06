// Convert number to words for Indian currency

const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertLessThanThousand(num: number): string {
  if (num === 0) return '';

  if (num < 20) {
    return ones[num];
  }

  if (num < 100) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    return tens[ten] + (one > 0 ? ' ' + ones[one] : '');
  }

  const hundred = Math.floor(num / 100);
  const remainder = num % 100;
  return ones[hundred] + ' Hundred' + (remainder > 0 ? ' ' + convertLessThanThousand(remainder) : '');
}

export function numberToWords(num: number): string {
  if (num === 0) return 'Zero';

  // Handle decimal part (paise)
  const [rupees, paise] = num.toFixed(2).split('.');
  const rupeesNum = parseInt(rupees);
  const paiseNum = parseInt(paise);

  let result = '';

  // Convert rupees
  if (rupeesNum === 0) {
    result = 'Zero Rupees';
  } else {
    const crore = Math.floor(rupeesNum / 10000000);
    const lakh = Math.floor((rupeesNum % 10000000) / 100000);
    const thousand = Math.floor((rupeesNum % 100000) / 1000);
    const hundred = rupeesNum % 1000;

    const parts: string[] = [];

    if (crore > 0) {
      parts.push(convertLessThanThousand(crore) + ' Crore');
    }
    if (lakh > 0) {
      parts.push(convertLessThanThousand(lakh) + ' Lakh');
    }
    if (thousand > 0) {
      parts.push(convertLessThanThousand(thousand) + ' Thousand');
    }
    if (hundred > 0) {
      parts.push(convertLessThanThousand(hundred));
    }

    result = parts.join(' ') + ' Rupees';
  }

  // Add paise if present
  if (paiseNum > 0) {
    result += ' and ' + convertLessThanThousand(paiseNum) + ' Paise';
  }

  return result + ' Only';
}

// Format currency in Indian format (e.g., 1,23,456.78)
export function formatIndianCurrency(amount: number): string {
  const [integer, decimal] = amount.toFixed(2).split('.');
  const lastThree = integer.slice(-3);
  const otherNumbers = integer.slice(0, -3);

  const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
    (otherNumbers ? ',' : '') + lastThree;

  return '₹ ' + formattedInteger + (decimal ? '.' + decimal : '');
}

// Calculate GST breakdown
export function calculateGST(amount: number, gstRate: number, isInterstate: boolean = false) {
  const gstAmount = (amount * gstRate) / 100;

  if (isInterstate) {
    return {
      igst: gstAmount,
      cgst: 0,
      sgst: 0,
      total: gstAmount,
    };
  }

  return {
    igst: 0,
    cgst: gstAmount / 2,
    sgst: gstAmount / 2,
    total: gstAmount,
  };
}
