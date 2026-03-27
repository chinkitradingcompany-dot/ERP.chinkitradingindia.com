// ============================================
// UTILITY FUNCTIONS FOR CHINKI TRADING COMPANY ERP
// ============================================

import { COMPANY } from './constants';
import type { InvoiceItem, Invoice, Purchase, Quotation } from '../types';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getFinancialYear(): string {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  if (month >= 3) {
    return `${year}-${(year + 1).toString().slice(2)}`;
  }
  return `${year - 1}-${year.toString().slice(2)}`;
}

export function generateInvoiceNumber(existingInvoices: Invoice[]): string {
  const fy = getFinancialYear();
  const count = existingInvoices.length + 1;
  return `INV/${fy}/${count.toString().padStart(4, '0')}`;
}

export function generatePurchaseNumber(existingPurchases: Purchase[]): string {
  const fy = getFinancialYear();
  const count = existingPurchases.length + 1;
  return `PUR/${fy}/${count.toString().padStart(4, '0')}`;
}

export function generateQuotationNumber(existingQuotations: Quotation[]): string {
  const fy = getFinancialYear();
  const count = existingQuotations.length + 1;
  return `QTN/${fy}/${count.toString().padStart(4, '0')}`;
}

export function generatePaymentNumber(count: number): string {
  const fy = getFinancialYear();
  return `PAY/${fy}/${(count + 1).toString().padStart(4, '0')}`;
}

export function generateJournalNumber(count: number): string {
  const fy = getFinancialYear();
  return `JRN/${fy}/${(count + 1).toString().padStart(4, '0')}`;
}

