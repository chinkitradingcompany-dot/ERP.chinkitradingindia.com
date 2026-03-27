import React, { useState, useEffect } from "react";

// ============================================================================
// 1. TYPES & INTERFACES
// ============================================================================

type Role = "admin" | "user";
type GSTType = "CGST_SGST" | "IGST";
type InvoiceStatus = "draft" | "issued" | "paid" | "cancelled";
type PaymentMode = "UPI" | "BANK_TRANSFER" | "CASH" | "CHEQUE";
type TransactionType = "sales" | "purchase" | "payment" | "receipt";

interface Company {
  name: string;
  address: string;
  gstin: string;
  placeOfSupply: string;
  stateCode: string;
  bankDetails: string;
  upiId: string;
  email: string;
  phone: string;
}

interface User {
  username: string;
  password: string;
  role: Role;
  name: string;
}

interface Customer {
  id: string;
  name: string;
  gstin: string;
  state: string;
  stateCode: string;
  address: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface Vendor {
  id: string;
  name: string;
  gstin: string;
  state: string;
  stateCode: string;
  address: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  hsn: string;
  unit: string;
  gstRate: number;
  price: number;
  stock: number;
  createdAt: string;
}

interface InvoiceItem {
  productId: string;
  productName: string;
  hsn: string;
  quantity: number;
  unit: string;
  rate: number;
  gstRate: number;
  amount: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNo: string;
  customerId: string;
  customerName: string;
  customerGSTIN: string;
  customerAddress: string;
  customerState: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  amountInWords: string;
  status: InvoiceStatus;
  notes: string;
  createdAt: string;
}

interface Purchase {
  id: string;
  purchaseNo: string;
  vendorId: string;
  vendorName: string;
  vendorGSTIN: string;
  vendorAddress: string;
  vendorState: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  status: InvoiceStatus;
  notes: string;
  createdAt: string;
}

interface Payment {
  id: string;
  paymentNo: string;
  invoiceId: string;
  invoiceNo: string;
  customerId: string;
  customerName: string;
  date: string;
  amount: number;
  mode: PaymentMode;
  reference: string;
  notes: string;
  createdAt: string;
}

interface Quotation {
  id: string;
  quotationNo: string;
  customerId: string;
  customerName: string;
  customerGSTIN: string;
  customerAddress: string;
  customerState: string;
  date: string;
  validUntil: string;
  items: InvoiceItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  amountInWords: string;
  notes: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  createdAt: string;
}

interface JournalEntry {
  id: string;
  entryNo: string;
  date: string;
  type: TransactionType;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  createdAt: string;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  activity: string;
  user: string;
  module: string;
  details: string;
}

// ============================================================================
// 2. CONSTANTS
// ============================================================================

const COMPANY: Company = {
  name: "CHINKI TRADING COMPANY",
  address: "123 Chandigarh Road, Haryana",
  gstin: "06XXXXXXXZ5Z6",
  placeOfSupply: "Haryana",
  stateCode: "06",
  bankDetails: "Account No: 123456789, IFSC: SBIN0001234, Bank: State Bank of India, Branch: Chandigarh",
  upiId: "chinkitrading@sbi",
  email: "contact@chinkitrading.com",
  phone: "+91-9876543210",
};

const GST_STATES = [
  { code: "01", name: "Jammu and Kashmir" },
  { code: "02", name: "Himachal Pradesh" },
  { code: "03", name: "Punjab" },
  { code: "04", name: "Chandigarh" },
  { code: "05", name: "Uttarakhand" },
  { code: "06", name: "Haryana" },
  { code: "07", name: "Delhi" },
  { code: "08", name: "Rajasthan" },
  { code: "09", name: "Uttar Pradesh" },
  { code: "10", name: "Bihar" },
  { code: "11", name: "Sikkim" },
  { code: "12", name: "Arunachal Pradesh" },
  { code: "13", name: "Nagaland" },
  { code: "14", name: "Manipur" },
  { code: "15", name: "Mizoram" },
  { code: "16", name: "Tripura" },
  { code: "17", name: "Meghalaya" },
  { code: "18", name: "Assam" },
  { code: "19", name: "West Bengal" },
  { code: "20", name: "Jharkhand" },
  { code: "21", name: "Odisha" },
  { code: "22", name: "Chhattisgarh" },
  { code: "23", name: "Madhya Pradesh" },
  { code: "24", name: "Gujarat" },
  { code: "26", name: "Dadra and Nagar Haveli and Daman and Diu" },
  { code: "27", name: "Maharashtra" },
  { code: "29", name: "Karnataka" },
  { code: "30", name: "Goa" },
  { code: "31", name: "Lakshadweep" },
  { code: "32", name: "Kerala" },
  { code: "33", name: "Tamil Nadu" },
  { code: "34", name: "Puducherry" },
  { code: "35", name: "Andaman and Nicobar Islands" },
  { code: "36", name: "Telangana" },
  { code: "37", name: "Andhra Pradesh" },
  { code: "38", name: "Ladakh" },
];

const ADMIN_USER: User = {
  username: "Rahul Singh",
  password: "Rahul@9675",
  name: "Rahul Singh",
  role: "admin",
};

// ============================================================================
// 3. UTILITIES
// ============================================================================

const generateId = (prefix: string = "", length: number = 6): string =>
  prefix + Math.random().toString(36).substring(2, 2 + length).toUpperCase();

const formatCurrency = (n: number): string =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(n);

const currentFinancialYear = (): string => {
  const d = new Date();
  const startYear = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  return `${startYear}-${(startYear + 1).toString().substr(2)}`;
};

const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const getTodayString = (): string => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

const gstTypeForState = (customerState: string, companyState: string): GSTType =>
  customerState === companyState ? "CGST_SGST" : "IGST";

const numberToWords = (num: number): string => {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (num === 0) return "Zero";

  const convertHundreds = (n: number): string => {
    let str = "";
    if (n > 99) {
      str += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n > 19) {
      str += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    } else if (n > 9) {
      str += teens[n - 10] + " ";
      return str;
    }
    if (n > 0) str += ones[n] + " ";
    return str;
  };

  let intPart = Math.floor(num);
  let decPart = Math.round((num - intPart) * 100);

  let result = "";

  if (intPart >= 10000000) {
    result += convertHundreds(Math.floor(intPart / 10000000)) + "Crore ";
    intPart %= 10000000;
  }
  if (intPart >= 100000) {
    result += convertHundreds(Math.floor(intPart / 100000)) + "Lakh ";
    intPart %= 100000;
  }
  if (intPart >= 1000) {
    result += convertHundreds(Math.floor(intPart / 1000)) + "Thousand ";
    intPart %= 1000;
  }
  if (intPart > 0) {
    result += convertHundreds(intPart);
  }

  result = result.trim() + " Rupees";

  if (decPart > 0) {
    result += " and " + convertHundreds(decPart).trim() + " Paise";
  }

  return result + " Only";
};

// ============================================================================
// 4. SEED DATA
// ============================================================================

const seedCustomers: Customer[] = [
  {
    id: generateId("CUST"),
    name: "Acme Engineering Pvt Ltd",
    gstin: "06ABCDE1234F1Z5",
    state: "Haryana",
    stateCode: "06",
    address: "Plot 8, Industrial Area, Gurgaon, Haryana - 122001",
    email: "contact@acmeeng.com",
    phone: "9999999999",
    createdAt: getTodayString(),
  },
  {
    id: generateId("CUST"),
    name: "Tech Solutions Delhi",
    gstin: "07FGHIJ5678K2Z5",
    state: "Delhi",
    stateCode: "07",
    address: "B-45, Connaught Place, New Delhi - 110001",
    email: "info@techsolutions.com",
    phone: "9888888888",
    createdAt: getTodayString(),
  },
];

const seedVendors: Vendor[] = [
  {
    id: generateId("VEND"),
    name: "Quality Suppliers Co.",
    gstin: "03LMNOP9012Q3Z5",
    state: "Punjab",
    stateCode: "03",
    address: "12, Main Road, Ludhiana, Punjab - 141001",
    email: "sales@qualitysuppliers.com",
    phone: "9777777777",
    createdAt: getTodayString(),
  },
];

const seedProducts: Product[] = [
  {
    id: generateId("PROD"),
    name: "Steel Pipes (6 inch)",
    hsn: "7306",
    unit: "MTR",
    gstRate: 18,
    price: 500,
    stock: 1000,
    createdAt: getTodayString(),
  },
  {
    id: generateId("PROD"),
    name: "Industrial Bolts M12",
    hsn: "7318",
    unit: "PCS",
    gstRate: 18,
    price: 5,
    stock: 5000,
    createdAt: getTodayString(),
  },
  {
    id: generateId("PROD"),
    name: "Electric Cable (10mm)",
    hsn: "8544",
    unit: "MTR",
    gstRate: 18,
    price: 25,
    stock: 2000,
    createdAt: getTodayString(),
  },
];

// ============================================================================
// 5. MAIN APP COMPONENT
// ============================================================================

const ERPApp: React.FC = () => {
  // --- AUTHENTICATION ---
  const [user, setUser] = useState<User | null>(null);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // --- MAIN STATE ---
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);

