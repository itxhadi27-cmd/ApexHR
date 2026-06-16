import { useState } from "react";

const styles = {
  page: {
    fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
    background: "#0f0f1a",
    color: "#e5e7eb",
    minHeight: "100vh",
    width: "100%",
    overflowX: "hidden" as const,
  },
  hero: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center" as const,
    padding: "60px 20px",
    background: "radial-gradient(circle at 50% 0%, rgba(79,70,229,0.35), transparent 60%), #0f0f1a",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
  },
  logoIcon: {
    width: 44,
    height: 44,
    background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: 700,
    color: "#fff",
    flexShrink: 0,
  },
  logoText: {
    textAlign: "left" as const,
  },
  tagline: {
    fontSize: "clamp(28px, 6vw, 56px)",
    fontWeight: 800,
    margin: "0 0 16px",
    lineHeight: 1.15,
  },
  sub: {
    fontSize: "clamp(13px, 2.5vw, 17px)",
    color: "#9ca3af",
    maxWidth: 640,
    margin: "0 auto 36px",
    lineHeight: 1.6,
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
    gap: 24,
    maxWidth: 720,
    width: "100%",
    margin: "0 auto 40px",
  },
  stat: {
    display: "flex",
    flexDirection: "column" as const,
  },
  statNum: {
    fontSize: "clamp(20px, 4vw, 32px)",
    fontWeight: 800,
    color: "#a5b4fc",
  },
  statLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  scrollHint: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 6,
    color: "#6b7280",
    fontSize: 12,
    cursor: "pointer",
  },
  section: {
    padding: "60px 20px",
    maxWidth: 1100,
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "clamp(22px, 4vw, 32px)",
    fontWeight: 700,
    textAlign: "center" as const,
    margin: "0 0 36px",
  },
  featGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: 20,
  },
  featCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 22,
  },
  featIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    marginBottom: 12,
  },
  featTitle: {
    fontSize: 15,
    fontWeight: 600,
    margin: "0 0 6px",
  },
  featDesc: {
    fontSize: 13,
    color: "#9ca3af",
    lineHeight: 1.5,
    margin: 0,
  },
  authSection: {
    padding: "60px 20px 100px",
    display: "flex",
    justifyContent: "center",
  },
  authBox: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "32px 28px",
    width: "100%",
    maxWidth: 420,
  },
  authTitle: {
    margin: "0 0 6px",
    fontSize: 20,
    fontWeight: 700,
    textAlign: "center" as const,
  },
  authSub: {
    margin: "0 0 24px",
    fontSize: 13,
    color: "#9ca3af",
    textAlign: "center" as const,
  },
  tabRow: {
    display: "flex",
    gap: 4,
    marginBottom: 22,
    background: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    padding: 4,
  },
  label: {
    display: "block",
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 6,
    fontWeight: 500,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.03)",
    color: "#e5e7eb",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  field: { marginBottom: 14 },
  primaryBtn: {
    width: "100%",
    padding: "11px 0",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    fontFamily: "inherit",
    cursor: "pointer",
    marginTop: 6,
  },
  error: {
    background: "rgba(220,38,38,0.12)",
    border: "1px solid rgba(220,38,38,0.3)",
    color: "#fca5a5",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 12.5,
    marginBottom: 14,
  },
  success: {
    background: "rgba(5,150,105,0.12)",
    border: "1px solid rgba(5,150,105,0.3)",
    color: "#6ee7b7",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 12.5,
    marginBottom: 14,
  },
  switchText: {
    textAlign: "center" as const,
    marginTop: 16,
    fontSize: 12.5,
    color: "#9ca3af",
  },
  switchLink: {
    color: "#a5b4fc",
    cursor: "pointer",
    fontWeight: 500,
  },
};

const tabBtnStyle = (active: boolean) => ({
  flex: 1,
  padding: "8px 6px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontSize: 12.5,
  fontFamily: "inherit",
  fontWeight: 600,
  background: active ? "#4F46E5" : "transparent",
  color: active ? "#fff" : "#9ca3af",
  transition: "all .15s",
});

const FEATURES = [
  { icon: "👥", color: "#4F46E5", title: "Employee Directory", desc: "Full profiles with departments, roles, countries, skills, and salary details." },
  { icon: "💰", color: "#0891B2", title: "Global Payroll", desc: "Multi-currency payroll, tax estimates, payslips, and net pay calculations." },
  { icon: "🗓️", color: "#7C3AED", title: "Leave Management", desc: "Submit, review, and approve leave requests with running balances." },
  { icon: "⏱️", color: "#059669", title: "Attendance Tracking", desc: "Daily check-in/out records, attendance rates, and late arrival trends." },
  { icon: "📊", color: "#D97706", title: "Analytics & Reports", desc: "Department payroll breakdowns, role distribution, and salary bands." },
  { icon: "🌍", color: "#DC2626", title: "Multi-Currency", desc: "Support for USD, PKR, EUR, GBP, AED, SAR, CAD and AUD out of the box." },
];

