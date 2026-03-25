import React, { useMemo, useState } from "react";

const OFFICIAL_EMAIL_DOMAIN = "@weshinetech.biz";
const MASTER_EMAILS = ["admin@weshinetech.biz", "abc@weshinetech.biz"];

const moduleTemplates = {
  RPS: {
    clients: [
      "MIT", "Indira University", "ZCOER (N)", "SITS", "Walchand College", "TKIET", "AISSMS IOIT", "PVG", "ZCOER (Off)", "AISSMS HMCT", "Trinity",
    ],
    teamMembers: [
      "Anish Sutar", "Shubhangi Lohar", "Nilesh Shinde", "Vidyarani Yadav", "Vijay Patil", "Anuhka Patil (Vaishali)", "Vaibhav Tawar", "Ashwini Patil", "Indrajeet Sontake", "Ashwini Bachhav", "Ruchita Daware",
    ],
    phases: [
      "1 - Institute / Client onboarding", "2 - Curriculum design / Development", "3 - Student Onboarding", "4 - Form filling setup", "5 - Form filling Data Collection", "6 - Form filling closing / for students", "7 - Form filling approval", "8 - Form filling correction / if any", "9 - Form filling deliverables", "10 - Timetable creation", "11 - Hall ticket generation", "12 - Barcode Generation", "13 - End sem exam", "14 - Internal marks entry by colleges / institute", "15 - Onscreen evaluation", "16 - Marks sync from OSM to RPS", "17 - Result processing setup", "18 - Result processing JOB", "19 - Post Result processing activities", "20 - Result Publishing", "21 - Photocopy", "22 - Revaluation", "23 - Revaluation Result processing", "24 - Grade card and ledger", "25 - Promotion & enrollment to next year", "26 - Student services", "27 - Others",
    ],
  },
  QPM_QPD: { clients: [], teamMembers: [], phases: [] },
  OES: { clients: [], teamMembers: [], phases: [] },
  OSM: { clients: [], teamMembers: [], phases: [] },
};

const moduleOptions = Object.keys(moduleTemplates);
const statusOptions = ["Not Started", "In Progress", "Completed", "Blocked", "Delayed"];
const priorityOptions = ["High", "Medium", "Low"];

const seedUsers = [
  { email: "abc@weshinetech.biz", password: "master123", role: "master", name: "Master Admin" },
  { email: "anish.sutar@weshinetech.biz", password: "user12345", role: "individual", name: "Anish Sutar" },
  { email: "shubhangi.lohar@weshinetech.biz", password: "user12345", role: "individual", name: "Shubhangi Lohar" },
];

const seedData = [
  {
    id: 1,
    module: "RPS",
    timestamp: "2026-03-24 09:00",
    assigneeName: "Anish Sutar",
    assigneeEmail: "anish.sutar@weshinetech.biz",
    client: "MIT",
    phase: "18 - Result processing JOB",
    todayTask: "Validate student result batch and execute processing job",
    previousTask: "Completed setup validation for RPS input files",
    remarks: "Awaiting final approval",
    taskStatus: "In Progress",
    priority: "High",
  },
  {
    id: 2,
    module: "RPS",
    timestamp: "2026-03-24 09:15",
    assigneeName: "Shubhangi Lohar",
    assigneeEmail: "shubhangi.lohar@weshinetech.biz",
    client: "Indira University",
    phase: "17 - Result processing setup",
    todayTask: "Configure grace rules and validate absent cases",
    previousTask: "Reviewed exception list",
    remarks: "Need 3 records confirmation",
    taskStatus: "Blocked",
    priority: "High",
  },
];

const emptyForm = {
  module: "RPS",
  timestamp: "",
  assigneeName: "",
  assigneeEmail: "",
  client: "",
  phase: "",
  todayTask: "",
  previousTask: "",
  remarks: "",
  taskStatus: "Not Started",
  priority: "Medium",
};

