import React, { useState } from "react";
import LandingPage from "./LandingPage";
import Login from "./Login";
import Instructor from "./Instructor";
import Tutor from "./Tutor";

function App() {
  const [view, setView] = useState("landing"); 
  const [role, setRole] = useState("");

  const handleLoginSuccess = (userRole) => {
    setRole(userRole);
    setView("dashboard");
  };

  const handleLogout = () => {
    setRole("");
    setView("landing");
  };

  // Logic to jump from Professor view to TA view
  const switchToTADashboard = () => {
    setRole("TA");
  };

  // Logic to jump back from TA view to Professor view
  const switchToInstructor = () => {
    setRole("Professor");
  };

  if (view === "landing") return <LandingPage onEnterLogin={() => setView("login")} />;
  if (view === "login") return <Login onLoginSuccess={handleLoginSuccess} />;

  return (
    <>
      {role === "TA" ? (
        <Tutor 
          onLogout={handleLogout} 
          onBackToInstructor={switchToInstructor} 
        /> 
      ) : (
        <Instructor 
          onLogout={handleLogout} 
          onCheckTADashboard={switchToTADashboard} 
        />
      )}
    </>
  );
}

export default App;