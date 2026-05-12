import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TutorSummary from "./TutorSummary";

function Tutor({ onLogout, onBackToInstructor }) {
  const [results, setResults] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState("summary"); 
  const [overrides, setOverrides] = useState({});
  const debounceTimer = useRef(null);

  useEffect(() => { 
    fetchResults(); 
  }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/results");
      setResults(res.data);
    } catch (err) { 
      console.error("Failed to fetch results", err); 
    }
  };

  const handleLiveUpdate = (id, newVal) => {
    setOverrides({ ...overrides, [id]: newVal });
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await axios.put(`http://127.0.0.1:8000/update_marks/${id}`, { 
          marks: parseFloat(newVal) || 0 
        });
        // Update local results with the new grade calculated by backend
        setResults(prev => prev.map(r => 
          r._id === id ? { ...r, total_marks: newVal, grade: res.data.grade } : r
        ));
      } catch (err) { 
        console.error("Update failed", err); 
      }
    }, 500);
  };

  // 1. SHOW SUMMARY DASHBOARD
  if (view === "summary") {
    return (
      <TutorSummary 
        results={results} 
        onSelectStudent={(idx) => { setCurrentIndex(idx); setView("reviewer"); }} 
        onLogout={onLogout} 
        onBackToInstructor={onBackToInstructor} 
      />
    );
  }

  // Loading state if entering reviewer with no data
  if (results.length === 0) return <div style={styles.loader}>Loading Evaluation Queue...</div>;

  const current = results[currentIndex];

  // 2. SHOW INDIVIDUAL REVIEWER
  return (
    <div style={styles.container}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700&display=swap" />
      
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={() => setView("summary")} style={styles.exitBtn}>
            <span className="material-symbols-outlined">arrow_back</span> Exit to Summary
          </button>
          <div style={styles.divider} />
          <div>
            <h3 style={styles.studentNameHeader}>{current.student_name}</h3>
            <span style={styles.queueText}>Roll No: {current.enrollment_number} • {currentIndex + 1} of {results.length}</span>
          </div>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.statGroup}>
            <span style={styles.statLabel}>CALCULATED GRADE</span>
            <div style={styles.statValueRow}>
              <span style={styles.statPerc}>
                {Math.round(((overrides[current._id] ?? current.total_marks) / current.total_max_marks) * 100)}%
              </span>
              <div style={styles.gradeBadge}>{current.grade}</div>
            </div>
          </div>
        </div>
      </header>

      <div style={styles.mainContent}>
        {/* Paper Preview */}
        <div style={styles.imageContainer}>
          <div style={styles.imageWrapper}>
            <img src={current.file_url} alt="Student Paper" style={styles.mainImg} />
          </div>
        </div>

        {/* AI Analysis Sidebar */}
        <aside style={styles.sidebar}>
          {current.plagiarism_warning !== "Clear" && (
            <div style={styles.plagiarismCard}>
              <div style={styles.alertIcon}><span className="material-symbols-outlined">warning</span></div>
              <div>
                <div style={styles.alertTitle}>PLAGIARISM ALERT</div>
                <div style={styles.alertBody}>{current.plagiarism_warning}</div>
              </div>
            </div>
          )}

          <div style={styles.section}>
            <div style={styles.sectionHeader}><span className="material-symbols-outlined">notes</span> OCR TRANSCRIPTION</div>
            <div style={styles.ocrContent}>{current.ocr_answer}</div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHeader}><span className="material-symbols-outlined">analytics</span> AI EVALUATION</div>
            <div style={styles.rubricScroll}>
              {current.question_results?.map((q, i) => (
                <div key={i} style={styles.bentoCard}>
                  <div style={styles.bentoHeader}>
                    <span style={styles.qNum}>QUESTION {i+1}</span>
                    <span style={styles.qScore}>{q.marks} pts</span>
                  </div>
                  <div style={styles.qText}>{q.question}</div>
                  <div style={styles.feedbackQuote}>"{q.feedback}"</div>
                </div>
              ))}
            </div>
          </div>

          {/* Marks Override Footer inside Sidebar */}
          <div style={styles.overrideSection}>
            <div style={styles.inputLabel}>FINAL SCORE OVERRIDE</div>
            <div style={styles.inputWrapper}>
              <input 
                type="number" 
                value={overrides[current._id] ?? current.total_marks} 
                onChange={(e) => handleLiveUpdate(current._id, e.target.value)}
                style={styles.marksInput}
              />
              <span style={styles.maxMarksText}>/ {current.total_max_marks}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", backgroundColor: "#0b100d", color: "#e0e7e1", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" },
  loader: { color: "#4edea3", padding: "50px", textAlign: "center", background: "#0b100d", height: "100vh" },
  header: { height: "80px", padding: "0 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#111713" },
  headerLeft: { display: "flex", alignItems: "center", gap: "25px" },
  exitBtn: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "10px 18px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontSize: "12px" },
  divider: { width: "1px", height: "40px", background: "rgba(255,255,255,0.1)" },
  studentNameHeader: { margin: 0, color: "#fff", fontSize: "18px", fontWeight: "700" },
  queueText: { fontSize: "12px", color: "#666" },
  statGroup: { textAlign: "right" },
  statLabel: { fontSize: "10px", color: "#666", letterSpacing: "1px", fontWeight: "700" },
  statValueRow: { display: "flex", alignItems: "center", gap: "15px", marginTop: "4px" },
  statPerc: { fontSize: "32px", fontWeight: "900", color: "#4edea3" },
  gradeBadge: { background: "rgba(78,222,163,0.15)", color: "#4edea3", padding: "4px 12px", borderRadius: "6px", fontWeight: "800", border: "1px solid rgba(78,222,163,0.3)" },
  mainContent: { flex: 1, display: "flex", overflow: "hidden" },
  imageContainer: { flex: 1, padding: "40px", overflowY: "auto", display: "flex", justifyContent: "center", background: "#080c09" },
  imageWrapper: { maxWidth: "850px", width: "100%" },
  mainImg: { width: "100%", borderRadius: "8px", boxShadow: "0 30px 60px rgba(0,0,0,0.8)" },
  sidebar: { width: "450px", background: "#111713", borderLeft: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", padding: "24px", overflowY: "auto" },
  plagiarismCard: { background: "rgba(255, 77, 77, 0.1)", border: "1px solid rgba(255,77,77,0.2)", borderRadius: "12px", padding: "14px", display: "flex", gap: "12px", marginBottom: "25px" },
  alertIcon: { color: "#ff4d4d" },
  alertTitle: { fontSize: "10px", fontWeight: "900", color: "#ff4d4d" },
  alertBody: { fontSize: "12px", color: "#e0e7e1", marginTop: "2px" },
  section: { marginBottom: "30px" },
  sectionHeader: { fontSize: "10px", color: "#666", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" },
  ocrContent: { background: "rgba(0,0,0,0.2)", padding: "15px", borderRadius: "12px", fontSize: "13px", lineHeight: "1.6", color: "#a0aaa2", border: "1px solid rgba(255,255,255,0.03)" },
  bentoCard: { background: "#19211c", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "10px" },
  bentoHeader: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
  qNum: { fontSize: "10px", fontWeight: "800", color: "#4edea3" },
  qScore: { fontSize: "11px", color: "#4edea3", fontWeight: "700" },
  qText: { fontSize: "13px", fontWeight: "600", marginBottom: "8px" },
  feedbackQuote: { fontSize: "12px", fontStyle: "italic", color: "#86948a", borderLeft: "2px solid #4edea3", paddingLeft: "10px" },
  overrideSection: { marginTop: "auto", background: "#1a231e", padding: "20px", borderRadius: "16px", border: "1px solid rgba(78,222,163,0.2)" },
  inputLabel: { fontSize: "10px", color: "#86948a", fontWeight: "800", marginBottom: "8px", textAlign: "center" },
  inputWrapper: { display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" },
  marksInput: { background: "transparent", border: "none", color: "#4edea3", fontSize: "38px", fontWeight: "900", width: "90px", textAlign: "center", outline: "none" },
  maxMarksText: { fontSize: "14px", color: "#666", fontWeight: "700" }
};

export default Tutor;