const STATS = [
  { num: "10+", label: "Employees Managed" },
  { num: "9", label: "Departments" },
  { num: "8", label: "Currencies Supported" },
  { num: "10", label: "Countries" },
];

type AuthTab = "login" | "register";

export default function AuthPage({ onLogin }: { onLogin: (name: string) => void }) {
  const [tab, setTab] = useState<AuthTab>("login");
  const [loginId, setLoginId] = useState("");
  const [loginPwd, setLoginPwd] = useState("");
  const [regName, setRegName] = useState("");
  const [regId, setRegId] = useState("");
  const [regPwd, setRegPwd] = useState("");
  const [regPwd2, setRegPwd2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = () => {
    setError("");
    if (!loginId.trim() || !loginPwd.trim()) {
      setError("Please enter both your User ID and password.");
      return;
    }
    onLogin(loginId.trim());
  };

  const handleRegister = () => {
    setError("");
    if (!regName.trim() || !regId.trim() || !regPwd || !regPwd2) {
      setError("Please fill in all required fields.");
      return;
    }
    if (regPwd !== regPwd2) {
      setError("Passwords do not match.");
      return;
    }
    setSuccess("Account created! You can now sign in.");
    setTab("login");
    setLoginId(regId.trim());
    setLoginPwd("");
  };

  const scrollToAuth = () => {
    document.getElementById("apex-auth-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={styles.page}>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>A</div>
          <div style={styles.logoText}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>ApexHR</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>Software House HR Suite</div>
          </div>
        </div>
        <h1 style={styles.tagline}>People First.<br />Payroll Simplified.</h1>
        <p style={styles.sub}>
          ApexHR brings together employee management, multi-currency payroll, leave requests,
          attendance, and analytics — all in a single, fast dashboard built for global teams.
        </p>

        <div style={styles.stats}>
          {STATS.map(s => (
            <div key={s.label} style={styles.stat}>
              <div style={styles.statNum}>{s.num}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={styles.scrollHint} onClick={scrollToAuth}>
          <span>Scroll down to learn more &amp; sign in</span>
          <span>⌄</span>
        </div>
      </div>

      {/* Features */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Everything Your HR Team Needs</h2>
        <div style={styles.featGrid}>
          {FEATURES.map(f => (
            <div key={f.title} style={styles.featCard}>
              <div style={{ ...styles.featIcon, background: `${f.color}22`, color: f.color }}>{f.icon}</div>
              <h3 style={styles.featTitle}>{f.title}</h3>
              <p style={styles.featDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Auth */}
      <div style={styles.authSection} id="apex-auth-section">
        <div style={styles.authBox}>
          <h2 style={styles.authTitle}>Access ApexHR</h2>
          <p style={styles.authSub}>Sign in to your account or create a new one to get started.</p>

          <div style={styles.tabRow}>
            <button style={tabBtnStyle(tab === "login")} onClick={() => { setTab("login"); setError(""); }}>Sign In</button>
            <button style={tabBtnStyle(tab === "register")} onClick={() => { setTab("register"); setError(""); }}>Create Account</button>
          </div>

          {error && <div style={styles.error}>{error}</div>}
          {success && tab === "login" && <div style={styles.success}>{success}</div>}

          {tab === "login" ? (
            <div>
              <div style={styles.field}>
                <label style={styles.label}>User ID</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Enter your User ID"
                  autoComplete="off"
                  value={loginId}
                  onChange={e => setLoginId(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <input
                  style={styles.input}
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="off"
                  value={loginPwd}
                  onChange={e => setLoginPwd(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                />
              </div>
              <button style={styles.primaryBtn} onClick={handleLogin}>Sign In</button>
              <p style={styles.switchText}>
                Don't have an account?{" "}
                <span style={styles.switchLink} onClick={() => { setTab("register"); setError(""); }}>Create one</span>
              </p>
            </div>
          ) : (
            <div>
              <div style={styles.field}>
                <label style={styles.label}>Full Name *</label>
                <input style={styles.input} type="text" autoComplete="off" value={regName} onChange={e => setRegName(e.target.value)} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>User ID *</label>
                <input style={styles.input} type="text" autoComplete="off" value={regId} onChange={e => setRegId(e.target.value)} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Password *</label>
                <input style={styles.input} type="password" autoComplete="off" value={regPwd} onChange={e => setRegPwd(e.target.value)} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Confirm Password *</label>
                <input style={styles.input} type="password" autoComplete="off" value={regPwd2} onChange={e => setRegPwd2(e.target.value)} />
              </div>
              <button style={styles.primaryBtn} onClick={handleRegister}>Create Account</button>
              <p style={styles.switchText}>
                Already have an account?{" "}
                <span style={styles.switchLink} onClick={() => { setTab("login"); setError(""); }}>Sign in</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
