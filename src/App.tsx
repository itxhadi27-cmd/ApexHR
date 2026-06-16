import { useState, useMemo, useReducer, useEffect, useRef } from "react";
import { useDisableInspect } from "./useDisableInspect";
import AuthPage from "./AuthPage";

// ─── DATA SEED ──────────────────────────────────────────────────────────────
const CURRENCIES = {
  USD: { symbol: "$", rate: 1 },
  PKR: { symbol: "₨", rate: 278 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.79 },
  AED: { symbol: "د.إ", rate: 3.67 },
  SAR: { symbol: "﷼", rate: 3.75 },
  CAD: { symbol: "CA$", rate: 1.36 },
  AUD: { symbol: "A$", rate: 1.53 },
};

const DEPARTMENTS = ["Engineering", "Design", "Product", "Sales", "HR", "Finance", "DevOps", "QA", "Marketing"];
const ROLES = ["Junior", "Mid", "Senior", "Lead", "Manager", "Director", "VP", "C-Level"];
const SKILLS_POOL = ["React", "Node.js", "Python", "Java", "AWS", "Docker", "Figma", "SQL", "TypeScript", "Go", "Kotlin", "Swift", "GraphQL", "Kubernetes", "PostgreSQL", "MongoDB"];
const COUNTRIES = ["Pakistan", "United States", "United Kingdom", "UAE", "Canada", "Germany", "Australia", "India", "Netherlands", "Singapore"];
const LEAVE_TYPES = ["Annual", "Sick", "Unpaid", "Maternity/Paternity", "Emergency", "Public Holiday"];
const LEAVE_STATUS = ["Pending", "Approved", "Rejected"];

const SEED_EMPLOYEES = [
  { id: "e1", name: "Aisha Khan", email: "aisha@apexhr.io", department: "Engineering", role: "Senior", country: "Pakistan", currency: "PKR", salaryUSD: 2200, joinedAt: "2022-03-15", skills: ["React", "TypeScript", "Node.js"], status: "Active", leaveBalance: 18, avatar: "AK" },
  { id: "e2", name: "James Thornton", email: "james@apexhr.io", department: "Product", role: "Director", country: "United Kingdom", currency: "GBP", salaryUSD: 9500, joinedAt: "2020-07-01", skills: ["SQL", "Python", "AWS"], status: "Active", leaveBalance: 22, avatar: "JT" },
  { id: "e3", name: "Sara Malik", email: "sara@apexhr.io", department: "HR", role: "Manager", country: "Pakistan", currency: "PKR", salaryUSD: 1800, joinedAt: "2021-09-21", skills: ["SQL", "Python"], status: "Active", leaveBalance: 14, avatar: "SM" },
  { id: "e4", name: "Diego Ramirez", email: "diego@apexhr.io", department: "Engineering", role: "Lead", country: "United States", currency: "USD", salaryUSD: 11000, joinedAt: "2019-11-05", skills: ["Go", "Kubernetes", "Docker"], status: "Active", leaveBalance: 20, avatar: "DR" },
  { id: "e5", name: "Mei Lin", email: "mei@apexhr.io", department: "Design", role: "Senior", country: "Singapore", currency: "USD", salaryUSD: 7500, joinedAt: "2023-01-10", skills: ["Figma", "React"], status: "Active", leaveBalance: 16, avatar: "ML" },
  { id: "e6", name: "Bilal Ahmed", email: "bilal@apexhr.io", department: "DevOps", role: "Mid", country: "UAE", currency: "AED", salaryUSD: 3800, joinedAt: "2022-06-20", skills: ["AWS", "Docker", "Kubernetes"], status: "Active", leaveBalance: 12, avatar: "BA" },
  { id: "e7", name: "Priya Sharma", email: "priya@apexhr.io", department: "QA", role: "Senior", country: "India", currency: "USD", salaryUSD: 4200, joinedAt: "2021-04-08", skills: ["Python", "SQL", "PostgreSQL"], status: "Active", leaveBalance: 19, avatar: "PS" },
  { id: "e8", name: "Lukas Becker", email: "lukas@apexhr.io", department: "Engineering", role: "Junior", country: "Germany", currency: "EUR", salaryUSD: 5500, joinedAt: "2023-09-01", skills: ["Java", "Spring", "PostgreSQL"], status: "On Leave", leaveBalance: 8, avatar: "LB" },
  { id: "e9", name: "Fatima Al-Rashid", email: "fatima@apexhr.io", department: "Sales", role: "VP", country: "UAE", currency: "AED", salaryUSD: 14000, joinedAt: "2018-02-14", skills: ["SQL", "Python"], status: "Active", leaveBalance: 25, avatar: "FA" },
  { id: "e10", name: "Chen Wei", email: "chen@apexhr.io", department: "Engineering", role: "Mid", country: "Singapore", currency: "USD", salaryUSD: 6800, joinedAt: "2022-11-15", skills: ["TypeScript", "React", "GraphQL"], status: "Active", leaveBalance: 15, avatar: "CW" },
];

const SEED_LEAVES = [
  { id: "l1", employeeId: "e1", type: "Annual", from: "2024-12-23", to: "2024-12-27", days: 5, status: "Approved", reason: "Family vacation" },
  { id: "l2", employeeId: "e3", type: "Sick", from: "2024-11-14", to: "2024-11-15", days: 2, status: "Approved", reason: "Flu" },
  { id: "l3", employeeId: "e8", type: "Annual", from: "2024-12-02", to: "2024-12-20", days: 18, status: "Approved", reason: "Extended holiday" },
  { id: "l4", employeeId: "e2", type: "Emergency", from: "2024-12-10", to: "2024-12-11", days: 2, status: "Approved", reason: "Personal emergency" },
  { id: "l5", employeeId: "e5", type: "Annual", from: "2025-01-06", to: "2025-01-10", days: 5, status: "Pending", reason: "Chinese New Year travel" },
  { id: "l6", employeeId: "e7", type: "Maternity/Paternity", from: "2025-02-01", to: "2025-05-01", days: 90, status: "Pending", reason: "Maternity leave" },
];

