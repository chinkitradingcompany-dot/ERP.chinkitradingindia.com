// ============================================
// TYPES FOR CHINKI TRADING COMPANY ERP
// ============================================

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  gstin: string;
  pan: string;
  address: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
  creditLimit: number;
  balance: number;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  gstin: string;
  pan: string;
  address: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  balance: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  hsnCode: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  gstRate: number;
  stock: number;
  minStock: number;
  description: string;
  createdAt: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  gstRate: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  customerGstin: string;
  customerState: string;
  customerStateCode: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalTax: number;
  grandTotal: number;
  roundOff: number;
  amountInWords: string;
  notes: string;
  terms: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
  paymentMethod: string;
  upiId: string;
  createdAt: string;
}

export interface Purchase {
  id: string;
  purchaseNumber: string;
  date: string;
  vendorId: string;
  vendorName: string;
  vendorGstin: string;
  vendorState: string;
  vendorStateCode: string;
  vendorAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalTax: number;
  grandTotal: number;
  roundOff: number;
  notes: string;
  status: 'Draft' | 'Received' | 'Paid' | 'Cancelled';
  createdAt: string;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  date: string;
  validUntil: string;
  customerId: string;
  customerName: string;
  customerGstin: string;
  customerState: string;
  customerStateCode: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalTax: number;
  grandTotal: number;
  roundOff: number;
  notes: string;
  terms: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';
  bankDetails: string;
  upiId: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  date: string;
  type: 'Received' | 'Made';
  partyType: 'Customer' | 'Vendor';
  partyId: string;
  partyName: string;
  referenceType: 'Invoice' | 'Purchase' | 'Quotation' | 'Other';
  referenceId: string;
  referenceNumber: string;
  amount: number;
  method: 'Cash' | 'Bank Transfer' | 'UPI' | 'Cheque' | 'Card' | 'Other';
  upiTransactionId: string;
  bankName: string;
  chequeNumber: string;
  notes: string;
  status: 'Completed' | 'Pending' | 'Failed';
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  description: string;
  entries: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  status: 'Draft' | 'Posted';
  createdAt: string;
}

export interface JournalLine {
  account: string;
  description: string;
  debit: number;
  credit: number;
}

export interface StockMovement {
  id: string;
  date: string;
  productId: string;
  productName: string;
  type: 'In' | 'Out' | 'Adjustment';
  quantity: number;
  reference: string;
  referenceId: string;
  notes: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
  entityId: string;
}

export type Page =
  | 'dashboard'
  | 'customers'
  | 'vendors'
  | 'products'
  | 'sales-invoices'
  | 'create-invoice'
  | 'purchases'
  | 'create-purchase'
  | 'quotations'
  | 'create-quotation'
  | 'payments'
  | 'journal-entries'
  | 'reports'
  | 'activity-log'
  | 'settings';
