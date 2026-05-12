import React, { useState } from "react";

function TutorSummary({ results, onSelectStudent, onLogout, onBackToInstructor }) {
  const [showPassPrompt, setShowPassPrompt] = useState(false);
  const [passInput, setPassInput] = useState("");

  const totalSubmissions = results.length;
  const plagiarismCount = results.filter(r => r.plagiarism_warning !== "Clear").length;

  const handleVerifyInstructor = () => {
    // Replace 'admin123' with your desired instructor password
    if (passInput === "admin123") {
      onBackToInstructor();
    } else {
      alert("Invalid Instructor Password");
      setPassInput("");
    }
  };

  const downloadCSV = () => {
    const headers = ["Student Name", "Enrollment Number", "Score", "Max Marks", "Grade", "Status"];
    const rows = results.map(r => [
      r.student_name, r.enrollment_number, r.total_marks, r.total_max_marks, r.grade,
      r.plagiarism_warning === "Clear" ? "Clean" : "Flagged"
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `GradeOps_Export.csv`;
    link.click();
  };

  return (
    <div style={styles.container}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      
      {/* PASSWORD OVERLAY */}
      {showPassPrompt && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={{marginTop: 0}}>Instructor Verification</h3>
            <p style={{fontSize: '13px', color: '#86948a'}}>Enter administrator password to return to Instructor Hub.</p>
            <input 
              type="password" 
              autoFocus
              style={styles.modalInput} 
              placeholder="••••••••" 
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerifyInstructor()}
            />
            <div style={styles.modalActions}>
              <button onClick={() => setShowPassPrompt(false)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleVerifyInstructor} style={styles.confirmBtn}>Verify</button>
            </div>
          </div>
        </div>
      )}

      <header style={styles.header}>
        <div>
          <h1 style={styles.brandTitle}>GradeOps <span style={styles.badge}>TA Dashboard</span></h1>
          <p style={styles.subtext}>AI-powered evaluation summary and integrity report.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => setShowPassPrompt(true)} style={styles.secondaryBtn}>
            <span className="material-symbols-outlined" style={{fontSize:'18px'}}>admin_panel_settings</span>
            Instructor Hub
          </button>
          <button onClick={downloadCSV} style={styles.secondaryBtn}>
            <span className="material-symbols-outlined" style={{fontSize:'18px'}}>download</span> 
            CSV
          </button>
          <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      <div style={styles.metricsRow}>
        <div style={styles.metricCard}><span style={styles.metricLabel}>TOTAL PAPERS</span><div style={styles.metricValue}>{totalSubmissions}</div></div>
        <div style={{ ...styles.metricCard, borderLeft: "4px solid #ff4d4d" }}><span style={styles.metricLabel}>PLAGIARISM FLAGS</span><div style={{ ...styles.metricValue, color: "#ff4d4d" }}>{plagiarismCount}</div></div>
        <div style={{ ...styles.metricCard, borderLeft: "4px solid #4edea3" }}><span style={styles.metricLabel}>AVG. PERFORMANCE</span><div style={{ ...styles.metricValue, color: "#4edea3" }}>A-</div></div>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>STUDENT IDENTITY</th>
              <th style={styles.th}>FINAL GRADE</th>
              <th style={styles.th}>INTEGRITY</th>
              <th style={{...styles.th, textAlign:"right"}}>EVALUATION</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, idx) => (
              <tr key={idx} style={styles.tr}>
                <td style={styles.td}>
                   <span style={{fontWeight: '600'}}>{r.student_name}</span><br/>
                   <span style={styles.enrollmentText}>{r.enrollment_number}</span>
                </td>
                <td style={{ ...styles.td, color: "#4edea3", fontWeight: "800" }}>{r.grade}</td>
                <td style={styles.td}>
                  {r.plagiarism_warning !== "Clear" ? (
                    <span style={{color: '#ff4d4d', fontSize: '11px', fontWeight: 'bold'}}>🚩 FLAG</span>
                  ) : (
                    <span style={{color: '#4edea3', fontSize: '11px', fontWeight: 'bold'}}>CLEAN</span>
                  )}
                </td>
                <td style={{ ...styles.td, textAlign: "right" }}>
                  <button onClick={() => onSelectStudent(idx)} style={styles.actionBtn}>Open Reviewer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#0e1511", color: "#dde4dd", minHeight: "100vh", padding: "40px 60px", fontFamily: "'Inter', sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" },
  brandTitle: { fontSize: "24px", fontWeight: "700", color: "#4edea3", margin: 0 },
  badge: { fontSize: "11px", background: "rgba(78,222,163,0.1)", padding: "4px 10px", borderRadius: "6px", marginLeft: "10px", color: "#4edea3" },
  subtext: { color: "#86948a", fontSize: "14px" },
  
  // Modals
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' },
  modal: { background: '#161d19', padding: '32px', borderRadius: '24px', border: '1px solid rgba(78,222,163,0.2)', width: '100%', maxWidth: '350px' },
  modalInput: { width: '100%', background: '#0e1511', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', color: '#fff', marginTop: '15px', boxSizing: 'border-box', outline: 'none' },
  modalActions: { display: 'flex', gap: '10px', marginTop: '20px' },
  confirmBtn: { flex: 1, background: '#4edea3', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', color: '#003824' },
  cancelBtn: { flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px', borderRadius: '10px', cursor: 'pointer' },

  // UI Components
  secondaryBtn: { background: "rgba(255, 255, 255, 0.03)", color: "#dde4dd", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 18px", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: '13px', fontWeight: '600' },
  logoutBtn: { background: "rgba(255, 77, 77, 0.1)", color: "#ff4d4d", border: "none", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: '600' },
  
  metricsRow: { display: "flex", gap: "20px", marginBottom: "30px" },
  metricCard: { flex: 1, background: "#161d19", padding: "24px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" },
  metricLabel: { fontSize: "10px", letterSpacing: "1.5px", color: "#86948a", fontWeight: '700' },
  metricValue: { fontSize: "32px", fontWeight: "800", marginTop: "10px" },
  
  tableCard: { background: "#161d19", borderRadius: "24px", overflow: "hidden", border: '1px solid rgba(255,255,255,0.05)' },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "20px", fontSize: "10px", color: "#86948a", borderBottom: "1px solid rgba(255,255,255,0.05)", letterSpacing: '1px' },
  tr: { borderBottom: "1px solid rgba(255,255,255,0.02)" },
  td: { padding: "18px 20px", fontSize: "14px" },
  enrollmentText: { fontSize: "11px", color: "#666" },
  actionBtn: { background: "transparent", color: "#4edea3", border: "none", cursor: "pointer", fontWeight: "700" }
};

export default TutorSummary;