const SEED_ATTENDANCE = (() => {
  const records = [];
  const today = new Date();
  SEED_EMPLOYEES.slice(0, 7).forEach(emp => {
    for (let d = 1; d <= 20; d++) {
      const date = new Date(today.getFullYear(), today.getMonth(), d);
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      if (date > today) continue;
      const checkIn = `0${8 + Math.floor(Math.random() * 2)}:${Math.random() > 0.5 ? "00" : "30"}`.replace(/^0(\d{2})/, "$1");
      const checkOut = `${17 + Math.floor(Math.random() * 3)}:${Math.random() > 0.5 ? "00" : "30"}`;
      records.push({ id: `att_${emp.id}_${d}`, employeeId: emp.id, date: date.toISOString().slice(0, 10), checkIn, checkOut, status: Math.random() > 0.1 ? "Present" : "Late" });
    }
  });
  return records;
})();

// ─── HELPERS ────────────────────────────────────────────────────────────────
const fmt = (usd, currency = "USD") => {
  const c = CURRENCIES[currency] || CURRENCIES.USD;
  const val = usd * c.rate;
  if (val >= 1000) return `${c.symbol}${(val / 1000).toFixed(1)}k`;
  return `${c.symbol}${Math.round(val).toLocaleString()}`;
};
const fmtFull = (usd, currency = "USD") => {
  const c = CURRENCIES[currency] || CURRENCIES.USD;
  return `${c.symbol}${Math.round(usd * c.rate).toLocaleString()}`;
};
const calcTax = (usd) => {
  const brackets = [[0, 25000, 0], [25000, 75000, 0.12], [75000, 150000, 0.22], [150000, Infinity, 0.32]];
  let tax = 0;
  const annual = usd * 12;
  for (const [lo, hi, rate] of brackets) {
    if (annual <= lo) break;
    tax += (Math.min(annual, hi) - lo) * rate;
  }
  return tax / 12;
};
const daysWorked = (joinedAt) => {
  return Math.floor((Date.now() - new Date(joinedAt)) / 86400000);
};
const avatarColor = (name) => {
  const colors = ["#4F46E5","#0891B2","#059669","#D97706","#DC2626","#7C3AED","#DB2777","#2563EB"];
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) % colors.length;
  return colors[h];
};

// ─── STATE ──────────────────────────────────────────────────────────────────
const initialState = {
  employees: SEED_EMPLOYEES,
  leaves: SEED_LEAVES,
  attendance: SEED_ATTENDANCE,
  displayCurrency: "USD",
  notifications: [
    { id: 1, text: "Priya Sharma submitted a maternity leave request", time: "2m ago", read: false },
    { id: 2, text: "Mei Lin's leave request is pending approval", time: "1h ago", read: false },
    { id: 3, text: "Monthly payroll run due in 3 days", time: "2h ago", read: true },
    { id: 4, text: "Lukas Becker returns from leave Dec 20", time: "1d ago", read: true },
  ],
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_EMPLOYEE": return { ...state, employees: [...state.employees, action.payload] };
    case "UPDATE_EMPLOYEE": return { ...state, employees: state.employees.map(e => e.id === action.payload.id ? action.payload : e) };
    case "DELETE_EMPLOYEE": return { ...state, employees: state.employees.filter(e => e.id !== action.id) };
    case "UPDATE_LEAVE": return { ...state, leaves: state.leaves.map(l => l.id === action.payload.id ? action.payload : l) };
    case "ADD_LEAVE": return { ...state, leaves: [...state.leaves, action.payload] };
    case "SET_CURRENCY": return { ...state, displayCurrency: action.currency };
    case "MARK_NOTIFS_READ": return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };
    default: return state;
  }
}

// ─── UI COMPONENTS ──────────────────────────────────────────────────────────
const Avatar = ({ name, size = 36, email }) => {
  const bg = avatarColor(name);
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33, fontWeight: 500, color: "#fff", flexShrink: 0 }}>
      {initials}
    </div>
  );
};

const Badge = ({ children, type = "default" }) => {
  const styles = {
    default: { bg: "#f1f5f9", color: "#475569" },
    success: { bg: "#dcfce7", color: "#166534" },
    warning: { bg: "#fef9c3", color: "#854d0e" },
    danger: { bg: "#fee2e2", color: "#991b1b" },
    info: { bg: "#dbeafe", color: "#1e40af" },
    purple: { bg: "#ede9fe", color: "#5b21b6" },
  };
  const s = styles[type] || styles.default;
  return <span style={{ background: s.bg, color: s.color, padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" }}>{children}</span>;
};

const Modal = ({ title, onClose, children, wide }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div style={{ background: "#fff", borderRadius: 12, padding: 24, width: "100%", maxWidth: wide ? 700 : 500, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{title}</h3>
        <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: "#6b7280", lineHeight: 1 }}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", fontSize: 12, color: "#6b7280", marginBottom: 4, fontWeight: 500 }}>{label}</label>}
    <input style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, boxSizing: "border-box", outline: "none", fontFamily: "inherit" }} {...props} />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", fontSize: 12, color: "#6b7280", marginBottom: 4, fontWeight: 500 }}>{label}</label>}
    <select style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, boxSizing: "border-box", background: "#fff", fontFamily: "inherit" }} {...props}>{children}</select>
  </div>
);