const styles = {
  tabs: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  tab: { padding: "10px 14px", cursor: "pointer", borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff" },
  activeTab: { padding: "10px 14px", cursor: "pointer", borderRadius: 8, border: "1px solid #2563eb", background: "#2563eb", color: "#fff" },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 16 },
  statCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 8px", borderBottom: "1px solid #e2e8f0", fontSize: 13, color: "#475569" },
  td: { padding: "10px 8px", borderBottom: "1px solid #e2e8f0", verticalAlign: "top", fontSize: 14 },
  page: { minHeight: "100vh", background: "#f8fafc", padding: 24, fontFamily: "Arial, sans-serif", color: "#0f172a" },
  card: { background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #ddd", marginBottom: 16 },
  input: { width: "100%", padding: 10, marginBottom: 10, borderRadius: 8, border: "1px solid #cbd5e1", boxSizing: "border-box" },
  button: { padding: "10px 14px", marginRight: 10, cursor: "pointer", borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff" },
  primaryButton: { padding: "10px 14px", marginRight: 10, cursor: "pointer", borderRadius: 8, border: "1px solid #2563eb", background: "#2563eb", color: "#fff" },
  label: { display: "block", fontWeight: 700, marginBottom: 6, fontSize: 14 },
  row: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 },
  badge: { display: "inline-block", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, border: "1px solid #cbd5e1", background: "#f8fafc" },
  muted: { color: "#64748b", fontSize: 13 },
  error: { color: "#b91c1c", fontSize: 13, marginTop: 6 },
  success: { color: "#166534", fontSize: 13, marginTop: 6 },
};

function getCurrentTimestamp() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")} ${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
}

function toOfficialEmail(name) {
  const clean = name
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .join(".");
  return `${clean}${OFFICIAL_EMAIL_DOMAIN}`;
}

function getAllPeople(masters) {
  return Array.from(new Set(Object.values(masters).flatMap((module) => module.teamMembers || []))).sort((a, b) => a.localeCompare(b));
}

function getPeopleDirectory(masters) {
  return getAllPeople(masters).map((name) => ({ name, email: toOfficialEmail(name) }));
}

function isOfficialEmail(email) {
  return typeof email === "string" && email.toLowerCase().endsWith(OFFICIAL_EMAIL_DOMAIN);
}

function validatePassword(password) {
  return typeof password === "string" && password.length >= 8;
}

function findUser(users, email) {
  return users.find((user) => user.email === String(email || "").toLowerCase()) || null;
}

function runSelfTests() {
  console.assert(moduleTemplates.RPS.phases.length === 27, "RPS must keep default phases");
  console.assert(moduleTemplates.OES.phases.length === 0, "OES phases should start empty");
  console.assert(seedData.every((row) => row.assigneeName), "Each record should have an assignee");
  console.assert(seedData.every((row) => isOfficialEmail(row.assigneeEmail)), "Seed emails must use official domain");
  console.assert(toOfficialEmail("Anish Sutar") === "anish.sutar@weshinetech.biz", "Official email mapping should be stable");
  console.assert(validatePassword("user12345") === true, "Password validation should accept 8+ chars");
  console.assert(validatePassword("short") === false, "Password validation should reject short passwords");
  console.assert(findUser(seedUsers, "abc@weshinetech.biz")?.role === "master", "Master user should be found by email");
}