// Calculate GST for an item based on supplier/customer state
export function calculateItemGST(
  item: Partial<InvoiceItem>,
  partyStateCode: string
): InvoiceItem {
  const qty = item.quantity || 0;
  const rate = item.rate || 0;
  const discount = item.discount || 0;
  const gstRate = item.gstRate || 0;

  const grossAmount = qty * rate;
  const discountAmount = (grossAmount * discount) / 100;
  const taxableAmount = grossAmount - discountAmount;

  const isIntraState = partyStateCode === COMPANY.stateCode;
  let cgst = 0, sgst = 0, igst = 0;

  if (isIntraState) {
    cgst = (taxableAmount * gstRate) / 200;
    sgst = (taxableAmount * gstRate) / 200;
  } else {
    igst = (taxableAmount * gstRate) / 100;
  }

  const total = taxableAmount + cgst + sgst + igst;

  return {
    productId: item.productId || '',
    productName: item.productName || '',
    hsnCode: item.hsnCode || '',
    quantity: qty,
    unit: item.unit || 'Pcs',
    rate,
    discount,
    gstRate,
    taxableAmount: Math.round(taxableAmount * 100) / 100,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    igst: Math.round(igst * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

// Number to words (Indian system)
export function numberToWords(num: number): string {
  if (num === 0) return 'Zero';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertLessThanThousand(n: number): string {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convertLessThanThousand(n % 100) : '');
  }

  const rounded = Math.round(num * 100) / 100;
  const intPart = Math.floor(rounded);
  const decPart = Math.round((rounded - intPart) * 100);

  let result = '';

  if (intPart >= 10000000) {
    result += convertLessThanThousand(Math.floor(intPart / 10000000)) + ' Crore ';
  }
  if (intPart >= 100000) {
    result += convertLessThanThousand(Math.floor((intPart % 10000000) / 100000)) + ' Lakh ';
  }
  if (intPart >= 1000) {
    result += convertLessThanThousand(Math.floor((intPart % 100000) / 1000)) + ' Thousand ';
  }
  result += convertLessThanThousand(intPart % 1000);

  result = result.trim();
  if (!result) result = 'Zero';

  if (decPart > 0) {
    result += ' and ' + convertLessThanThousand(decPart) + ' Paise';
  }

  return 'Rupees ' + result + ' Only';
}

// Print document helper
export function printDocument(title: string, content: string): void {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) return;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #333; font-size: 12px; }
        .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 15px; margin-bottom: 15px; }
        .company-name { font-size: 22px; font-weight: bold; color: #1e40af; }
        .company-details { font-size: 11px; color: #666; margin-top: 4px; }
        .doc-title { font-size: 16px; font-weight: bold; margin: 15px 0; text-align: center; text-transform: uppercase; color: #1e40af; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .info-box { border: 1px solid #ddd; padding: 10px; border-radius: 4px; }
        .info-box h4 { font-size: 11px; color: #1e40af; text-transform: uppercase; margin-bottom: 5px; border-bottom: 1px solid #eee; padding-bottom: 3px; }
        .info-box p { font-size: 11px; margin: 2px 0; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background: #1e40af; color: white; padding: 8px 6px; font-size: 10px; text-transform: uppercase; }
        td { padding: 6px; border: 1px solid #ddd; font-size: 11px; }
        tr:nth-child(even) { background: #f8fafc; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .total-row { font-weight: bold; background: #eff6ff !important; }
        .grand-total { font-size: 14px; font-weight: bold; color: #1e40af; }
        .summary { margin: 15px 0; }
        .summary-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #eee; }
        .summary-row.total { font-weight: bold; font-size: 14px; color: #1e40af; border-top: 2px solid #1e40af; border-bottom: none; padding-top: 8px; }
        .amount-words { background: #f0f9ff; padding: 10px; border-radius: 4px; font-style: italic; margin: 10px 0; }
        .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px; }
        .signatures { display: flex; justify-content: space-between; margin-top: 50px; }
        .sig-block { text-align: center; }
        .sig-line { border-top: 1px solid #333; width: 150px; margin-top: 40px; padding-top: 5px; }
        .bank-details { background: #f0fdf4; padding: 10px; border-radius: 4px; margin: 10px 0; border: 1px solid #86efac; }
        .upi-section { background: #fef3c7; padding: 10px; border-radius: 4px; margin: 10px 0; border: 1px solid #fcd34d; }
        .notes { background: #f8fafc; padding: 10px; border-radius: 4px; margin: 10px 0; }
        @media print {
          body { padding: 0; }
          @page { margin: 15mm; }
        }
      </style>
    </head>
    <body>
      ${content}
      <script>
        window.onload = function() {
          window.print();
        };
      <\/script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

// Generate invoice print HTML
export function generateInvoiceHTML(invoice: Invoice): string {
  const isIntraState = invoice.customerStateCode === COMPANY.stateCode;
  
  const itemRows = invoice.items.map((item, i) => `
    <tr>
      <td class="text-center">${i + 1}</td>
      <td>${item.productName}</td>
      <td class="text-center">${item.hsnCode}</td>
      <td class="text-center">${item.quantity} ${item.unit}</td>
      <td class="text-right">${formatCurrency(item.rate)}</td>
      <td class="text-center">${item.discount}%</td>
      <td class="text-right">${formatCurrency(item.taxableAmount)}</td>
      ${isIntraState ? `
        <td class="text-right">${formatCurrency(item.cgst)}</td>
        <td class="text-right">${formatCurrency(item.sgst)}</td>
      ` : `
        <td class="text-right">${formatCurrency(item.igst)}</td>
      `}
      <td class="text-right">${formatCurrency(item.total)}</td>
    </tr>
  `).join('');

  return `
    <div class="header">
      <div class="company-name">${COMPANY.name}</div>
      <div class="company-details">
        ${COMPANY.address}, ${COMPANY.city}, ${COMPANY.state} - ${COMPANY.pincode}<br/>
        Phone: ${COMPANY.phone} | Email: ${COMPANY.email}<br/>
        GSTIN: ${COMPANY.gstin} | PAN: ${COMPANY.pan}
      </div>
    </div>
    
    <div class="doc-title">Tax Invoice</div>
    
    <div class="info-grid">
      <div class="info-box">
        <h4>Bill To</h4>
        <p><strong>${invoice.customerName}</strong></p>
        <p>${invoice.customerAddress}</p>
        <p>GSTIN: ${invoice.customerGstin || 'N/A'}</p>
        <p>State: ${invoice.customerState} (${invoice.customerStateCode})</p>
      </div>
      <div class="info-box">
        <h4>Invoice Details</h4>
        <p><strong>Invoice No:</strong> ${invoice.invoiceNumber}</p>
        <p><strong>Date:</strong> ${formatDate(invoice.date)}</p>
        <p><strong>Due Date:</strong> ${formatDate(invoice.dueDate)}</p>
        <p><strong>Status:</strong> ${invoice.status}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Item</th>
          <th>HSN</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Disc%</th>
          <th>Taxable</th>
          ${isIntraState ? '<th>CGST</th><th>SGST</th>' : '<th>IGST</th>'}
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>

    <div style="display: flex; justify-content: flex-end;">
      <div style="width: 300px;" class="summary">
        <div class="summary-row"><span>Subtotal:</span><span>${formatCurrency(invoice.subtotal)}</span></div>
        ${isIntraState ? `
          <div class="summary-row"><span>CGST:</span><span>${formatCurrency(invoice.totalCgst)}</span></div>
          <div class="summary-row"><span>SGST:</span><span>${formatCurrency(invoice.totalSgst)}</span></div>
        ` : `
          <div class="summary-row"><span>IGST:</span><span>${formatCurrency(invoice.totalIgst)}</span></div>
        `}
        <div class="summary-row"><span>Round Off:</span><span>${formatCurrency(invoice.roundOff)}</span></div>
        <div class="summary-row total"><span>Grand Total:</span><span>${formatCurrency(invoice.grandTotal)}</span></div>
      </div>
    </div>

    <div class="amount-words">
      <strong>Amount in Words:</strong> ${invoice.amountInWords}
    </div>

    <div class="bank-details">
      <h4 style="margin-bottom: 5px; color: #166534;">Bank Details for Payment</h4>
      <p>Bank: ${COMPANY.bankName} | A/C No: ${COMPANY.accountNumber}</p>
      <p>IFSC: ${COMPANY.ifscCode} | Branch: ${COMPANY.branch}</p>
    </div>

    ${invoice.upiId ? `
      <div class="upi-section">
        <h4 style="margin-bottom: 5px; color: #92400e;">UPI Payment</h4>
        <p>UPI ID: ${invoice.upiId}</p>
      </div>
    ` : ''}

    ${invoice.notes ? `<div class="notes"><strong>Notes:</strong> ${invoice.notes}</div>` : ''}
    ${invoice.terms ? `<div class="notes"><strong>Terms & Conditions:</strong> ${invoice.terms}</div>` : ''}

    <div class="signatures">
      <div class="sig-block">
        <div class="sig-line">Customer's Signature</div>
      </div>
      <div class="sig-block">
        <div class="sig-line">For ${COMPANY.name}<br/>Authorized Signatory</div>
      </div>
    </div>
  `;
}

// Storage helpers
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore parse errors
  }
  return defaultValue;
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}