const Btn = ({ children, onClick, variant = "primary", small, disabled, style: extraStyle }) => {
  const base = { border: "none", borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer", fontWeight: 500, fontFamily: "inherit", transition: "opacity .15s", opacity: disabled ? 0.5 : 1, ...extraStyle };
  const variants = {
    primary: { background: "#4F46E5", color: "#fff", padding: small ? "5px 12px" : "9px 18px", fontSize: small ? 12 : 14 },
    secondary: { background: "#f1f5f9", color: "#374151", padding: small ? "5px 12px" : "9px 18px", fontSize: small ? 12 : 14 },
    danger: { background: "#fee2e2", color: "#991b1b", padding: small ? "5px 12px" : "9px 18px", fontSize: small ? 12 : 14 },
    ghost: { background: "transparent", color: "#6b7280", padding: small ? "5px 10px" : "9px 14px", fontSize: small ? 12 : 14, border: "1px solid #e5e7eb" },
    success: { background: "#dcfce7", color: "#166534", padding: small ? "5px 12px" : "9px 18px", fontSize: small ? 12 : 14 },
  };
  return <button disabled={disabled} onClick={onClick} style={{ ...base, ...variants[variant] }}>{children}</button>;
};

const StatCard = ({ label, value, sub, color = "#4F46E5" }) => (
  <div style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
    <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1.1 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{sub}</div>}
  </div>
);

