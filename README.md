# Chinki Trading Company - ERP System

A comprehensive, full-featured Enterprise Resource Planning (ERP) system built with React, TypeScript, and Tailwind CSS. This system is specifically designed for Indian businesses with complete GST compliance, invoice management, and accounting features.

## 🚀 Features

### Core Modules

1. **Dashboard**
   - Real-time business metrics and KPIs
   - Sales, purchase, and payment summaries
   - Recent activity tracking
   - Quick access to all modules

2. **Master Data Management**
   - **Customer Management**: Complete CRUD operations with GST details
   - **Vendor Management**: Supplier tracking with contact information
   - **Product/Inventory Management**: Product catalog with HSN codes, GST rates, and stock tracking

3. **Sales Management**
   - **Quotations**: Professional quotations with GST calculations
   - **Sales Invoices**: GST-compliant invoicing with CGST/SGST/IGST auto-calculation
   - Automatic state-wise GST type detection
   - Invoice numbering system

4. **Purchase Management**
   - Purchase invoice recording
   - Vendor-wise purchase tracking
   - Automatic stock updates

5. **Payments & Accounts**
   - Payment recording (UPI, Bank Transfer, Cash, Cheque)
   - Payment tracking against invoices
   - Journal entries for accounting
   - Outstanding receivables tracking

6. **Reports & Analytics**
   - Sales reports
   - Purchase reports
   - GST reports (CGST, SGST, IGST)
   - Profit & Loss summary
   - Date-wise filtering
   - Export capabilities

7. **Activity Log**
   - Complete audit trail
   - User activity tracking
   - Module-wise activity filtering

### Key Features

- ✅ **GST Compliance**: Automatic CGST+SGST for intra-state and IGST for inter-state transactions
- ✅ **Indian State Support**: Complete list of all Indian states with GST state codes
- ✅ **Currency Formatting**: Indian Rupee (₹) with proper formatting
- ✅ **Financial Year**: Automatic financial year calculation (April to March)
- ✅ **Number to Words**: Amount conversion for invoice printing
- ✅ **LocalStorage Persistence**: All data persists in browser localStorage
- ✅ **Role-Based Access**: Admin authentication system
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile devices
- ✅ **Modern UI**: Clean, professional interface with Tailwind CSS

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Hooks (useState, useEffect)
- **Data Persistence**: Browser LocalStorage
- **Backend Ready**: Supabase-compatible (can be integrated)

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/chinkitradingcompany-dot/ERP.chinkitradingindia.com.git
   cd ERP.chinkitradingindia.com
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🔐 Default Login Credentials

- **Username**: Rahul Singh
- **Password**: Rahul@9675

## 📱 Usage

### Getting Started

1. **Login** with the default credentials
2. **Add Master Data**:
   - Add customers with GST details
   - Add vendors for purchases
   - Add products with HSN codes and GST rates

3. **Create Transactions**:
   - Create quotations for customers
   - Generate sales invoices
   - Record purchase invoices
   - Track payments

4. **View Reports**:
   - Monitor sales and purchase trends
   - Check GST liability
   - Track pending payments
   - View profit/loss summaries

### Sample Data

The system comes pre-populated with sample data:
- 2 sample customers
- 1 sample vendor
- 3 sample products

You can delete or modify these as needed.

## 🏗️ Project Structure

```
/
├── src/
│   ├── ERPApp.tsx          # Main application component (all-in-one)
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles with Tailwind
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

## 💼 Business Logic

### GST Calculation

The system automatically calculates GST based on the following rules:

- **Intra-State Transaction** (same state as company):
  - CGST = (Taxable Amount × GST Rate) ÷ 2
  - SGST = (Taxable Amount × GST Rate) ÷ 2
  - IGST = 0

- **Inter-State Transaction** (different state):
  - CGST = 0
  - SGST = 0
  - IGST = Taxable Amount × GST Rate

### Invoice Numbering

- Sales Invoices: `INV-XXXXXX`
- Purchase Invoices: `PUR-XXXXXX`
- Quotations: `QUO-XXXXXX`
- Payments: `PAY-XXXXXX`

### Financial Year

The system follows the Indian financial year (April 1 to March 31). Financial year is automatically calculated and displayed.

## 🎨 Customization

### Company Details

Edit the `COMPANY` constant in `src/ERPApp.tsx` to update your company information:

```typescript
const COMPANY: Company = {
  name: "YOUR COMPANY NAME",
  address: "Your Address",
  gstin: "Your GSTIN",
  placeOfSupply: "Your State",
  stateCode: "Your State Code",
  bankDetails: "Your Bank Details",
  upiId: "your-upi@bank",
  email: "your@email.com",
  phone: "+91-XXXXXXXXXX",
};
```

### Admin Credentials

Edit the `ADMIN_USER` constant to change login credentials:

```typescript
const ADMIN_USER: User = {
  username: "Your Username",
  password: "Your Password",
  name: "Your Name",
  role: "admin",
};
```

## 🔄 Data Persistence

All data is stored in browser's localStorage with the following keys:

- `customers` - Customer master data
- `vendors` - Vendor master data
- `products` - Product master data
- `invoices` - Sales invoices
- `purchases` - Purchase invoices
- `payments` - Payment records
- `quotations` - Quotation data
- `journal` - Journal entries
- `activity` - Activity log

### Backup Data

To backup your data, open browser console and run:

```javascript
const backup = {
  customers: localStorage.getItem('customers'),
  vendors: localStorage.getItem('vendors'),
  products: localStorage.getItem('products'),
  invoices: localStorage.getItem('invoices'),
  purchases: localStorage.getItem('purchases'),
  payments: localStorage.getItem('payments'),
  quotations: localStorage.getItem('quotations'),
  journal: localStorage.getItem('journal'),
  activity: localStorage.getItem('activity'),
};
console.log(JSON.stringify(backup));
```

### Restore Data

To restore from backup:

```javascript
const backup = /* your backup JSON */;
Object.keys(backup).forEach(key => {
  localStorage.setItem(key, backup[key]);
});
location.reload();
```

## 🚧 Future Enhancements

Potential features for future releases:

- [ ] Print-to-PDF functionality for invoices
- [ ] Email invoices to customers
- [ ] SMS notifications
- [ ] Barcode/QR code generation
- [ ] Multi-user support with Supabase backend
- [ ] Advanced reporting with charts
- [ ] Export to Excel/CSV
- [ ] GST return filing helpers (GSTR-1, GSTR-3B)
- [ ] E-way bill generation
- [ ] Inventory alerts for low stock
- [ ] Recurring invoices
- [ ] Multi-currency support
- [ ] Payment gateway integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Chinki Trading Company**

- GitHub: [@chinkitradingcompany-dot](https://github.com/chinkitradingcompany-dot)

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Vite](https://vitejs.dev/)
- Type-safe with [TypeScript](https://www.typescriptlang.org/)

## 📞 Support

For support, email contact@chinkitrading.com or create an issue in the GitHub repository.

## ⚠️ Disclaimer

This software is provided "as is" without warranty of any kind. While the GST calculations follow standard Indian tax rules, please consult with a tax professional to ensure compliance with your specific business requirements and local regulations.

---

**Made with ❤️ for Indian businesses**
