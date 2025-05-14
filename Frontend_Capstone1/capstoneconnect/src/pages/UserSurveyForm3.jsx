"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"

const UserSurveyForm = () => {
  const navigate = useNavigate()
  const [roles, setRoles] = useState({
    uiUx: false,
    gameDev: false,
    frontend: false,
    teamLead: false,
    backend: false,
    techWriter: false,
    other: false,
  })
  const [otherRole, setOtherRole] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userId, setUserId] = useState(null);  // or some default value


  // Load existing data if available
  useEffect(() => {
    const savedData = localStorage.getItem("surveyData")
    if (savedData) {
      const surveyData = JSON.parse(savedData)
      if (surveyData.preferredRoles && surveyData.preferredRoles.length > 0) {
        const newRoles = { ...roles }

        surveyData.preferredRoles.forEach((role) => {
          if (role === "UI/UX Developer") newRoles.uiUx = true
          else if (role === "Game Developer") newRoles.gameDev = true
          else if (role === "Frontend Developer") newRoles.frontend = true
          else if (role === "Team Leader") newRoles.teamLead = true
          else if (role === "Backend Developer") newRoles.backend = true
          else if (role === "Technical Writer") newRoles.techWriter = true
          else {
            newRoles.other = true
            setOtherRole(role)
          }
        })

        setRoles(newRoles)
      }
    }
  }, [])

  const handleRoleChange = (role) => {
    setRoles((prev) => ({
      ...prev,
      [role]: !prev[role],
    }))
  }

  const handleBack = () => {
    navigate("/user-survey-form2")
  }

  const handleSubmit = async () => {
    // Convert selected roles to array format for the backend
    const selectedRoles = []
    if (roles.uiUx) selectedRoles.push("UI/UX Developer")
    if (roles.gameDev) selectedRoles.push("Game Developer")
    if (roles.frontend) selectedRoles.push("Frontend Developer")
    if (roles.teamLead) selectedRoles.push("Team Leader")
    if (roles.backend) selectedRoles.push("Backend Developer")
    if (roles.techWriter) selectedRoles.push("Technical Writer")
    if (roles.other && otherRole.trim()) selectedRoles.push(otherRole.trim())

    // Get existing data from localStorage
    const existingData = localStorage.getItem("surveyData")
    const surveyData = existingData ? JSON.parse(existingData) : {}

    // Prepare complete survey data
    const completeSurveyData = {
      ...surveyData,
      preferredRoles: selectedRoles,
    }

    try {
      setIsLoading(true)
      setError(null)

      // Call the Spring Boot backend API
      const response = await fetch(`http://localhost:8080/api/survey/save/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeSurveyData),
         credentials: "include", // Include cookies (JWT token) in the request
        });
    

      if (!response.ok) {
        throw new Error("Failed to submit survey")
      }

      // Clear localStorage after successful submission
      localStorage.removeItem("surveyData")

      // Navigate to dashboard
      navigate("/dashboard")
    } catch (err) {
      console.error("Error submitting survey:", err)
      setError("Failed to submit survey. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const checkboxWrapper = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    color: "#FFFFFF",
    fontFamily: "Poppins, sans-serif",
    marginLeft: "30px",
    marginBottom: "4px",
  }

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "#CA9F58",
      fontFamily: "Poppins, sans-serif",
    },
    header: {
      backgroundColor: "#FFFFFF",
      padding: "20px",
      textAlign: "center",
      color: "#267987",
    },
    title: {
      fontSize: "32px",
      margin: "0",
      fontWeight: "bold",
      fontFamily: "Poppins, sans-serif",
    },
    main: {
      flex: 1,
      maxWidth: "800px",
      margin: "32px auto",
      padding: "32px",
      backgroundColor: "#CA9F58",
      borderRadius: "8px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    footer: {
      backgroundColor: "#FFFFFF",
      padding: "16px",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
    },
    logo: {
      height: "30px",
      width: "auto",
    },
    skillsSection: {
      marginBottom: "32px",
    },
    sectionTitle: {
      color: "#FFFFFF",
      fontSize: "24px",
      marginBottom: "16px",
      textAlign: "center",
      fontFamily: "Poppins, sans-serif",
    },
    subtitle: {
      textAlign: "center",
      color: "#FFFFFF",
      marginBottom: "64px",
      fontFamily: "Poppins, sans-serif",
    },
    checkboxGroup: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "16px",
      maxWidth: "600px",
      margin: "0 auto",
    },
    checkboxLabel: {
      color: "#FFFFFF",
      fontFamily: "Poppins, sans-serif",
      pointerEvents: "none",
    },
    checkbox: {
      width: "20px",
      height: "20px",
      cursor: "pointer",
      appearance: "none !important",
      "-webkit-appearance": "none !important",
      "-moz-appearance": "none !important",
      border: "2px solid #FFFFFF",
      borderRadius: "3px",
      backgroundColor: "transparent",
      position: "relative",
      '&[type="checkbox"]:checked': {
        backgroundColor: "#514BC3 !important",
      },
    },
    otherInput: {
      marginLeft: "8px",
      padding: "4px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      backgroundColor: "#CA9F58",
      color: "#FFFFFF",
      pointerEvents: "none",
      opacity: "0.5",
      "&::-webkit-input-placeholder": {
        color: "#FFFFFF",
      },
      "&::-moz-placeholder": {
        color: "#FFFFFF",
      },
      "&:-ms-input-placeholder": {
        color: "#FFFFFF",
      },
      "&::placeholder": {
        color: "#FFFFFF",
      },
    },
    otherInputActive: {
      marginLeft: "8px",
      padding: "4px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      backgroundColor: "#CA9F58",
      color: "#FFFFFF",
      pointerEvents: "auto",
      opacity: "1",
      "&::-webkit-input-placeholder": {
        color: "#FFFFFF",
      },
      "&::-moz-placeholder": {
        color: "#FFFFFF",
      },
      "&:-ms-input-placeholder": {
        color: "#FFFFFF",
      },
      "&::placeholder": {
        color: "#FFFFFF",
      },
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "-1px",
    },
    backButton: {
      backgroundColor: "#CA9F58",
      color: "white",
      padding: "5px 32px",
      border: "1px solid #FFFFFF",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      marginTop: "32px",
      fontFamily: "Poppins, sans-serif",
      alignSelf: "flex-end",
    },
    submitButton: {
      backgroundColor: "#267987",
      color: "white",
      padding: "5px 21px",
      border: "none",
      borderRadius: "4px",
      cursor: isLoading ? "not-allowed" : "pointer",
      fontSize: "16px",
      marginTop: "32px",
      fontFamily: "Poppins, sans-serif",
      alignSelf: "flex-end",
      opacity: isLoading ? 0.7 : 1,
    },
    errorMessage: {
      color: "#FF0000",
      textAlign: "center",
      marginTop: "10px",
      fontFamily: "Poppins, sans-serif",
    },
    capstoneText: {
      color: "#CA9F58",
      fontWeight: "bold",
      fontFamily: "Poppins, sans-serif",
    },
    connectText: {
      color: "#267987",
      fontWeight: "bold",
      fontFamily: "Poppins, sans-serif",
    },
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>User Preference Survey</h1>
      </header>

      <main style={styles.main}>
        <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div style={styles.skillsSection}>
            <h2 style={styles.sectionTitle}>Preferred Roles</h2>
            <p style={styles.subtitle}>Select your preferred roles</p>

            <div style={styles.checkboxGroup}>
              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={roles.uiUx}
                  onChange={() => handleRoleChange("uiUx")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: roles.uiUx ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>UI/UX Developer</span>
              </div>

              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={roles.gameDev}
                  onChange={() => handleRoleChange("gameDev")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: roles.gameDev ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>Game Developer</span>
              </div>

              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={roles.frontend}
                  onChange={() => handleRoleChange("frontend")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: roles.frontend ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>Frontend Developer</span>
              </div>

              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={roles.teamLead}
                  onChange={() => handleRoleChange("teamLead")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: roles.teamLead ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>Team Leader</span>
              </div>

              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={roles.backend}
                  onChange={() => handleRoleChange("backend")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: roles.backend ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>Backend Developer</span>
              </div>

              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={roles.techWriter}
                  onChange={() => handleRoleChange("techWriter")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: roles.techWriter ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>Technical Writer</span>
              </div>

              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={roles.other}
                  onChange={() => handleRoleChange("other")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: roles.other ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>Others:</span>
                <input
                  type="text"
                  value={otherRole}
                  onChange={(e) => setOtherRole(e.target.value)}
                  style={{
                    marginLeft: "8px",
                    padding: "4px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "#CA9F58",
                    color: "#FFFFFF",
                    pointerEvents: roles.other ? "auto" : "none",
                    opacity: roles.other ? "1" : "0.5",
                  }}
                  placeholder="Specify other roles"
                  disabled={!roles.other}
                />
              </div>
            </div>
          </div>

          {error && <p style={styles.errorMessage}>{error}</p>}

          <div style={styles.buttonContainer}>
            <button type="button" style={styles.backButton} onClick={handleBack} disabled={isLoading}>
              Back
            </button>

            <button type="button" style={styles.submitButton} onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </main>

      <footer style={styles.footer}>
      
        <img src={logo} alt="CapstoneConnect Logo" style={styles.logo} />
  
        <span>
          <span style={styles.capstoneText}>Capstone</span>
          <span style={styles.connectText}>Connect</span>
        </span>
      </footer>
    </div>
  )
}

const style = document.createElement("style")
style.textContent = `
  .white-placeholder::placeholder {
    color: white !important;
  }
`
document.head.appendChild(style)

export default UserSurveyForm