// ─── DASHBOARD ──────────────────────────────────────────────────────────────
function Dashboard({ state, dispatch }) {
  const { employees, leaves, attendance, displayCurrency } = state;
  const active = employees.filter(e => e.status === "Active").length;
  const onLeave = employees.filter(e => e.status === "On Leave").length;
  const totalPayroll = employees.reduce((s, e) => s + e.salaryUSD, 0);
  const pendingLeaves = leaves.filter(l => l.status === "Pending").length;
  const deptBreakdown = DEPARTMENTS.map(d => ({ dept: d, count: employees.filter(e => e.department === d).length })).filter(x => x.count > 0).sort((a, b) => b.count - a.count);
  const recentLeaves = leaves.slice(-4).reverse();
  const countryBreakdown = [...new Set(employees.map(e => e.country))].map(c => ({ country: c, count: employees.filter(e => e.country === c).length }));

  return (
    <div>
      <div className="grid-stats">
        <StatCard label="Total Employees" value={employees.length} sub={`${active} active · ${onLeave} on leave`} color="#4F46E5" />
        <StatCard label="Monthly Payroll" value={fmt(totalPayroll, displayCurrency)} sub="Gross total" color="#0891B2" />
        <StatCard label="Pending Leaves" value={pendingLeaves} sub="Awaiting approval" color="#D97706" />
        <StatCard label="Departments" value={deptBreakdown.length} sub="Across the org" color="#059669" />
        <StatCard label="Countries" value={countryBreakdown.length} sub="Global presence" color="#7C3AED" />
      </div>

      <div className="grid-2">
        <div style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 12, padding: 20 }}>
          <h4 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600 }}>Headcount by Department</h4>
          {deptBreakdown.map(({ dept, count }) => (
            <div key={dept} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: "#374151" }}>{dept}</span>
                <span style={{ color: "#6b7280", fontWeight: 500 }}>{count}</span>
              </div>
              <div style={{ height: 6, background: "#f1f5f9", borderRadius: 99 }}>
                <div style={{ height: "100%", background: "#4F46E5", borderRadius: 99, width: `${(count / employees.length) * 100}%`, transition: "width .5s" }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 12, padding: 20 }}>
          <h4 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600 }}>Global Distribution</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {countryBreakdown.map(({ country, count }) => (
              <div key={country} style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 12px", fontSize: 13 }}>
                <span style={{ color: "#374151" }}>{country}</span>
                <span style={{ color: "#4F46E5", marginLeft: 6, fontWeight: 600 }}>{count}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <h5 style={{ margin: "0 0 10px", fontSize: 13, color: "#6b7280", fontWeight: 500 }}>Payroll by Currency</h5>
            {Object.keys(CURRENCIES).filter(c => employees.some(e => e.currency === c)).map(curr => {
              const total = employees.filter(e => e.currency === curr).reduce((s, e) => s + e.salaryUSD, 0);
              return (
                <div key={curr} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "3px 0" }}>
                  <span style={{ color: "#374151" }}>{curr}</span>
                  <span style={{ color: "#059669", fontWeight: 500 }}>{fmtFull(total, curr)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 12, padding: 20 }}>
        <h4 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 600 }}>Recent Leave Requests</h4>
        {recentLeaves.map(l => {
          const emp = employees.find(e => e.id === l.employeeId);
          if (!emp) return null;
          const statusType = l.status === "Approved" ? "success" : l.status === "Rejected" ? "danger" : "warning";
          return (
            <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
              <Avatar name={emp.name} size={32} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{emp.name}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{l.type} · {l.days} day{l.days > 1 ? "s" : ""} · {l.from}</div>
              </div>
              <Badge type={statusType}>{l.status}</Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── EMPLOYEES PANEL ────────────────────────────────────────────────────────
function EmployeesPanel({ state, dispatch }) {
  const { employees, displayCurrency } = state;
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [editEmp, setEditEmp] = useState(null);
  const [viewEmp, setViewEmp] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", department: "Engineering", role: "Mid", country: "Pakistan", currency: "PKR", salaryUSD: "", skills: [], status: "Active" });

  const filtered = useMemo(() => employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "All" || e.department === deptFilter;
    const matchStatus = statusFilter === "All" || e.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  }), [employees, search, deptFilter, statusFilter]);

  const openAdd = () => { setForm({ name: "", email: "", department: "Engineering", role: "Mid", country: "Pakistan", currency: "PKR", salaryUSD: "", skills: [], status: "Active" }); setEditEmp(null); setShowAdd(true); };
  const openEdit = (e) => { setForm({ ...e }); setEditEmp(e); setShowAdd(true); };

  const save = () => {
    if (!form.name || !form.salaryUSD) return;
    if (editEmp) {
      dispatch({ type: "UPDATE_EMPLOYEE", payload: { ...form, salaryUSD: Number(form.salaryUSD) } });
    } else {
      dispatch({ type: "ADD_EMPLOYEE", payload: { ...form, id: "e" + Date.now(), joinedAt: new Date().toISOString().slice(0, 10), leaveBalance: 21, salaryUSD: Number(form.salaryUSD) } });
    }
    setShowAdd(false);
  };

  const statusType = (s) => s === "Active" ? "success" : s === "On Leave" ? "warning" : "default";

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees…" style={{ flex: 1, minWidth: 180, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, fontFamily: "inherit" }} />
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontFamily: "inherit" }}>
          <option>All</option>
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontFamily: "inherit" }}>
          <option>All</option>
          <option>Active</option>
          <option>On Leave</option>
          <option>Terminated</option>
        </select>
        <Btn onClick={openAdd}>+ Add Employee</Btn>
      </div>

      <div className="table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Employee</th>
              <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Department</th>
              <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Role</th>
              <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Country</th>
              <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, color: "#374151" }}>Salary/mo</th>
              <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Status</th>
              <th style={{ padding: "10px 12px" }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp, i) => (
              <tr key={emp.id} style={{ borderBottom: "1px solid #f8fafc", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={emp.name} size={32} />
                    <div>
                      <div style={{ fontWeight: 500, color: "#111827" }}>{emp.name}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px" }}><Badge type="info">{emp.department}</Badge></td>
                <td style={{ padding: "12px", color: "#6b7280" }}>{emp.role}</td>
                <td style={{ padding: "12px", color: "#6b7280" }}>{emp.country}</td>
                <td style={{ padding: "12px", textAlign: "right", fontWeight: 600, color: "#059669" }}>{fmt(emp.salaryUSD, displayCurrency)}</td>
                <td style={{ padding: "12px" }}><Badge type={statusType(emp.status)}>{emp.status}</Badge></td>
                <td style={{ padding: "12px", textAlign: "right" }}>
                  <span style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                    <Btn small variant="ghost" onClick={() => setViewEmp(emp)}>View</Btn>
                    <Btn small variant="secondary" onClick={() => openEdit(emp)}>Edit</Btn>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No employees match your filters.</div>}
      </div>

      {showAdd && (
        <Modal title={editEmp ? "Edit Employee" : "Add Employee"} onClose={() => setShowAdd(false)} wide>
          <div className="grid-form-2">
            <Input label="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Aisha Khan" />
            <Input label="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="aisha@company.io" type="email" />
            <Select label="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </Select>
            <Select label="Role Level" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </Select>
            <Select label="Country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </Select>
            <Select label="Pay Currency" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
              {Object.keys(CURRENCIES).map(c => <option key={c}>{c}</option>)}
            </Select>
            <Input label="Monthly Salary (USD) *" value={form.salaryUSD} onChange={e => setForm({ ...form, salaryUSD: e.target.value })} placeholder="5000" type="number" />
            <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option>Active</option><option>On Leave</option><option>Terminated</option>
            </Select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, color: "#6b7280", marginBottom: 6, fontWeight: 500 }}>Skills</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {SKILLS_POOL.map(skill => {
                const active = (form.skills || []).includes(skill);
                return (
                  <button key={skill} onClick={() => setForm({ ...form, skills: active ? form.skills.filter(s => s !== skill) : [...(form.skills || []), skill] })}
                    style={{ padding: "4px 10px", borderRadius: 99, fontSize: 12, border: `1px solid ${active ? "#4F46E5" : "#e5e7eb"}`, background: active ? "#ede9fe" : "#fff", color: active ? "#4F46E5" : "#6b7280", cursor: "pointer", fontFamily: "inherit" }}>
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn onClick={save} disabled={!form.name || !form.salaryUSD}>{editEmp ? "Save Changes" : "Add Employee"}</Btn>
          </div>
        </Modal>
      )}

      {viewEmp && (
        <Modal title="Employee Profile" onClose={() => setViewEmp(null)} wide>
          <div style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "center" }}>
            <Avatar name={viewEmp.name} size={56} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{viewEmp.name}</div>
              <div style={{ color: "#6b7280", fontSize: 13 }}>{viewEmp.email}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                <Badge type="info">{viewEmp.department}</Badge>
                <Badge type="purple">{viewEmp.role}</Badge>
                <Badge type={statusType(viewEmp.status)}>{viewEmp.status}</Badge>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              ["Country", viewEmp.country],
              ["Joined", viewEmp.joinedAt],
              ["Days Worked", daysWorked(viewEmp.joinedAt).toLocaleString()],
              ["Leave Balance", `${viewEmp.leaveBalance} days`],
              ["Monthly Salary", fmtFull(viewEmp.salaryUSD, viewEmp.currency)],
              ["Tax Est.", fmtFull(calcTax(viewEmp.salaryUSD), viewEmp.currency) + "/mo"],
              ["Net Est.", fmtFull(viewEmp.salaryUSD - calcTax(viewEmp.salaryUSD), viewEmp.currency) + "/mo"],
              ["Currency", viewEmp.currency],
            ].map(([k, v]) => (
              <div key={k} style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{v}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>Skills</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(viewEmp.skills || []).map(s => <Badge key={s} type="info">{s}</Badge>)}
              {(viewEmp.skills || []).length === 0 && <span style={{ color: "#9ca3af", fontSize: 13 }}>No skills listed</span>}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PAYROLL PANEL ──────────────────────────────────────────────────────────
function PayrollPanel({ state, dispatch }) {
  const { employees, displayCurrency } = state;
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [viewPayslip, setViewPayslip] = useState(null);

  const payrolls = useMemo(() => employees.map(e => {
    const tax = calcTax(e.salaryUSD);
    const benefits = e.salaryUSD * 0.05;
    const bonus = e.role === "C-Level" ? e.salaryUSD * 0.2 : e.role === "Director" || e.role === "VP" ? e.salaryUSD * 0.12 : e.salaryUSD * 0.06;
    const net = e.salaryUSD - tax + benefits;
    return { ...e, tax, benefits, bonus, net };
  }), [employees]);

  const filtered = useMemo(() => payrolls.filter(p => {
    return (p.name.toLowerCase().includes(search.toLowerCase())) && (deptFilter === "All" || p.department === deptFilter);
  }), [payrolls, search, deptFilter]);

  const totals = filtered.reduce((a, p) => ({ gross: a.gross + p.salaryUSD, tax: a.tax + p.tax, net: a.net + p.net }), { gross: 0, tax: 0, net: 0 });

  return (
    <div>
      <div className="grid-3">
        <StatCard label="Total Gross" value={fmt(totals.gross, displayCurrency)} sub={`${filtered.length} employees`} color="#4F46E5" />
        <StatCard label="Total Tax" value={fmt(totals.tax, displayCurrency)} sub="Est. income tax" color="#DC2626" />
        <StatCard label="Total Net" value={fmt(totals.net, displayCurrency)} sub="Take-home" color="#059669" />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" style={{ flex: 1, minWidth: 160, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, fontFamily: "inherit" }} />
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontFamily: "inherit" }}>
          <option>All</option>
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div className="table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Employee</th>
              <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Dept</th>
              <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, color: "#374151" }}>Gross</th>
              <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, color: "#374151" }}>Tax</th>
              <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, color: "#374151" }}>Benefits</th>
              <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, color: "#374151" }}>Net</th>
              <th style={{ padding: "10px 12px" }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f8fafc", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={p.name} size={28} />
                    <div>
                      <div style={{ fontWeight: 500 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{p.currency}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px" }}><Badge type="info">{p.department}</Badge></td>
                <td style={{ padding: "12px", textAlign: "right", fontWeight: 500 }}>{fmt(p.salaryUSD, displayCurrency)}</td>
                <td style={{ padding: "12px", textAlign: "right", color: "#DC2626" }}>{fmt(p.tax, displayCurrency)}</td>
                <td style={{ padding: "12px", textAlign: "right", color: "#059669" }}>+{fmt(p.benefits, displayCurrency)}</td>
                <td style={{ padding: "12px", textAlign: "right", fontWeight: 700, color: "#4F46E5" }}>{fmt(p.net, displayCurrency)}</td>
                <td style={{ padding: "12px" }}><Btn small variant="ghost" onClick={() => setViewPayslip(p)}>Payslip</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewPayslip && (
        <Modal title="Payslip" onClose={() => setViewPayslip(null)}>
          <div style={{ border: "2px solid #4F46E5", borderRadius: 12, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#4F46E5" }}>ApexHR</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>Pay Period: {new Date().toLocaleString("default", { month: "long", year: "numeric" })}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 600 }}>{viewPayslip.name}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{viewPayslip.department} · {viewPayslip.role}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{viewPayslip.country}</div>
              </div>
            </div>
            <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
              <tbody>
                {[
                  ["Basic Salary", viewPayslip.salaryUSD, false],
                  ["Benefits (5%)", viewPayslip.benefits, false],
                  ["Performance Bonus", viewPayslip.bonus, false],
                  ["Income Tax", viewPayslip.tax, true],
                ].map(([label, val, isDeduct]) => (
                  <tr key={label} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "8px 0", color: "#374151" }}>{label}</td>
                    <td style={{ padding: "8px 0", textAlign: "right", color: isDeduct ? "#DC2626" : "#059669", fontWeight: 500 }}>
                      {isDeduct ? "-" : "+"}{fmtFull(val, viewPayslip.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 12, borderTop: "2px solid #4F46E5" }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Net Pay</span>
              <span style={{ fontWeight: 700, fontSize: 18, color: "#4F46E5" }}>{fmtFull(viewPayslip.net, viewPayslip.currency)}</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: "#9ca3af", textAlign: "center" }}>
              Exchange rate 1 USD = {CURRENCIES[viewPayslip.currency]?.rate} {viewPayslip.currency}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── LEAVE MANAGEMENT ────────────────────────────────────────────────────────
function LeavePanel({ state, dispatch }) {
  const { employees, leaves } = state;
  const [showAdd, setShowAdd] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [form, setForm] = useState({ employeeId: employees[0]?.id || "", type: "Annual", from: "", to: "", reason: "" });

  const filtered = statusFilter === "All" ? leaves : leaves.filter(l => l.status === statusFilter);

  const calcDays = (from, to) => {
    if (!from || !to) return 0;
    return Math.max(0, Math.round((new Date(to) - new Date(from)) / 86400000) + 1);
  };

  const submitLeave = () => {
    if (!form.from || !form.to) return;
    const days = calcDays(form.from, form.to);
    dispatch({ type: "ADD_LEAVE", payload: { ...form, id: "l" + Date.now(), days, status: "Pending" } });
    setShowAdd(false);
  };

  const updateStatus = (leave, status) => dispatch({ type: "UPDATE_LEAVE", payload: { ...leave, status } });

  const statusType = (s) => s === "Approved" ? "success" : s === "Rejected" ? "danger" : "warning";

  const pendingCount = leaves.filter(l => l.status === "Pending").length;

  return (
    <div>
      <div className="grid-3">
        <StatCard label="Pending" value={pendingCount} sub="Awaiting decision" color="#D97706" />
        <StatCard label="Approved" value={leaves.filter(l => l.status === "Approved").length} sub="This year" color="#059669" />
        <StatCard label="Total Requests" value={leaves.length} sub="All time" color="#4F46E5" />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Pending", "Approved", "Rejected"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "6px 14px", borderRadius: 99, fontSize: 13, border: `1px solid ${statusFilter === s ? "#4F46E5" : "#e5e7eb"}`, background: statusFilter === s ? "#ede9fe" : "#fff", color: statusFilter === s ? "#4F46E5" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: statusFilter === s ? 500 : 400 }}>{s}</button>
          ))}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Btn onClick={() => setShowAdd(true)}>+ Request Leave</Btn>
        </div>
      </div>

      <div className="table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Employee</th>
              <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Type</th>
              <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Dates</th>
              <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#374151" }}>Days</th>
              <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Reason</th>
              <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Status</th>
              <th style={{ padding: "10px 12px" }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((l, i) => {
              const emp = employees.find(e => e.id === l.employeeId);
              if (!emp) return null;
              return (
                <tr key={l.id} style={{ borderBottom: "1px solid #f8fafc", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Avatar name={emp.name} size={28} />
                      <span style={{ fontWeight: 500 }}>{emp.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px" }}><Badge type="purple">{l.type}</Badge></td>
                  <td style={{ padding: "12px", color: "#6b7280" }}>{l.from} → {l.to}</td>
                  <td style={{ padding: "12px", textAlign: "center", fontWeight: 600 }}>{l.days}</td>
                  <td style={{ padding: "12px", color: "#6b7280", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.reason}</td>
                  <td style={{ padding: "12px" }}><Badge type={statusType(l.status)}>{l.status}</Badge></td>
                  <td style={{ padding: "12px" }}>
                    {l.status === "Pending" && (
                      <span style={{ display: "flex", gap: 4 }}>
                        <Btn small variant="success" onClick={() => updateStatus(l, "Approved")}>✓ Approve</Btn>
                        <Btn small variant="danger" onClick={() => updateStatus(l, "Rejected")}>✕ Reject</Btn>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No leave requests found.</div>}
      </div>

      {showAdd && (
        <Modal title="Request Leave" onClose={() => setShowAdd(false)}>
          <Select label="Employee" value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })}>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </Select>
          <Select label="Leave Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
          </Select>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="From Date" type="date" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} />
            <Input label="To Date" type="date" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} />
          </div>
          {form.from && form.to && <div style={{ background: "#ede9fe", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#5b21b6", marginBottom: 14 }}>
            Duration: {calcDays(form.from, form.to)} day{calcDays(form.from, form.to) !== 1 ? "s" : ""}
          </div>}
          <Input label="Reason" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="Brief reason…" />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn onClick={submitLeave} disabled={!form.from || !form.to}>Submit Request</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── ATTENDANCE PANEL ───────────────────────────────────────────────────────
function AttendancePanel({ state }) {
  const { employees, attendance } = state;
  const [empFilter, setEmpFilter] = useState("All");
  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = attendance.filter(a => a.date === today);
  const checkedIn = todayRecords.filter(a => a.checkIn).length;

  const monthRecords = empFilter === "All" ? attendance : attendance.filter(a => a.employeeId === empFilter);
  const presentDays = monthRecords.filter(a => a.status === "Present").length;
  const lateDays = monthRecords.filter(a => a.status === "Late").length;

  return (
    <div>
      <div className="grid-4">
        <StatCard label="Today Present" value={checkedIn} sub={`of ${employees.length}`} color="#059669" />
        <StatCard label="Present Days" value={presentDays} sub="This month" color="#4F46E5" />
        <StatCard label="Late Arrivals" value={lateDays} sub="This month" color="#D97706" />
        <StatCard label="Attendance Rate" value={`${presentDays + lateDays > 0 ? Math.round((presentDays / (presentDays + lateDays)) * 100) : 0}%`} sub="On time" color="#7C3AED" />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <select value={empFilter} onChange={e => setEmpFilter(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontFamily: "inherit" }}>
          <option value="All">All Employees</option>
          {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>

      <div className="table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Employee</th>
              <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Date</th>
              <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#374151" }}>Check In</th>
              <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#374151" }}>Check Out</th>
              <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#374151" }}>Hours</th>
              <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {monthRecords.slice(-30).reverse().map((a, i) => {
              const emp = employees.find(e => e.id === a.employeeId);
              if (!emp) return null;
              const inH = parseInt(a.checkIn);
              const outH = parseInt(a.checkOut);
              const hours = outH - inH;
              return (
                <tr key={a.id} style={{ borderBottom: "1px solid #f8fafc", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Avatar name={emp.name} size={26} />
                      <span style={{ fontWeight: 500 }}>{emp.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#6b7280" }}>{a.date}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center", color: "#374151" }}>{a.checkIn}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center", color: "#374151" }}>{a.checkOut}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 500 }}>{hours}h</td>
                  <td style={{ padding: "10px 12px" }}><Badge type={a.status === "Present" ? "success" : "warning"}>{a.status}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── REPORTS PANEL ──────────────────────────────────────────────────────────
function ReportsPanel({ state }) {
  const { employees, leaves, displayCurrency } = state;

  const deptPayroll = DEPARTMENTS.map(d => {
    const emps = employees.filter(e => e.department === d);
    return { dept: d, count: emps.length, total: emps.reduce((s, e) => s + e.salaryUSD, 0), avgSalary: emps.length ? emps.reduce((s, e) => s + e.salaryUSD, 0) / emps.length : 0 };
  }).filter(d => d.count > 0).sort((a, b) => b.total - a.total);

  const maxTotal = Math.max(...deptPayroll.map(d => d.total));

  const roleBreakdown = ROLES.map(r => ({ role: r, count: employees.filter(e => e.role === r).length })).filter(r => r.count > 0);

  const leavesByType = LEAVE_TYPES.map(t => ({ type: t, count: leaves.filter(l => l.type === t).length, days: leaves.filter(l => l.type === t).reduce((s, l) => s + l.days, 0) })).filter(l => l.count > 0);

  return (
    <div>
      <div className="grid-2">
        <div style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 12, padding: 20 }}>
          <h4 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600 }}>Payroll by Department</h4>
          {deptPayroll.map(({ dept, count, total, avgSalary }) => (
            <div key={dept} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                <span style={{ fontWeight: 500 }}>{dept} <span style={{ color: "#9ca3af", fontWeight: 400 }}>({count})</span></span>
                <span style={{ color: "#4F46E5", fontWeight: 600 }}>{fmt(total, displayCurrency)}</span>
              </div>
              <div style={{ height: 8, background: "#f1f5f9", borderRadius: 99, marginBottom: 2 }}>
                <div style={{ height: "100%", background: "linear-gradient(90deg,#4F46E5,#7C3AED)", borderRadius: 99, width: `${(total / maxTotal) * 100}%` }} />
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Avg {fmt(avgSalary, displayCurrency)}/mo</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 12, padding: 20 }}>
          <h4 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600 }}>Role Distribution</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {roleBreakdown.map(({ role, count }) => (
              <div key={role} style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 16px", textAlign: "center", minWidth: 80 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#4F46E5" }}>{count}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{role}</div>
              </div>
            ))}
          </div>

          <h4 style={{ margin: "20px 0 12px", fontSize: 14, fontWeight: 600 }}>Leave Summary</h4>
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <thead><tr><th style={{ textAlign: "left", color: "#9ca3af", fontWeight: 500, paddingBottom: 8 }}>Type</th><th style={{ textAlign: "center", color: "#9ca3af", fontWeight: 500 }}>Requests</th><th style={{ textAlign: "right", color: "#9ca3af", fontWeight: 500 }}>Total Days</th></tr></thead>
            <tbody>
              {leavesByType.map(({ type, count, days }) => (
                <tr key={type} style={{ borderTop: "1px solid #f8fafc" }}>
                  <td style={{ padding: "6px 0" }}>{type}</td>
                  <td style={{ padding: "6px 0", textAlign: "center" }}>{count}</td>
                  <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 500, color: "#4F46E5" }}>{days}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 12, padding: 20 }}>
        <h4 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600 }}>Salary Bands</h4>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
                {["Employee", "Role", "Dept", "Country", "Gross/mo", "Est. Tax", "Est. Net", "Currency"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: h === "Gross/mo" || h === "Est. Tax" || h === "Est. Net" ? "right" : "left", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...employees].sort((a, b) => b.salaryUSD - a.salaryUSD).map((e, i) => {
                const tax = calcTax(e.salaryUSD);
                return (
                  <tr key={e.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td style={{ padding: "8px 12px", fontWeight: 500 }}>{e.name}</td>
                    <td style={{ padding: "8px 12px", color: "#6b7280" }}>{e.role}</td>
                    <td style={{ padding: "8px 12px" }}><Badge type="info">{e.department}</Badge></td>
                    <td style={{ padding: "8px 12px", color: "#6b7280" }}>{e.country}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 500 }}>{fmtFull(e.salaryUSD, e.currency)}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", color: "#DC2626" }}>{fmtFull(tax, e.currency)}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", color: "#059669", fontWeight: 600 }}>{fmtFull(e.salaryUSD - tax, e.currency)}</td>
                    <td style={{ padding: "8px 12px" }}><Badge>{e.currency}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS PANEL ──────────────────────────────────────────────────────────
function SettingsPanel({ state, dispatch }) {
  const { displayCurrency } = state;
  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600 }}>Display Settings</h4>
        <Select label="Default Display Currency" value={displayCurrency} onChange={e => dispatch({ type: "SET_CURRENCY", currency: e.target.value })}>
          {Object.keys(CURRENCIES).map(c => <option key={c} value={c}>{c} ({CURRENCIES[c].symbol})</option>)}
        </Select>
        <div style={{ fontSize: 13, color: "#6b7280", marginTop: -8 }}>All monetary values in the app will be shown in this currency using live-like rates.</div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600 }}>Supported Currencies</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {Object.entries(CURRENCIES).map(([code, { symbol, rate }]) => (
            <div key={code} style={{ display: "flex", justifyContent: "space-between", background: "#f8fafc", borderRadius: 8, padding: "8px 12px", fontSize: 13 }}>
              <span style={{ fontWeight: 500 }}>{code} {symbol}</span>
              <span style={{ color: "#6b7280" }}>1 USD = {rate} {code}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 12, padding: 24 }}>
        <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600 }}>Tax Brackets (Annual USD)</h4>
        <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
          <thead><tr>{["Income Range", "Rate"].map(h => <th key={h} style={{ textAlign: "left", color: "#9ca3af", fontWeight: 500, paddingBottom: 8 }}>{h}</th>)}</tr></thead>
          <tbody>
            {[["$0 – $25,000", "0%"], ["$25,001 – $75,000", "12%"], ["$75,001 – $150,000", "22%"], ["$150,001+", "32%"]].map(([range, rate]) => (
              <tr key={range} style={{ borderTop: "1px solid #f8fafc" }}>
                <td style={{ padding: "7px 0" }}>{range}</td>
                <td style={{ padding: "7px 0", fontWeight: 600, color: "#4F46E5" }}>{rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────
export default function App() {
  useDisableInspect();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [tab, setTab] = useState("dashboard");
  const [showNotifs, setShowNotifs] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const unread = state.notifications.filter(n => !n.read).length;

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "employees", label: "Employees" },
    { id: "payroll", label: "Payroll" },
    { id: "leaves", label: "Leave" },
    { id: "attendance", label: "Attendance" },
    { id: "reports", label: "Reports" },
    { id: "settings", label: "Settings" },
  ];

  if (!user) {
    return <AuthPage onLogin={(name) => setUser(name)} />;
  }

  return (
    <div className="app-shell">
      {/* Header */}
      <div className="app-header">
        <button className="hamburger-btn" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">☰</button>
        <div className="app-logo">
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#4F46E5,#7C3AED)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>A</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>ApexHR</div>
            <div style={{ fontSize: 10, color: "#9ca3af", lineHeight: 1 }}>Software House</div>
          </div>
        </div>

        <nav className="app-nav">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className="app-nav-btn" style={{ background: tab === t.id ? "#ede9fe" : "transparent", color: tab === t.id ? "#4F46E5" : "#6b7280", fontWeight: tab === t.id ? 600 : 400 }}>{t.label}</button>
          ))}
        </nav>

        <div className="app-actions">
          <select className="app-currency-select" value={state.displayCurrency} onChange={e => dispatch({ type: "SET_CURRENCY", currency: e.target.value })}>
            {Object.keys(CURRENCIES).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div style={{ position: "relative" }}>
            <button onClick={() => { setShowNotifs(!showNotifs); if (!showNotifs) dispatch({ type: "MARK_NOTIFS_READ" }); }} style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16, position: "relative" }}>
              🔔
              {unread > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: "#DC2626", color: "#fff", borderRadius: 99, fontSize: 10, fontWeight: 700, padding: "1px 5px" }}>{unread}</span>}
            </button>
            {showNotifs && (
              <div style={{ position: "absolute", right: 0, top: 40, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, width: 300, maxWidth: "90vw", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 50 }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", fontWeight: 600, fontSize: 13 }}>Notifications</div>
                {state.notifications.map(n => (
                  <div key={n.id} style={{ padding: "10px 16px", borderBottom: "1px solid #f8fafc", background: n.read ? "#fff" : "#faf5ff" }}>
                    <div style={{ fontSize: 13, color: "#374151" }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{n.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="app-user">
            <Avatar name={user} size={30} />
            <div className="app-user-text">
              <div style={{ fontWeight: 500, color: "#111827" }}>{user}</div>
              <div style={{ color: "#9ca3af" }}>HR Manager</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <>
          <div className="mobile-nav-overlay" onClick={() => setMobileNavOpen(false)} />
          <div className="mobile-nav-drawer">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#4F46E5,#7C3AED)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>A</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>ApexHR</div>
            </div>
            {tabs.map(t => (
              <button key={t.id} className="mobile-nav-item" onClick={() => { setTab(t.id); setMobileNavOpen(false); }} style={{ background: tab === t.id ? "#ede9fe" : "transparent", color: tab === t.id ? "#4F46E5" : "#374151", fontWeight: tab === t.id ? 600 : 400 }}>{t.label}</button>
            ))}
            <div style={{ marginTop: 16, borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
              <label style={{ display: "block", fontSize: 12, color: "#6b7280", marginBottom: 6 }}>Currency</label>
              <select value={state.displayCurrency} onChange={e => dispatch({ type: "SET_CURRENCY", currency: e.target.value })} style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontFamily: "inherit" }}>
                {Object.keys(CURRENCIES).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </>
      )}

      {/* Body */}
      <div className="app-body">
        <div style={{ marginBottom: 20 }}>
          <h2 className="page-title">
            {tabs.find(t => t.id === tab)?.label}
          </h2>
          <div className="page-subtitle">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>

        {tab === "dashboard" && <Dashboard state={state} dispatch={dispatch} />}
        {tab === "employees" && <EmployeesPanel state={state} dispatch={dispatch} />}
        {tab === "payroll" && <PayrollPanel state={state} dispatch={dispatch} />}
        {tab === "leaves" && <LeavePanel state={state} dispatch={dispatch} />}
        {tab === "attendance" && <AttendancePanel state={state} />}
        {tab === "reports" && <ReportsPanel state={state} />}
        {tab === "settings" && <SettingsPanel state={state} dispatch={dispatch} />}
      </div>
    </div>
  );
}