function MasterSection({ title, items, value, setValue, onAdd, onRemove, placeholder, renderItem }) {
  return (
    <div style={styles.card}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input style={{ ...styles.input, marginBottom: 0 }} value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />
        <button style={styles.primaryButton} onClick={onAdd}>Add</button>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {items.length ? items.map((item) => (
          <div key={item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", gap: 10 }}>
            <div>{renderItem ? renderItem(item) : <span>{item}</span>}</div>
            <button style={styles.button} onClick={() => onRemove(item)}>Remove</button>
          </div>
        )) : <div style={styles.muted}>No items yet.</div>}
      </div>
    </div>
  );
}

function StatCard({ label, value, helper }) {
  return (
    <div style={styles.statCard}>
      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
      {helper ? <div style={styles.muted}>{helper}</div> : null}
    </div>
  );
}

export default function App() {
  const [records, setRecords] = useState(seedData);
  const [moduleMasters, setModuleMasters] = useState(moduleTemplates);
  const [users, setUsers] = useState(seedUsers);
  const [selectedModule, setSelectedModule] = useState("RPS");
  const [authMode, setAuthMode] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("abc@weshinetech.biz");
  const [loginPassword, setLoginPassword] = useState("master123");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [form, setForm] = useState({ ...emptyForm, timestamp: getCurrentTimestamp(), module: "RPS" });
  const [newClient, setNewClient] = useState("");
  const [newPerson, setNewPerson] = useState("");
  const [newPhase, setNewPhase] = useState("");
  const [activeView, setActiveView] = useState("dashboard");

  runSelfTests();

  const current = moduleMasters[selectedModule] || { clients: [], teamMembers: [], phases: [] };
  const peopleDirectory = useMemo(() => getPeopleDirectory(moduleMasters), [moduleMasters]);
  const currentUserRole = currentUser?.role || "guest";
  const currentUserEmail = currentUser?.email || "";
  const currentUserName = currentUser?.name || "";
  const masterAuthorized = isLoggedIn && currentUserRole === "master" && MASTER_EMAILS.includes(currentUserEmail);
  const individualAuthorized = isLoggedIn && currentUserRole === "individual" && isOfficialEmail(currentUserEmail);

  const visibleRecords = useMemo(() => {
    return records.filter((record) => {
      if (record.module !== selectedModule) return false;
      if (masterAuthorized) return true;
      return individualAuthorized && record.assigneeEmail === currentUserEmail;
    });
  }, [records, selectedModule, masterAuthorized, individualAuthorized, currentUserEmail]);

  const dashboardRecords = useMemo(() => {
    if (masterAuthorized) return records;
    if (individualAuthorized) return records.filter((record) => record.assigneeEmail === currentUserEmail);
    return [];
  }, [records, masterAuthorized, individualAuthorized, currentUserEmail]);

  const crossModuleStats = useMemo(() => ({
    total: dashboardRecords.length,
    people: new Set(dashboardRecords.map((record) => record.assigneeEmail)).size,
    modules: new Set(dashboardRecords.map((record) => record.module)).size,
    clients: new Set(dashboardRecords.map((record) => record.client)).size,
    inProgress: dashboardRecords.filter((record) => record.taskStatus === "In Progress").length,
    blocked: dashboardRecords.filter((record) => record.taskStatus === "Blocked").length,
    completed: dashboardRecords.filter((record) => record.taskStatus === "Completed").length,
  }), [dashboardRecords]);

  const peopleActivity = useMemo(() => {
    const grouped = dashboardRecords.reduce((acc, record) => {
      const key = record.assigneeEmail;
      if (!acc[key]) {
        acc[key] = {
          assigneeName: record.assigneeName,
          assigneeEmail: record.assigneeEmail,
          total: 0,
          inProgress: 0,
          blocked: 0,
          completed: 0,
          modules: new Set(),
          clients: new Set(),
          lastTask: "",
          lastTimestamp: "",
        };
      }
      acc[key].total += 1;
      acc[key].modules.add(record.module);
      acc[key].clients.add(record.client);
      acc[key].lastTask = record.todayTask;
      acc[key].lastTimestamp = record.timestamp;
      if (record.taskStatus === "In Progress") acc[key].inProgress += 1;
      if (record.taskStatus === "Blocked") acc[key].blocked += 1;
      if (record.taskStatus === "Completed") acc[key].completed += 1;
      return acc;
    }, {});

    return Object.values(grouped)
      .map((item) => ({ ...item, modules: Array.from(item.modules), clients: Array.from(item.clients) }))
      .sort((a, b) => a.assigneeName.localeCompare(b.assigneeName));
  }, [dashboardRecords]);

  const moduleActivity = useMemo(() => {
    const grouped = dashboardRecords.reduce((acc, record) => {
      if (!acc[record.module]) {
        acc[record.module] = { module: record.module, total: 0, people: new Set(), blocked: 0, inProgress: 0, completed: 0 };
      }
      acc[record.module].total += 1;
      acc[record.module].people.add(record.assigneeEmail);
      if (record.taskStatus === "Blocked") acc[record.module].blocked += 1;
      if (record.taskStatus === "In Progress") acc[record.module].inProgress += 1;
      if (record.taskStatus === "Completed") acc[record.module].completed += 1;
      return acc;
    }, {});

    return Object.values(grouped).map((item) => ({ ...item, people: item.people.size }));
  }, [dashboardRecords]);

  const statusCounts = useMemo(() => {
    return {
      total: visibleRecords.length,
      inProgress: visibleRecords.filter((r) => r.taskStatus === "In Progress").length,
      blocked: visibleRecords.filter((r) => r.taskStatus === "Blocked").length,
      completed: visibleRecords.filter((r) => r.taskStatus === "Completed").length,
    };
  }, [visibleRecords]);

  function handleLogin() {
    setAuthError("");
    setAuthSuccess("");
    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword;

    if (!isOfficialEmail(email)) {
      setAuthError("Use only official Weshine Tech email IDs.");
      return;
    }

    const matchedUser = findUser(users, email);
    if (!matchedUser || matchedUser.password !== password) {
      setAuthError("Invalid email or password.");
      return;
    }

    setCurrentUser(matchedUser);
    setIsLoggedIn(true);
    setAuthSuccess(`Logged in as ${matchedUser.email}`);
    setForm((prev) => ({
      ...prev,
      assigneeName: matchedUser.role === "individual" ? matchedUser.name : prev.assigneeName,
      assigneeEmail: matchedUser.role === "individual" ? matchedUser.email : prev.assigneeEmail,
      module: selectedModule,
    }));
  }

  function handleRegister() {
    setAuthError("");
    setAuthSuccess("");
    const email = registerEmail.trim().toLowerCase();
    const password = registerPassword;
    const name = registerName.trim();

    if (!name) {
      setAuthError("Enter full name.");
      return;
    }
    if (!isOfficialEmail(email)) {
      setAuthError("Registration is allowed only with official Weshine Tech email IDs.");
      return;
    }
    if (!validatePassword(password)) {
      setAuthError("Password must be at least 8 characters.");
      return;
    }
    if (findUser(users, email)) {
      setAuthError("This email is already registered.");
      return;
    }

    const newUser = {
      email,
      password,
      role: MASTER_EMAILS.includes(email) ? "master" : "individual",
      name,
    };

    setUsers((prev) => [...prev, newUser]);
    setAuthSuccess("Registration successful. You can now log in.");
    setAuthMode("login");
    setLoginEmail(email);
    setLoginPassword(password);
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");

    if (!peopleDirectory.some((person) => person.email === email) && newUser.role === "individual") {
      setModuleMasters((prev) => ({
        ...prev,
        [selectedModule]: {
          ...prev[selectedModule],
          teamMembers: [...prev[selectedModule].teamMembers, name].sort((a, b) => a.localeCompare(b)),
        },
      }));
    }
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAuthSuccess("Logged out successfully.");
    setAuthError("");
    setForm({ ...emptyForm, timestamp: getCurrentTimestamp(), module: selectedModule });
  }

  function addRecord() {
    if (!form.assigneeName || !form.assigneeEmail || !form.client || !form.phase || !form.todayTask.trim()) return;
    setRecords((prev) => [{ id: Date.now(), ...form, module: selectedModule }, ...prev]);
    setForm({
      ...emptyForm,
      module: selectedModule,
      timestamp: getCurrentTimestamp(),
      assigneeName: individualAuthorized ? currentUserName : "",
      assigneeEmail: individualAuthorized ? currentUserEmail : "",
    });
  }

  function addMasterValue(key, value, clear) {
    const clean = value.trim();
    if (!clean) return;
    const currentItems = moduleMasters[selectedModule][key] || [];
    if (currentItems.some((item) => item.toLowerCase() === clean.toLowerCase())) return;
    setModuleMasters((prev) => ({
      ...prev,
      [selectedModule]: {
        ...prev[selectedModule],
        [key]: [...currentItems, clean].sort((a, b) => a.localeCompare(b)),
      },
    }));
    clear("");
  }

  function removeMasterValue(key, value) {
    const dependencyKey = key === "teamMembers" ? "assigneeName" : key === "clients" ? "client" : "phase";
    const inUse = records.some((record) => record.module === selectedModule && record[dependencyKey] === value);
    if (inUse) {
      window.alert("Cannot remove item because it is already used in records.");
      return;
    }
    setModuleMasters((prev) => ({
      ...prev,
      [selectedModule]: {
        ...prev[selectedModule],
        [key]: prev[selectedModule][key].filter((item) => item !== value),
      },
    }));
  }

  const canManageMaster = masterAuthorized;
  const canChooseAssignee = masterAuthorized;
  const authReady = isLoggedIn && (masterAuthorized || individualAuthorized);

  return (
    <div style={styles.page}>
      <h2 style={{ marginTop: 0 }}>Multi Module Tracker</h2>
      <p style={styles.muted}>Users can register with official {OFFICIAL_EMAIL_DOMAIN} email IDs and create a password. Master rights stay with approved master emails only.</p>

      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>{isLoggedIn ? "Session" : "Authentication"}</h3>
        {!isLoggedIn ? (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button style={authMode === "login" ? styles.primaryButton : styles.button} onClick={() => setAuthMode("login")}>Login</button>
              <button style={authMode === "register" ? styles.primaryButton : styles.button} onClick={() => setAuthMode("register")}>Register</button>
            </div>

            {authMode === "login" ? (
              <div style={styles.row}>
                <div>
                  <label style={styles.label}>Official Email</label>
                  <input style={styles.input} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder={`name${OFFICIAL_EMAIL_DOMAIN}`} />
                </div>
                <div>
                  <label style={styles.label}>Password</label>
                  <input type="password" style={styles.input} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Enter password" />
                </div>
                <div>
                  <label style={styles.label}>Action</label>
                  <button style={styles.primaryButton} onClick={handleLogin}>Login</button>
                </div>
              </div>
            ) : (
              <div style={styles.row}>
                <div>
                  <label style={styles.label}>Full Name</label>
                  <input style={styles.input} value={registerName} onChange={(e) => setRegisterName(e.target.value)} placeholder="Enter full name" />
                </div>
                <div>
                  <label style={styles.label}>Official Email</label>
                  <input style={styles.input} value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} placeholder={`name${OFFICIAL_EMAIL_DOMAIN}`} />
                </div>
                <div>
                  <label style={styles.label}>Create Password</label>
                  <input type="password" style={styles.input} value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Minimum 8 characters" />
                </div>
                <div>
                  <label style={styles.label}>Action</label>
                  <button style={styles.primaryButton} onClick={handleRegister}>Register</button>
                </div>
              </div>
            )}

            {authError ? <div style={styles.error}>{authError}</div> : null}
            {authSuccess ? <div style={styles.success}>{authSuccess}</div> : null}
          </>
        ) : (
          <>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <span style={styles.badge}>Logged in: {currentUserEmail}</span>
              <span style={styles.badge}>Role: {currentUserRole}</span>
              <span style={styles.badge}>Name: {currentUserName || "N/A"}</span>
              <button style={styles.button} onClick={handleLogout}>Logout</button>
            </div>
            {authSuccess ? <div style={styles.success}>{authSuccess}</div> : null}
          </>
        )}
      </div>

      <div style={styles.tabs}>
        <button style={activeView === "dashboard" ? styles.activeTab : styles.tab} onClick={() => setActiveView("dashboard")}>Dashboard</button>
        <button style={activeView === "module" ? styles.activeTab : styles.tab} onClick={() => setActiveView("module")}>Module Workspace</button>
      </div>

      {activeView === "dashboard" ? (
        <>
          <div style={styles.card}>
            <h3 style={{ marginTop: 0 }}>All Modules Daily Activity Dashboard</h3>
            <p style={styles.muted}>This dashboard shows daily activity of all people across all modules. Master login sees all records, while individuals see only their own activity across modules.</p>
            <div style={styles.statGrid}>
              <StatCard label="Total Updates" value={crossModuleStats.total} helper="Across all modules" />
              <StatCard label="People Active" value={crossModuleStats.people} helper="Unique employees" />
              <StatCard label="Modules Active" value={crossModuleStats.modules} helper="Active modules" />
              <StatCard label="Clients Active" value={crossModuleStats.clients} helper="Unique clients" />
              <StatCard label="In Progress" value={crossModuleStats.inProgress} helper="Current running work" />
              <StatCard label="Blocked" value={crossModuleStats.blocked} helper="Needs attention" />
              <StatCard label="Completed" value={crossModuleStats.completed} helper="Done updates" />
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={{ marginTop: 0 }}>Module Summary</h3>
            {!moduleActivity.length ? <div style={styles.muted}>No activity available.</div> : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Module</th>
                    <th style={styles.th}>Updates</th>
                    <th style={styles.th}>People</th>
                    <th style={styles.th}>In Progress</th>
                    <th style={styles.th}>Blocked</th>
                    <th style={styles.th}>Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {moduleActivity.map((item) => (
                    <tr key={item.module}>
                      <td style={styles.td}><b>{item.module}</b></td>
                      <td style={styles.td}>{item.total}</td>
                      <td style={styles.td}>{item.people}</td>
                      <td style={styles.td}>{item.inProgress}</td>
                      <td style={styles.td}>{item.blocked}</td>
                      <td style={styles.td}>{item.completed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={styles.card}>
            <h3 style={{ marginTop: 0 }}>People Activity Summary</h3>
            {!peopleActivity.length ? <div style={styles.muted}>No people activity available.</div> : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Person</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Modules</th>
                    <th style={styles.th}>Clients</th>
                    <th style={styles.th}>Updates</th>
                    <th style={styles.th}>In Progress</th>
                    <th style={styles.th}>Blocked</th>
                    <th style={styles.th}>Completed</th>
                    <th style={styles.th}>Latest Task</th>
                  </tr>
                </thead>
                <tbody>
                  {peopleActivity.map((item) => (
                    <tr key={item.assigneeEmail}>
                      <td style={styles.td}><b>{item.assigneeName}</b></td>
                      <td style={styles.td}>{item.assigneeEmail}</td>
                      <td style={styles.td}>{item.modules.join(", ")}</td>
                      <td style={styles.td}>{item.clients.join(", ")}</td>
                      <td style={styles.td}>{item.total}</td>
                      <td style={styles.td}>{item.inProgress}</td>
                      <td style={styles.td}>{item.blocked}</td>
                      <td style={styles.td}>{item.completed}</td>
                      <td style={styles.td}><div>{item.lastTask || "-"}</div><div style={styles.muted}>{item.lastTimestamp || ""}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        <>
          <div style={styles.card}>
        <div style={styles.row}>
          <div>
            <label style={styles.label}>Module</label>
            <select value={selectedModule} onChange={(e) => {
              const nextModule = e.target.value;
              setSelectedModule(nextModule);
              setForm((prev) => ({
                ...prev,
                module: nextModule,
                client: "",
                phase: "",
                assigneeName: individualAuthorized ? currentUserName : prev.assigneeName,
                assigneeEmail: individualAuthorized ? currentUserEmail : prev.assigneeEmail,
              }));
            }} style={styles.input}>
              {moduleOptions.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label style={styles.label}>Access</label>
            <div style={{ ...styles.input, background: "#f8fafc" }}>{masterAuthorized ? "Master" : individualAuthorized ? "Individual" : "Not authorized"}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <span style={styles.badge}>Visible Records: {statusCounts.total}</span>
          <span style={styles.badge}>In Progress: {statusCounts.inProgress}</span>
          <span style={styles.badge}>Blocked: {statusCounts.blocked}</span>
          <span style={styles.badge}>Completed: {statusCounts.completed}</span>
          <span style={styles.badge}>Login: {currentUserEmail || "Not logged in"}</span>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>Add Update</h3>
        {!authReady ? <div style={styles.error}>Login with an authorized official email to add updates.</div> : null}
        <div style={styles.row}>
          <div>
            <label style={styles.label}>Assignee</label>
            <select
              style={styles.input}
              value={form.assigneeEmail}
              disabled={!canChooseAssignee || !authReady}
              onChange={(e) => {
                const person = peopleDirectory.find((entry) => entry.email === e.target.value);
                setForm({ ...form, assigneeEmail: e.target.value, assigneeName: person?.name || "" });
              }}
            >
              <option value="">Select Person</option>
              {(individualAuthorized
                ? [{ name: currentUserName, email: currentUserEmail }]
                : current.teamMembers.map((name) => ({ name, email: toOfficialEmail(name) }))
              ).map((person) => (
                <option key={person.email} value={person.email}>{person.name} ({person.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={styles.label}>Client</label>
            <select style={styles.input} value={form.client} disabled={!authReady} onChange={(e) => setForm({ ...form, client: e.target.value })}>
              <option value="">Select Client</option>
              {current.clients.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={styles.label}>Phase</label>
            <select style={styles.input} value={form.phase} disabled={!authReady} onChange={(e) => setForm({ ...form, phase: e.target.value })}>
              <option value="">Select Phase</option>
              {current.phases.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <label style={styles.label}>Today's Task</label>
        <input style={styles.input} placeholder="Today's Task" disabled={!authReady} value={form.todayTask} onChange={(e) => setForm({ ...form, todayTask: e.target.value })} />

        <label style={styles.label}>Previous Task</label>
        <input style={styles.input} placeholder="Previous Task" disabled={!authReady} value={form.previousTask} onChange={(e) => setForm({ ...form, previousTask: e.target.value })} />

        <label style={styles.label}>Remarks</label>
        <input style={styles.input} placeholder="Remarks" disabled={!authReady} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />

        <div style={styles.row}>
          <div>
            <label style={styles.label}>Task Status</label>
            <select style={styles.input} disabled={!authReady} value={form.taskStatus} onChange={(e) => setForm({ ...form, taskStatus: e.target.value })}>
              {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
          <div>
            <label style={styles.label}>Priority</label>
            <select style={styles.input} disabled={!authReady} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              {priorityOptions.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
            </select>
          </div>
          <div>
            <label style={styles.label}>Timestamp</label>
            <input style={styles.input} disabled={!authReady} value={form.timestamp} onChange={(e) => setForm({ ...form, timestamp: e.target.value })} />
          </div>
        </div>

        <button style={styles.primaryButton} onClick={addRecord} disabled={!authReady}>Add</button>
      </div>

      {canManageMaster && (
        <div style={styles.row}>
          <MasterSection
            title={`People Master - ${selectedModule}`}
            items={current.teamMembers}
            value={newPerson}
            setValue={setNewPerson}
            onAdd={() => addMasterValue("teamMembers", newPerson, setNewPerson)}
            onRemove={(item) => removeMasterValue("teamMembers", item)}
            placeholder="Add person"
            renderItem={(item) => (
              <div>
                <div>{item}</div>
                <div style={styles.muted}>{toOfficialEmail(item)}</div>
              </div>
            )}
          />
          <MasterSection
            title={`Clients Master - ${selectedModule}`}
            items={current.clients}
            value={newClient}
            setValue={setNewClient}
            onAdd={() => addMasterValue("clients", newClient, setNewClient)}
            onRemove={(item) => removeMasterValue("clients", item)}
            placeholder="Add client"
          />
          <MasterSection
            title={`Phases Master - ${selectedModule}`}
            items={current.phases}
            value={newPhase}
            setValue={setNewPhase}
            onAdd={() => addMasterValue("phases", newPhase, setNewPhase)}
            onRemove={(item) => removeMasterValue("phases", item)}
            placeholder="Add phase"
          />
        </div>
      )}

      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>Records</h3>
        {!visibleRecords.length && <div style={styles.muted}>No records visible for this login.</div>}
        {visibleRecords.map((r) => (
          <div key={r.id} style={{ marginBottom: 10, borderBottom: "1px solid #e2e8f0", paddingBottom: 10 }}>
            <div><b>{r.assigneeName}</b> | {r.assigneeEmail} | {r.client} | {r.phase}</div>
            <div style={styles.muted}>{r.module} • {r.timestamp} • {r.taskStatus} • {r.priority}</div>
            <div>{r.todayTask}</div>
            {r.previousTask ? <div style={styles.muted}>Previous: {r.previousTask}</div> : null}
            {r.remarks ? <div style={styles.muted}>Remarks: {r.remarks}</div> : null}
          </div>
        ))}
      </div>
        </>
      )}
    </div>
  );
}
