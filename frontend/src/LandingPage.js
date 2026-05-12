import React, { useState, useEffect } from "react";

function LandingPage({ onEnterLogin }) {
  const [typedText, setTypedText] = useState("");
  const fullText = "Empower Educators.";
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timer = setTimeout(() => {
        setTypedText((prev) => prev + fullText.charAt(index));
        setIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [index, fullText]);

  return (
    <div style={styles.container}>
      {/* Material Symbols for consistent, professional icons */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <span style={styles.brandName}>GradeOps</span>
          <div style={styles.navRight}>
             <button onClick={onEnterLogin} style={styles.signInBtn}>Sign In</button>
             <button onClick={onEnterLogin} style={styles.navCta}>Get Started</button>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.chip} className="fade-in">
            <span className="material-symbols-outlined" style={styles.chipIcon}>auto_awesome</span>
            <span style={styles.chipText}>REVOLUTIONIZING PEDAGOGY</span>
          </div>
          <h1 style={styles.title} className="fade-in">
            Automate Grades. <br />
            <span style={styles.highlightText}>{typedText}<span className="cursor">|</span></span>
          </h1>
          <p style={styles.subtitle} className="fade-in-delayed">
            The ultimate AI-powered assistant for OCR transcription, 
            intelligent grading, and plagiarism detection.
          </p>
          <div style={styles.heroBtns} className="fade-in-delayed">
            <button onClick={onEnterLogin} style={styles.ctaBtn}>Get Started →</button>
            <button style={styles.secBtn}>View Features</button>
          </div>
        </section>

        {/* Workflow Section: Uniform Font / Inter */}
        <section style={styles.workflowSection}>
          <div style={styles.workflowGrid}>
            {[
              { num: "01", title: "Scan", desc: "Snap or upload student papers" },
              { num: "02", title: "Transcribe", desc: "OCR converts to clean text" },
              { num: "03", title: "Grade", desc: "AI applies your rubric" },
              { num: "04", title: "Return", desc: "Personalized feedback delivered" }
            ].map((step, i) => (
              <div key={i} style={styles.workflowItem}>
                <span style={styles.wfNum}>{step.num}</span>
                <h4 style={styles.wfTitle}>{step.title}</h4>
                <p style={styles.wfDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Structured Bento Grid: Boxes for Features */}
        <section style={styles.gridSection}>
          <div style={styles.bentoGrid}>
            
            {/* Box 1: OCR (Large) */}
            <div style={{ ...styles.gridItem, ...styles.largeItem }}>
              <div style={styles.cardHeader}>
                <span className="material-symbols-outlined" style={styles.icon}>document_scanner</span>
                <span style={styles.boxTag}>CORE ENGINE</span>
              </div>
              <h3 style={styles.cardTitle}>OCR Transcription</h3>
              <p style={styles.cardText}>High-fidelity handwriting recognition. Convert physical papers into digital data instantly.</p>
              <div style={styles.abstractVisual}>
                <div style={styles.vLine}></div>
                <div style={{ ...styles.vLine, width: '70%' }}></div>
                <div style={styles.vProgress}><div style={styles.vFill}></div></div>
              </div>
            </div>

            {/* Box 2: Integrity */}
            <div style={styles.gridItem}>
              <span className="material-symbols-outlined" style={styles.icon}>verified_user</span>
              <h3 style={styles.cardTitle}>Integrity Check</h3>
              <p style={styles.cardText}>Deep-search analysis to ensure academic integrity across sources.</p>
            </div>

            {/* Box 3: Feedback */}
            <div style={styles.gridItem}>
              <span className="material-symbols-outlined" style={styles.icon}>chat_bubble</span>
              <h3 style={styles.cardTitle}>Instant Feedback</h3>
              <p style={styles.cardText}>AI-generated comments based precisely on your custom rubrics.</p>
            </div>

            {/* Box 4: Insights (Large) */}
            <div style={{ ...styles.gridItem, ...styles.largeItem }}>
              <div style={styles.wideFlex}>
                <div style={{ flex: 1 }}>
                  <span className="material-symbols-outlined" style={styles.icon}>insights</span>
                  <h3 style={styles.cardTitle}>Intelligent Insights</h3>
                  <p style={styles.cardText}>Track student progress and performance with automated data visualization.</p>
                </div>
                <div style={styles.abstractChart}>
                  {[40, 70, 45, 90, 60].map((h, i) => (
                    <div key={i} style={{ ...styles.chartBar, height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <p style={styles.copyright}>© 2026 GradeOps AI. Precision in Pedagogy.</p>
      </footer>

      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cursor { color: #4edea3; animation: blink 1s step-end infinite; }
        .fade-in { animation: fadeInUp 0.8s ease-out forwards; }
        .fade-in-delayed { opacity: 0; animation: fadeInUp 0.8s ease-out 0.4s forwards; }
        body { margin: 0; background-color: #0e1511; color: #dde4dd; -webkit-font-smoothing: antialiased; }
      `}</style>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#0e1511", color: "#dde4dd", fontFamily: "'Inter', sans-serif" },
  nav: { borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0 60px" },
  navContent: { maxWidth: "1200px", margin: "0 auto", height: "80px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  brandName: { fontSize: "24px", fontWeight: "700", color: "#4edea3", letterSpacing: "-0.5px" },
  navRight: { display: "flex", gap: "24px", alignItems: "center" },
  signInBtn: { color: "#bbcabf", background: "none", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  navCta: { backgroundColor: "rgba(78, 222, 163, 0.1)", color: "#4edea3", border: "1px solid rgba(78, 222, 163, 0.2)", padding: "8px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  
  main: { maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" },
  hero: { textAlign: "center", marginBottom: "100px", paddingTop: "60px" },
  chip: { display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(78, 222, 163, 0.05)", border: "1px solid rgba(78, 222, 163, 0.15)", padding: "6px 16px", borderRadius: "20px", marginBottom: "24px" },
  chipIcon: { fontSize: "16px", color: "#4edea3" },
  chipText: { color: "#4edea3", fontSize: "11px", fontWeight: "700", letterSpacing: "1.2px" },
  title: { fontSize: "64px", fontWeight: "800", lineHeight: "1.1", marginBottom: "24px", color: "#dde4dd" },
  highlightText: { color: "#4edea3" },
  subtitle: { fontSize: "18px", color: "#bbcabf", maxWidth: "600px", margin: "0 auto 40px auto", lineHeight: "1.6" },
  heroBtns: { display: "flex", gap: "16px", justifyContent: "center" },
  ctaBtn: { padding: "16px 36px", fontSize: "16px", borderRadius: "12px", border: "none", backgroundColor: "#4edea3", color: "#003824", fontWeight: "700", cursor: "pointer" },
  secBtn: { padding: "16px 36px", fontSize: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "none", color: "#dde4dd", fontWeight: "600", cursor: "pointer" },

  // Workflow (Inter-based Serif Replacement)
  workflowSection: { marginBottom: "120px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "60px" },
  workflowGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "40px" },
  workflowItem: { display: "flex", flexDirection: "column", gap: "12px" },
  wfNum: { color: "#4edea3", fontSize: "13px", fontWeight: "700", opacity: 0.8, fontFamily: "monospace" },
  wfTitle: { fontSize: "32px", color: "#fff", fontWeight: "700", margin: 0, letterSpacing: "-0.5px" },
  wfDesc: { fontSize: "14px", color: "#bbcabf", lineHeight: "1.5", margin: 0 },

  // Bento Grid Features
  gridSection: { paddingBottom: "100px" },
  bentoGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
  gridItem: { background: "#161d19", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "32px" },
  largeItem: { gridColumn: "span 2" },
  wideFlex: { display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" },
  icon: { fontSize: "32px", color: "#4edea3", marginBottom: "16px", display: "block" },
  boxTag: { fontSize: "10px", fontWeight: "700", color: "#4edea3", opacity: 0.5, letterSpacing: "1px" },
  cardTitle: { fontSize: "22px", fontWeight: "700", marginBottom: "12px", color: "#fff" },
  cardText: { fontSize: "14px", color: "#bbcabf", lineHeight: "1.6" },

  // CSS Mockups
  abstractVisual: { marginTop: "24px", padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: "12px" },
  vLine: { height: "4px", background: "rgba(255,255,255,0.05)", marginBottom: "8px", borderRadius: "2px" },
  vProgress: { height: "4px", width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: "2px" },
  vFill: { height: "100%", width: "40%", backgroundColor: "#4edea3" },
  abstractChart: { display: "flex", alignItems: "flex-end", gap: "6px", height: "80px" },
  chartBar: { width: "10px", background: "rgba(78, 222, 163, 0.2)", borderRadius: "3px" },

  footer: { padding: "40px 20px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" },
  copyright: { color: "rgba(187, 202, 191, 0.4)", fontSize: "12px" }
};

export default LandingPage;