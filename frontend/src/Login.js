import React, { useState } from "react";
import axios from "axios";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) return alert("Please fill in all fields");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post("http://127.0.0.1:8000/login", formData);

      if (response.data.access_token) {
        // Role is now handled by the backend response
        onLoginSuccess(response.data.role, response.data.access_token);
      }
    } catch (error) {
      alert("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
           <h1 style={styles.title}>GradeOps</h1>
        </div>
        
        <p style={styles.subtitle}>Secure infrastructure for AI-assisted academic evaluation.</p>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Username</label>
          <input 
            style={styles.input}
            placeholder="Enter username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input 
            style={styles.input}
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <button 
          onClick={handleLogin} 
          disabled={loading}
          style={{ 
            ...styles.button, 
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer" 
          }}
        >
          {loading ? "Authenticating..." : "Sign In"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    height: "100vh", 
    backgroundColor: "#0e1511", 
    fontFamily: "'Inter', sans-serif" 
  },
  card: { 
    padding: "48px 40px", 
    borderRadius: "24px", 
    backgroundColor: "#161d19", 
    border: "1px solid rgba(255,255,255,0.05)",
    width: "100%",
    maxWidth: "400px", 
    textAlign: "left",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
  },
  logoContainer: { marginBottom: "8px" },
  title: { margin: 0, color: "#4edea3", fontSize: "32px", fontWeight: "700", letterSpacing: "-1px" },
  subtitle: { margin: "0 0 32px 0", color: "#86948a", fontSize: "14px", lineHeight: "1.5" },
  inputGroup: { marginBottom: "20px" },
  label: { display: "block", color: "#dde4dd", fontSize: "13px", fontWeight: "600", marginBottom: "10px" },
  input: { 
    width: "100%", 
    padding: "14px 16px", 
    borderRadius: "10px", 
    border: "1px solid rgba(255,255,255,0.1)", 
    backgroundColor: "rgba(0,0,0,0.2)",
    color: "#fff",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
    transition: "border 0.2s ease"
  },
  button: { 
    width: "100%", 
    padding: "16px", 
    marginTop: "10px",
    border: "none", 
    borderRadius: "12px", 
    backgroundColor: "#4edea3", 
    color: "#003824", 
    fontWeight: "700", 
    fontSize: "16px",
    transition: "transform 0.1s active"
  }
};

export default Login;