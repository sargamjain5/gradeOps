import React, { useState, useEffect } from "react";
import axios from "axios";

function Instructor({ onLogout, onCheckTADashboard }) {
  const [students, setStudents] = useState([{ name: "", enrollment: "", file: null, preview: null }]);
  const [questions, setQuestions] = useState([{ question: "", rubric: "", marks: 10 }]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/results");
      setResults(res.data.reverse());
    } catch (e) { console.error("History fetch failed"); }
  };

  const updateStudent = (i, field, value) => {
    const updated = [...students];
    if (field === "file") {
      updated[i].file = value;
      updated[i].preview = value ? URL.createObjectURL(value) : null;
    } else {
      updated[i][field] = value;
    }
    setStudents(updated);
  };

  const removeStudent = (index) => {
    if (students.length > 1) {
      setStudents(students.filter((_, i) => i !== index));
    }
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this submission?")) return;
    await axios.delete(`http://127.0.0.1:8000/delete_submission/${id}`);
    fetchHistory();
  };

  const handleGrade = async () => {
    setLoading(true);
    const formData = new FormData();
    students.forEach(s => { if (s.file) formData.append("files", s.file); });
    formData.append("student_data", JSON.stringify(students));
    formData.append("questions", JSON.stringify(questions.map(q => ({...q, max_marks: q.marks}))));

    try {
      await axios.post("http://127.0.0.1:8000/grade", formData);
      setStudents([{ name: "", enrollment: "", file: null, preview: null }]);
      fetchHistory();
    } catch (e) { alert("Grading error"); }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />

      {/* HEADER SECTION */}
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={styles.brandTitle}>GradeOps <span style={styles.dashBadge}>Instructor Hub</span></h1>
        </div>
        
        <div style={styles.userSection}>
          <button onClick={onCheckTADashboard} style={styles.secondaryHeaderBtn}>
            <span className="material-symbols-outlined" style={{fontSize: '18px'}}>dashboard</span>
            TA Dashboard
          </button>
          
          <div style={styles.divider} />
          
          <button onClick={onLogout} style={styles.logoutBtn}>
            <span className="material-symbols-outlined" style={{fontSize: '18px'}}>logout</span>
            Logout
          </button>
          
          <div style={styles.avatar}>ID</div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.bentoGrid}>
          
          {/* 1. STUDENT SUBMISSION PANEL */}
          <section style={styles.largeCard}>
            <div style={styles.cardHeader}>
              <span className="material-symbols-outlined" style={styles.accentIcon}>cloud_upload</span>
              <h2 style={styles.cardTitle}>Student Submissions</h2>
            </div>
            
            <div style={styles.scrollBox}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>STUDENT NAME</th>
                    <th style={styles.th}>ROLL NUMBER</th>
                    <th style={styles.th}>FILE</th>
                    <th style={styles.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={i} style={styles.tr}>
                      <td><input placeholder="Ex: John Doe" style={styles.nakedInput} value={s.name} onChange={e => updateStudent(i, "name", e.target.value)} /></td>
                      <td><input placeholder="2412XXX" style={styles.nakedInput} value={s.enrollment} onChange={e => updateStudent(i, "enrollment", e.target.value)} /></td>
                      <td>
                        <label style={styles.uploadBtn}>
                          <input type="file" style={{display:'none'}} onChange={e => updateStudent(i, "file", e.target.files[0])} />
                          <span className="material-symbols-outlined" style={{fontSize:'18px'}}>attach_file</span>
                          {s.file ? s.file.name.slice(0, 10) + "..." : "Upload"}
                        </label>
                      </td>
                      <td>
                        <button onClick={() => removeStudent(i)} style={styles.rowDelete} disabled={students.length === 1}>
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button style={styles.ghostBtn} onClick={() => setStudents([...students, { name: "", enrollment: "", file: null }])}>
              <span className="material-symbols-outlined">add</span> Add Student
            </button>
          </section>

          {/* 2. GRADING RUBRIC PANEL */}
          <section style={styles.sideCard}>
            <div style={styles.cardHeader}>
              <span className="material-symbols-outlined" style={styles.accentIcon}>analytics</span>
              <h2 style={styles.cardTitle}>Grading Rubric</h2>
            </div>
            
            <div style={styles.scrollBox}>
              {questions.map((q, i) => (
                <div key={i} style={styles.rubricItem}>
                  <div style={styles.rubricTop}>
                    <textarea 
                      placeholder="Enter answer criteria or question..." 
                      style={styles.textArea}
                      value={q.question}
                      onChange={e => { const u = [...questions]; u[i].question = e.target.value; setQuestions(u); }}
                    />
                    <button onClick={() => removeQuestion(i)} style={styles.removeIconBtn} disabled={questions.length === 1}>
                      <span className="material-symbols-outlined" style={{fontSize: '18px'}}>close</span>
                    </button>
                  </div>
                  <div style={styles.rubricFooter}>
                    <span style={styles.tinyLabel}>MAX MARKS</span>
                    <div style={styles.marksWrapper}>
                      <input type="number" style={styles.marksInput} value={q.marks} onChange={e => { const u = [...questions]; u[i].marks = e.target.value; setQuestions(u); }} />
                      <span style={styles.unit}>PTS</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button style={styles.addCritBtn} onClick={() => setQuestions([...questions, { question: "", rubric: "", marks: 10 }])}>
              + Add Criterion
            </button>

            <button onClick={handleGrade} disabled={loading} style={styles.primaryBtn}>
              {loading ? "Processing Papers..." : "Run AI Grading"}
              <span className="material-symbols-outlined">bolt</span>
            </button>
          </section>
        </div>

        {/* 3. EVALUATION HISTORY */}
        <h2 style={styles.sectionTitle}>Evaluation History</h2>
        <div style={styles.historyGrid}>
          {results.map(r => (
            <div key={r._id} style={styles.resultCard}>
              <div style={styles.resHeader}>
                <div>
                  <h4 style={styles.resName}>{r.student_name}</h4>
                  <span style={styles.resRoll}>{r.enrollment_number}</span>
                </div>
                <div style={styles.gradeBadge}>{r.grade}</div>
              </div>
              <div style={styles.resActions}>
                <button onClick={() => window.open(r.file_url)} style={styles.viewBtn}>View Scan</button>
                <button onClick={() => deleteRecord(r._id)} style={styles.deleteBtn}>
                   <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#0e1511", color: "#dde4dd", fontFamily: "'Inter', sans-serif" },
  header: { height: "80px", padding: "0 60px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#111713" },
  brandTitle: { fontSize: "22px", fontWeight: "700", color: "#4edea3", letterSpacing: "-1px", margin: 0 },
  dashBadge: { fontSize: "11px", marginLeft: "10px", background: "rgba(78,222,163,0.1)", padding: "4px 10px", borderRadius: "6px", fontWeight: "500", verticalAlign: "middle", color: "#4edea3" },
  
  userSection: { display: "flex", alignItems: "center", gap: "15px" },
  secondaryHeaderBtn: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#bbcabf", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" },
  logoutBtn: { background: "transparent", border: "none", color: "#ff4d4d", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" },
  divider: { width: "1px", height: "24px", background: "rgba(255,255,255,0.1)" },
  avatar: { width: "36px", height: "36px", borderRadius: "10px", background: "#161d19", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#4edea3" },
  
  main: { padding: "40px 60px", maxWidth: "1400px", margin: "0 auto" },
  bentoGrid: { display: "flex", gap: "24px", marginBottom: "60px", alignItems: "flex-start" },
  
  largeCard: { flex: 2, background: "#161d19", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", padding: "24px" },
  sideCard: { flex: 1, background: "#1a211d", borderRadius: "24px", border: "1px solid rgba(78,222,163,0.2)", padding: "24px", position: "sticky", top: "20px" },
  cardHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" },
  accentIcon: { color: "#4edea3" },
  cardTitle: { fontSize: "18px", fontWeight: "600", margin: 0 },
  
  scrollBox: { maxHeight: "480px", overflowY: "auto", marginBottom: "20px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: "10px", color: "#666", letterSpacing: "1.5px", paddingBottom: "15px" },
  tr: { borderBottom: "1px solid rgba(255,255,255,0.03)" },
  nakedInput: { width: "100%", background: "transparent", border: "none", color: "#fff", padding: "18px 0", outline: "none", fontSize: "14px" },
  uploadBtn: { background: "rgba(78,222,163,0.05)", border: "1px dashed rgba(78,222,163,0.3)", borderRadius: "8px", padding: "8px 14px", color: "#4edea3", fontSize: "12px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" },
  rowDelete: { background: "transparent", border: "none", color: "#ff4d4d", opacity: 0.5, cursor: "pointer" },
  
  rubricItem: { background: "rgba(0,0,0,0.2)", borderRadius: "16px", padding: "16px", marginBottom: "15px", border: "1px solid rgba(255,255,255,0.05)" },
  rubricTop: { display: "flex", justifyContent: "space-between", gap: "10px" },
  textArea: { width: "100%", background: "transparent", border: "none", color: "#fff", resize: "none", height: "60px", outline: "none", fontSize: "13px", lineHeight: "1.5" },
  removeIconBtn: { background: "rgba(255,77,77,0.1)", border: "none", color: "#ff4d4d", borderRadius: "6px", width: "24px", height: "24px", cursor: "pointer" },
  rubricFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" },
  tinyLabel: { fontSize: "9px", color: "#666", fontWeight: "700" },
  marksWrapper: { display: "flex", alignItems: "center", gap: "4px" },
  marksInput: { background: "transparent", border: "none", color: "#4edea3", width: "35px", textAlign: "right", fontSize: "16px", fontWeight: "800" },
  unit: { fontSize: "10px", color: "#4edea3", opacity: 0.6 },
  
  ghostBtn: { width: "100%", background: "transparent", border: "1px dashed rgba(255,255,255,0.1)", color: "#86948a", padding: "14px", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  addCritBtn: { background: "transparent", border: "none", color: "#4edea3", cursor: "pointer", fontSize: "12px", fontWeight: "600", marginBottom: "20px" },
  primaryBtn: { width: "100%", background: "#4edea3", color: "#003824", border: "none", borderRadius: "14px", padding: "16px", fontWeight: "800", fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" },
  
  sectionTitle: { fontSize: "20px", fontWeight: "700", marginBottom: "24px" },
  historyGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" },
  resultCard: { background: "#161d19", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "24px" },
  resHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" },
  resName: { margin: 0, fontSize: "17px", fontWeight: "600" },
  resRoll: { fontSize: "12px", color: "#666" },
  gradeBadge: { width: "40px", height: "40px", background: "rgba(78,222,163,0.1)", border: "1px solid #4edea3", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#4edea3", fontWeight: "900" },
  resActions: { display: "flex", gap: "10px" },
  viewBtn: { flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "10px", borderRadius: "10px", cursor: "pointer", fontSize: "13px" },
  deleteBtn: { background: "rgba(255,77,77,0.05)", border: "1px solid rgba(255,77,77,0.1)", color: "#ff4d4d", padding: "10px", borderRadius: "10px", cursor: "pointer" }
};

export default Instructor;