  const [view, setView] = useState("dashboard");

  // --- LOAD/SAVE LOCALSTORAGE ---
  useEffect(() => {
    const loadedCustomers = JSON.parse(localStorage.getItem("customers") || "[]");
    const loadedVendors = JSON.parse(localStorage.getItem("vendors") || "[]");
    const loadedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const loadedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    const loadedPurchases = JSON.parse(localStorage.getItem("purchases") || "[]");
    const loadedPayments = JSON.parse(localStorage.getItem("payments") || "[]");
    const loadedQuotations = JSON.parse(localStorage.getItem("quotations") || "[]");
    const loadedJournal = JSON.parse(localStorage.getItem("journal") || "[]");
    const loadedActivity = JSON.parse(localStorage.getItem("activity") || "[]");

    setCustomers(loadedCustomers.length > 0 ? loadedCustomers : seedCustomers);
    setVendors(loadedVendors.length > 0 ? loadedVendors : seedVendors);
    setProducts(loadedProducts.length > 0 ? loadedProducts : seedProducts);
    setInvoices(loadedInvoices);
    setPurchases(loadedPurchases);
    setPayments(loadedPayments);
    setQuotations(loadedQuotations);
    setJournalEntries(loadedJournal);
    setActivityLog(loadedActivity);
  }, []);

  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem("vendors", JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem("purchases", JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem("payments", JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem("quotations", JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem("journal", JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem("activity", JSON.stringify(activityLog));
  }, [activityLog]);

  // --- ACTIVITY LOG HELPER ---
  const logActivity = (activity: string, module: string, details: string) => {
    const log: ActivityLog = {
      id: generateId("ACT"),
      timestamp: new Date().toISOString(),
      activity,
      user: user?.name || "System",
      module,
      details,
    };
    setActivityLog([log, ...activityLog]);
  };

  // --- LOGIN LOGIC ---
  const handleLogin = () => {
    if (loginUser === ADMIN_USER.username && loginPass === ADMIN_USER.password) {
      setUser(ADMIN_USER);
      logActivity("User logged in", "Authentication", `User: ${ADMIN_USER.name}`);
    } else {
      alert("Invalid credentials! Please use: Rahul Singh / Rahul@9675");
    }
  };

  const handleLogout = () => {
    logActivity("User logged out", "Authentication", `User: ${user?.name}`);
    setUser(null);
    setLoginUser("");
    setLoginPass("");
  };

  // ============================================================================
  // NAVIGATION SIDEBAR
  // ============================================================================

  const Sidebar = () => (
    <div className="w-64 flex-shrink-0 h-full bg-gray-800 text-white p-4 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-center">CHINKI TRADING</h1>
        <p className="text-xs text-center text-gray-400">ERP System</p>
      </div>

      <nav className="space-y-1">
        <button
          onClick={() => setView("dashboard")}
          className={`w-full text-left px-4 py-2 rounded transition ${
            view === "dashboard" ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          📊 Dashboard
        </button>

        <div className="pt-2">
          <p className="text-xs text-gray-400 px-4 py-1">MASTERS</p>
          <button
            onClick={() => setView("customers")}
            className={`w-full text-left px-4 py-2 rounded transition ${
              view === "customers" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            👥 Customers
          </button>
          <button
            onClick={() => setView("vendors")}
            className={`w-full text-left px-4 py-2 rounded transition ${
              view === "vendors" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            🏢 Vendors
          </button>
          <button
            onClick={() => setView("products")}
            className={`w-full text-left px-4 py-2 rounded transition ${
              view === "products" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            📦 Products
          </button>
        </div>

        <div className="pt-2">
          <p className="text-xs text-gray-400 px-4 py-1">SALES</p>
          <button
            onClick={() => setView("quotations")}
            className={`w-full text-left px-4 py-2 rounded transition ${
              view === "quotations" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            📋 Quotations
          </button>
          <button
            onClick={() => setView("invoices")}
            className={`w-full text-left px-4 py-2 rounded transition ${
              view === "invoices" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            📄 Sales Invoices
          </button>
        </div>

        <div className="pt-2">
          <p className="text-xs text-gray-400 px-4 py-1">PURCHASE</p>
          <button
            onClick={() => setView("purchases")}
            className={`w-full text-left px-4 py-2 rounded transition ${
              view === "purchases" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            🛒 Purchase Invoices
          </button>
        </div>

        <div className="pt-2">
          <p className="text-xs text-gray-400 px-4 py-1">ACCOUNTS</p>
          <button
            onClick={() => setView("payments")}
            className={`w-full text-left px-4 py-2 rounded transition ${
              view === "payments" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            💰 Payments
          </button>
          <button
            onClick={() => setView("journal")}
            className={`w-full text-left px-4 py-2 rounded transition ${
              view === "journal" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            📒 Journal
          </button>
        </div>

        <div className="pt-2">
          <p className="text-xs text-gray-400 px-4 py-1">REPORTS</p>
          <button
            onClick={() => setView("reports")}
            className={`w-full text-left px-4 py-2 rounded transition ${
              view === "reports" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            📈 Reports
          </button>
          <button
            onClick={() => setView("activity")}
            className={`w-full text-left px-4 py-2 rounded transition ${
              view === "activity" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            📝 Activity Log
          </button>
        </div>
      </nav>

      <div className="mt-6 pt-6 border-t border-gray-700">
        <p className="text-sm px-4 mb-2">Logged in as:</p>
        <p className="text-xs text-gray-400 px-4 mb-4">{user?.name}</p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );

  // ============================================================================
  // LOGIN PAGE
  // ============================================================================

  if (!user) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">CHINKI TRADING</h1>
            <p className="text-gray-600">ERP System Login</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                className="border border-gray-300 rounded-lg block px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                className="border border-gray-300 rounded-lg block px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg font-medium transition"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Financial Year: {currentFinancialYear()}</p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // DASHBOARD
  // ============================================================================

  const Dashboard = () => {
    const totalSales = invoices.filter(i => i.status !== "cancelled").reduce((sum, inv) => sum + inv.total, 0);
    const totalPurchases = purchases.reduce((sum, pur) => sum + pur.total, 0);
    const totalPayments = payments.reduce((sum, pay) => sum + pay.amount, 0);
    const pendingInvoices = invoices.filter(i => i.status === "issued").length;
    const recentInvoices = [...invoices].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

    return (
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
            <p className="text-sm opacity-90 mb-1">Total Customers</p>
            <p className="text-4xl font-bold">{customers.length}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
            <p className="text-sm opacity-90 mb-1">Total Sales</p>
            <p className="text-4xl font-bold">{formatCurrency(totalSales)}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
            <p className="text-sm opacity-90 mb-1">Total Purchases</p>
            <p className="text-4xl font-bold">{formatCurrency(totalPurchases)}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
            <p className="text-sm opacity-90 mb-1">Pending Invoices</p>
            <p className="text-4xl font-bold">{pendingInvoices}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Total Vendors</span>
                <span className="font-semibold">{vendors.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Total Products</span>
                <span className="font-semibold">{products.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Total Invoices</span>
                <span className="font-semibold">{invoices.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Total Payments</span>
                <span className="font-semibold">{formatCurrency(totalPayments)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Total Quotations</span>
                <span className="font-semibold">{quotations.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Invoices</h3>
            <div className="space-y-2">
              {recentInvoices.length === 0 ? (
                <p className="text-gray-500 text-sm">No invoices yet</p>
              ) : (
                recentInvoices.map((inv) => (
                  <div key={inv.id} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium text-sm">{inv.invoiceNo}</p>
                      <p className="text-xs text-gray-500">{inv.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{formatCurrency(inv.total)}</p>
                      <p className={`text-xs ${inv.status === "paid" ? "text-green-600" : "text-orange-600"}`}>
                        {inv.status.toUpperCase()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // CUSTOMER MANAGEMENT
  // ============================================================================

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");

  const CustomerManagement = () => {
    const [newCustomer, setNewCustomer] = useState<Customer>({
      id: "",
      name: "",
      gstin: "",
      state: "Haryana",
      stateCode: "06",
      address: "",
      email: "",
      phone: "",
      createdAt: getTodayString(),
    });

    const handleSaveCustomer = () => {
      if (!newCustomer.name || !newCustomer.gstin || !newCustomer.phone) {
        alert("Please fill in all required fields!");
        return;
      }

      if (editingCustomer) {
        setCustomers(customers.map((c) => (c.id === editingCustomer.id ? { ...newCustomer, id: editingCustomer.id } : c)));
        logActivity("Customer updated", "Customers", `Updated: ${newCustomer.name}`);
      } else {
        const customer = { ...newCustomer, id: generateId("CUST"), createdAt: getTodayString() };
        setCustomers([...customers, customer]);
        logActivity("Customer added", "Customers", `Added: ${newCustomer.name}`);
      }

      setShowAddCustomer(false);
      setEditingCustomer(null);
      setNewCustomer({
        id: "",
        name: "",
        gstin: "",
        state: "Haryana",
        stateCode: "06",
        address: "",
        email: "",
        phone: "",
        createdAt: getTodayString(),
      });
    };

    const handleEditCustomer = (customer: Customer) => {
      setEditingCustomer(customer);
      setNewCustomer(customer);
      setShowAddCustomer(true);
    };

    const handleDeleteCustomer = (id: string) => {
      if (window.confirm("Are you sure you want to delete this customer?")) {
        const customer = customers.find((c) => c.id === id);
        setCustomers(customers.filter((c) => c.id !== id));
        logActivity("Customer deleted", "Customers", `Deleted: ${customer?.name}`);
      }
    };

    const filteredCustomers = customers.filter((c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.gstin.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch)
    );

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Customer Master</h2>
          <button
            onClick={() => {
              setEditingCustomer(null);
              setNewCustomer({
                id: "",
                name: "",
                gstin: "",
                state: "Haryana",
                stateCode: "06",
                address: "",
                email: "",
                phone: "",
                createdAt: getTodayString(),
              });
              setShowAddCustomer(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            + Add Customer
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search customers by name, GSTIN, or phone..."
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GSTIN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{customer.gstin}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{customer.state}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{customer.phone}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleEditCustomer(customer)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <div className="text-center py-8 text-gray-500">No customers found</div>
          )}
        </div>

        {/* Add/Edit Customer Modal */}
        {showAddCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  {editingCustomer ? "Edit Customer" : "Add New Customer"}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN *</label>
                    <input
                      type="text"
                      placeholder="06XXXXXXXZ5Z6"
                      value={newCustomer.gstin}
                      onChange={(e) => setNewCustomer({ ...newCustomer, gstin: e.target.value.toUpperCase() })}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <select
                      value={newCustomer.state}
                      onChange={(e) => {
                        const state = GST_STATES.find((s) => s.name === e.target.value);
                        setNewCustomer({ ...newCustomer, state: e.target.value, stateCode: state?.code || "" });
                      }}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {GST_STATES.map((state) => (
                        <option key={state.code} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      placeholder="Full Address"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowAddCustomer(false);
                      setEditingCustomer(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCustomer}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================================================
  // VENDOR MANAGEMENT (Similar to Customer)
  // ============================================================================

  const [showAddVendor, setShowAddVendor] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [vendorSearch, setVendorSearch] = useState("");

  const VendorManagement = () => {
    const [newVendor, setNewVendor] = useState<Vendor>({
      id: "",
      name: "",
      gstin: "",
      state: "Haryana",
      stateCode: "06",
      address: "",
      email: "",
      phone: "",
      createdAt: getTodayString(),
    });

    const handleSaveVendor = () => {
      if (!newVendor.name || !newVendor.gstin || !newVendor.phone) {
        alert("Please fill in all required fields!");
        return;
      }

      if (editingVendor) {
        setVendors(vendors.map((v) => (v.id === editingVendor.id ? { ...newVendor, id: editingVendor.id } : v)));
        logActivity("Vendor updated", "Vendors", `Updated: ${newVendor.name}`);
      } else {
        const vendor = { ...newVendor, id: generateId("VEND"), createdAt: getTodayString() };
        setVendors([...vendors, vendor]);
        logActivity("Vendor added", "Vendors", `Added: ${newVendor.name}`);
      }

      setShowAddVendor(false);
      setEditingVendor(null);
      setNewVendor({
        id: "",
        name: "",
        gstin: "",
        state: "Haryana",
        stateCode: "06",
        address: "",
        email: "",
        phone: "",
        createdAt: getTodayString(),
      });
    };

    const handleEditVendor = (vendor: Vendor) => {
      setEditingVendor(vendor);
      setNewVendor(vendor);
      setShowAddVendor(true);
    };

    const handleDeleteVendor = (id: string) => {
      if (window.confirm("Are you sure you want to delete this vendor?")) {
        const vendor = vendors.find((v) => v.id === id);
        setVendors(vendors.filter((v) => v.id !== id));
        logActivity("Vendor deleted", "Vendors", `Deleted: ${vendor?.name}`);
      }
    };

    const filteredVendors = vendors.filter((v) =>
      v.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.gstin.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.phone.includes(vendorSearch)
    );

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Vendor Master</h2>
          <button
            onClick={() => {
              setEditingVendor(null);
              setNewVendor({
                id: "",
                name: "",
                gstin: "",
                state: "Haryana",
                stateCode: "06",
                address: "",
                email: "",
                phone: "",
                createdAt: getTodayString(),
              });
              setShowAddVendor(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            + Add Vendor
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search vendors by name, GSTIN, or phone..."
            value={vendorSearch}
            onChange={(e) => setVendorSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GSTIN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{vendor.name}</p>
                    <p className="text-sm text-gray-500">{vendor.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{vendor.gstin}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{vendor.state}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{vendor.phone}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleEditVendor(vendor)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteVendor(vendor.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredVendors.length === 0 && (
            <div className="text-center py-8 text-gray-500">No vendors found</div>
          )}
        </div>

        {/* Add/Edit Vendor Modal */}
        {showAddVendor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  {editingVendor ? "Edit Vendor" : "Add New Vendor"}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={newVendor.name}
                      onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN *</label>
                    <input
                      type="text"
                      placeholder="06XXXXXXXZ5Z6"
                      value={newVendor.gstin}
                      onChange={(e) => setNewVendor({ ...newVendor, gstin: e.target.value.toUpperCase() })}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <select
                      value={newVendor.state}
                      onChange={(e) => {
                        const state = GST_STATES.find((s) => s.name === e.target.value);
                        setNewVendor({ ...newVendor, state: e.target.value, stateCode: state?.code || "" });
                      }}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {GST_STATES.map((state) => (
                        <option key={state.code} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      placeholder="Full Address"
                      value={newVendor.address}
                      onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={newVendor.email}
                      onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={newVendor.phone}
                      onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowAddVendor(false);
                      setEditingVendor(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveVendor}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================================================
  // PRODUCT/INVENTORY MANAGEMENT
  // ============================================================================

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState("");

  const ProductManagement = () => {
    const [newProduct, setNewProduct] = useState<Product>({
      id: "",
      name: "",
      hsn: "",
      unit: "PCS",
      gstRate: 18,
      price: 0,
      stock: 0,
      createdAt: getTodayString(),
    });

    const handleSaveProduct = () => {
      if (!newProduct.name || !newProduct.hsn || newProduct.price <= 0) {
        alert("Please fill in all required fields!");
        return;
      }

      if (editingProduct) {
        setProducts(products.map((p) => (p.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } : p)));
        logActivity("Product updated", "Products", `Updated: ${newProduct.name}`);
      } else {
        const product = { ...newProduct, id: generateId("PROD"), createdAt: getTodayString() };
        setProducts([...products, product]);
        logActivity("Product added", "Products", `Added: ${newProduct.name}`);
      }

      setShowAddProduct(false);
      setEditingProduct(null);
      setNewProduct({
        id: "",
        name: "",
        hsn: "",
        unit: "PCS",
        gstRate: 18,
        price: 0,
        stock: 0,
        createdAt: getTodayString(),
      });
    };

    const handleEditProduct = (product: Product) => {
      setEditingProduct(product);
      setNewProduct(product);
      setShowAddProduct(true);
    };

    const handleDeleteProduct = (id: string) => {
      if (window.confirm("Are you sure you want to delete this product?")) {
        const product = products.find((p) => p.id === id);
        setProducts(products.filter((p) => p.id !== id));
        logActivity("Product deleted", "Products", `Deleted: ${product?.name}`);
      }
    };

    const filteredProducts = products.filter((p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.hsn.includes(productSearch)
    );

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Product Master</h2>
          <button
            onClick={() => {
              setEditingProduct(null);
              setNewProduct({
                id: "",
                name: "",
                hsn: "",
                unit: "PCS",
                gstRate: 18,
                price: 0,
                stock: 0,
                createdAt: getTodayString(),
              });
              setShowAddProduct(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            + Add Product
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products by name or HSN..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">HSN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GST %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.hsn}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.unit}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.gstRate}%</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.stock}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">No products found</div>
          )}
        </div>

        {/* Add/Edit Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">HSN Code *</label>
                    <input
                      type="text"
                      placeholder="7306"
                      value={newProduct.hsn}
                      onChange={(e) => setNewProduct({ ...newProduct, hsn: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                    <select
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PCS">PCS (Pieces)</option>
                      <option value="KG">KG (Kilograms)</option>
                      <option value="MTR">MTR (Meters)</option>
                      <option value="LTR">LTR (Liters)</option>
                      <option value="BOX">BOX</option>
                      <option value="SET">SET</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GST Rate (%) *</label>
                    <select
                      value={newProduct.gstRate}
                      onChange={(e) => setNewProduct({ ...newProduct, gstRate: Number(e.target.value) })}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>0%</option>
                      <option value={5}>5%</option>
                      <option value={12}>12%</option>
                      <option value={18}>18%</option>
                      <option value={28}>28%</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Opening Stock</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowAddProduct(false);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================================================
  // QUOTATION MANAGEMENT
  // ============================================================================

  const [showAddQuotation, setShowAddQuotation] = useState(false);

  const QuotationManagement = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Quotations</h2>
          <button
            onClick={() => setShowAddQuotation(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            + New Quotation
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quotation No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quotations.map((quotation) => (
                <tr key={quotation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{quotation.quotationNo}</td>
                  <td className="px-6 py-4 text-sm">{quotation.customerName}</td>
                  <td className="px-6 py-4 text-sm">{formatDate(quotation.date)}</td>
                  <td className="px-6 py-4 text-sm">{formatCurrency(quotation.total)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      quotation.status === "accepted" ? "bg-green-100 text-green-800" :
                      quotation.status === "sent" ? "bg-blue-100 text-blue-800" :
                      quotation.status === "rejected" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {quotation.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">View</button>
                    <button className="text-green-600 hover:text-green-800">Print</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {quotations.length === 0 && (
            <div className="text-center py-8 text-gray-500">No quotations created yet</div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // SALES INVOICE MANAGEMENT
  // ============================================================================

  const [showAddInvoice, setShowAddInvoice] = useState(false);

  const InvoiceManagement = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sales Invoices</h2>
          <button
            onClick={() => setShowAddInvoice(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            + New Invoice
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{invoice.invoiceNo}</td>
                  <td className="px-6 py-4 text-sm">{invoice.customerName}</td>
                  <td className="px-6 py-4 text-sm">{formatDate(invoice.date)}</td>
                  <td className="px-6 py-4 text-sm">{formatCurrency(invoice.total)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      invoice.status === "paid" ? "bg-green-100 text-green-800" :
                      invoice.status === "issued" ? "bg-blue-100 text-blue-800" :
                      invoice.status === "cancelled" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">View</button>
                    <button className="text-green-600 hover:text-green-800">Print</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {invoices.length === 0 && (
            <div className="text-center py-8 text-gray-500">No invoices created yet</div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // PURCHASE MANAGEMENT
  // ============================================================================

  const [showAddPurchase, setShowAddPurchase] = useState(false);

  const PurchaseManagement = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Purchase Invoices</h2>
          <button
            onClick={() => setShowAddPurchase(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            + New Purchase
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purchase No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{purchase.purchaseNo}</td>
                  <td className="px-6 py-4 text-sm">{purchase.vendorName}</td>
                  <td className="px-6 py-4 text-sm">{formatDate(purchase.date)}</td>
                  <td className="px-6 py-4 text-sm">{formatCurrency(purchase.total)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                      {purchase.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-blue-600 hover:text-blue-800">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {purchases.length === 0 && (
            <div className="text-center py-8 text-gray-500">No purchases recorded yet</div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // PAYMENT MANAGEMENT
  // ============================================================================

  const [showAddPayment, setShowAddPayment] = useState(false);

  const PaymentManagement = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Payment Records</h2>
          <button
            onClick={() => setShowAddPayment(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            + Record Payment
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{payment.paymentNo}</td>
                  <td className="px-6 py-4 text-sm">{payment.invoiceNo}</td>
                  <td className="px-6 py-4 text-sm">{payment.customerName}</td>
                  <td className="px-6 py-4 text-sm">{formatDate(payment.date)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">{formatCurrency(payment.amount)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                      {payment.mode}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && (
            <div className="text-center py-8 text-gray-500">No payments recorded yet</div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // JOURNAL
  // ============================================================================

  const JournalView = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Journal Entries</h2>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entry No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Debit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {journalEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{entry.entryNo}</td>
                  <td className="px-6 py-4 text-sm">{formatDate(entry.date)}</td>
                  <td className="px-6 py-4 text-sm capitalize">{entry.type}</td>
                  <td className="px-6 py-4 text-sm">{entry.description}</td>
                  <td className="px-6 py-4 text-sm text-red-600">{entry.debit > 0 ? formatCurrency(entry.debit) : "-"}</td>
                  <td className="px-6 py-4 text-sm text-green-600">{entry.credit > 0 ? formatCurrency(entry.credit) : "-"}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{formatCurrency(entry.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {journalEntries.length === 0 && (
            <div className="text-center py-8 text-gray-500">No journal entries yet</div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // REPORTS
  // ============================================================================

  const ReportsView = () => {
    const [reportType, setReportType] = useState("sales");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState(getTodayString());

    const totalSales = invoices.filter(i => i.status !== "cancelled").reduce((sum, inv) => sum + inv.total, 0);
    const totalPurchases = purchases.reduce((sum, pur) => sum + pur.total, 0);
    const totalPayments = payments.reduce((sum, pay) => sum + pay.amount, 0);
    const pendingAmount = totalSales - totalPayments;

    const totalGST = invoices.reduce((sum, inv) => sum + inv.cgst + inv.sgst + inv.igst, 0);

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Reports & Analytics</h2>

        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sales">Sales Report</option>
                <option value="purchase">Purchase Report</option>
                <option value="gst">GST Report</option>
                <option value="profit">Profit & Loss</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
            Generate Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-1">Total Sales</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSales)}</p>
            <p className="text-xs text-gray-500 mt-1">{invoices.length} invoices</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-1">Total Purchases</p>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalPurchases)}</p>
            <p className="text-xs text-gray-500 mt-1">{purchases.length} purchases</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-1">Total GST Collected</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalGST)}</p>
            <p className="text-xs text-gray-500 mt-1">All invoices</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-1">Pending Amount</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(pendingAmount)}</p>
            <p className="text-xs text-gray-500 mt-1">Receivables</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Total Customers</span>
              <span className="font-semibold">{customers.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Total Vendors</span>
              <span className="font-semibold">{vendors.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Total Products</span>
              <span className="font-semibold">{products.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Total Payments Received</span>
              <span className="font-semibold">{formatCurrency(totalPayments)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Gross Profit</span>
              <span className="font-semibold text-green-600">{formatCurrency(totalSales - totalPurchases)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // ACTIVITY LOG
  // ============================================================================

  const ActivityLogView = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Activity Log</h2>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activityLog.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">
                    {new Date(log.timestamp).toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-sm">{log.user}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                      {log.module}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{log.activity}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {activityLog.length === 0 && (
            <div className="text-center py-8 text-gray-500">No activity recorded yet</div>
          )}
        </div>
      </div>
    );
  };

  // Main content view switcher
  let content;
  switch (view) {
    case "dashboard":
      content = <Dashboard />;
      break;
    case "customers":
      content = <CustomerManagement />;
      break;
    case "vendors":
      content = <VendorManagement />;
      break;
    case "products":
      content = <ProductManagement />;
      break;
    case "quotations":
      content = <QuotationManagement />;
      break;
    case "invoices":
      content = <InvoiceManagement />;
      break;
    case "purchases":
      content = <PurchaseManagement />;
      break;
    case "payments":
      content = <PaymentManagement />;
      break;
    case "journal":
      content = <JournalView />;
      break;
    case "reports":
      content = <ReportsView />;
      break;
    case "activity":
      content = <ActivityLogView />;
      break;
    default:
      content = <Dashboard />;
  }

  // Root Layout
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">{content}</main>
    </div>
  );
};

export default ERPApp;
