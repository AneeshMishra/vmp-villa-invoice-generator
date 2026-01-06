// Invoice Types for VMP Villa Home Stay GST Billing

export interface InvoiceItem {
  id: string;
  itemName: string;
  hsnCode: string;
  quantity: number;
  pricePerUnit: number;
  gstRate: number; // in percentage (e.g., 5, 12, 18)
  amount: number; // calculated: (pricePerUnit * quantity) * (1 + gstRate/100)
}

export interface CustomerDetails {
  name: string;
  companyName?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactNo: string;
  gstin?: string;
}

export interface InvoiceData {
  invoiceNo: string;
  invoiceDate: Date;
  checkInTime: Date;
  checkOutTime: Date;
  customer: CustomerDetails;
  items: InvoiceItem[];
  subTotal: number;
  sgst: number;
  cgst: number;
  igst?: number; // for interstate transactions
  total: number;
  amountReceived: number;
  balance: number;
  paymentType: 'Cash' | 'Online';
  termsAndConditions?: string;
}

export interface CompanyDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  state: string;
  stateCode: string;
}

// HSN Codes for common homestay services
export const HSN_CODES = {
  ROOM_ACCOMMODATION: '996311',
  FOOD_SERVICES: '996331',
  RESTAURANT_SERVICES: '996331',
} as const;

// GST Rates
export const GST_RATES = {
  ROOM_UNDER_7500: 0, // No GST for rooms below ₹7500
  ROOM_7500_TO_10000: 12, // 12% GST for rooms ₹7500-₹10000
  ROOM_ABOVE_10000: 18, // 18% GST for rooms above ₹10000
  FOOD_SERVICES: 5, // 5% GST for food services
} as const;

// VMP Villa Company Details
export const VMP_VILLA_DETAILS: CompanyDetails = {
  name: 'VMP Villa Home Stay',
  address: 'A-73, KPS Town, Baroli Ahir, Shamsabad Road, Agra, UP. 283125',
  phone: '9258555345',
  email: 'support@vmpvilla.in',
  gstin: '09CAFPB2385C1Z1',
  state: 'Uttar Pradesh',
  stateCode: '09',
};

// State codes for GST
export const STATE_CODES: Record<string, string> = {
  'Andhra Pradesh': '37',
  'Arunachal Pradesh': '12',
  'Assam': '18',
  'Bihar': '10',
  'Chhattisgarh': '22',
  'Goa': '30',
  'Gujarat': '24',
  'Haryana': '06',
  'Himachal Pradesh': '02',
  'Jharkhand': '20',
  'Karnataka': '29',
  'Kerala': '32',
  'Madhya Pradesh': '23',
  'Maharashtra': '27',
  'Manipur': '14',
  'Meghalaya': '17',
  'Mizoram': '15',
  'Nagaland': '13',
  'Odisha': '21',
  'Punjab': '03',
  'Rajasthan': '08',
  'Sikkim': '11',
  'Tamil Nadu': '33',
  'Telangana': '36',
  'Tripura': '16',
  'Uttar Pradesh': '09',
  'Uttarakhand': '05',
  'West Bengal': '19',
  'Delhi': '07',
  'Jammu and Kashmir': '01',
  'Ladakh': '38',
};
