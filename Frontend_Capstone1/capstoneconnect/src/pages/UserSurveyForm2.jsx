"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"

const UserSurveyForm = () => {
  const navigate = useNavigate()
  const [interests, setInterests] = useState({
    webApp: false,
    ecommerce: false,
    mobileApp: false,
    gameDev: false,
    taskManagement: false,
    aiDev: false,
    other: false,
  })
  const [otherInterest, setOtherInterest] = useState("")

  // Load existing data if available
  useEffect(() => {
    const savedData = localStorage.getItem("surveyData")
    if (savedData) {
      const surveyData = JSON.parse(savedData)
      if (surveyData.projectInterests && surveyData.projectInterests.length > 0) {
        const newInterests = { ...interests }

        surveyData.projectInterests.forEach((interest) => {
          if (interest === "Web App Development") newInterests.webApp = true
          else if (interest === "E-Commerce Systems") newInterests.ecommerce = true
          else if (interest === "Mobile App Development") newInterests.mobileApp = true
          else if (interest === "Game Development") newInterests.gameDev = true
          else if (interest === "Task Management Systems") newInterests.taskManagement = true
          else if (interest === "AI Development") newInterests.aiDev = true
          else {
            newInterests.other = true
            setOtherInterest(interest)
          }
        })

        setInterests(newInterests)
      }
    }
  }, [])

  const handleInterestChange = (interest) => {
    setInterests((prev) => ({
      ...prev,
      [interest]: !prev[interest],
    }))
  }

  const handleBack = () => {
    navigate("/user-survey-form")
  }

  const handleNext = () => {
    // Convert selected interests to array format for the backend
    const selectedInterests = []
    if (interests.webApp) selectedInterests.push("Web App Development")
    if (interests.ecommerce) selectedInterests.push("E-Commerce Systems")
    if (interests.mobileApp) selectedInterests.push("Mobile App Development")
    if (interests.gameDev) selectedInterests.push("Game Development")
    if (interests.taskManagement) selectedInterests.push("Task Management Systems")
    if (interests.aiDev) selectedInterests.push("AI Development")
    if (interests.other && otherInterest.trim()) selectedInterests.push(otherInterest.trim())

    // Save to localStorage for use in other pages
    const existingData = localStorage.getItem("surveyData")
    const surveyData = existingData ? JSON.parse(existingData) : {}

    localStorage.setItem(
      "surveyData",
      JSON.stringify({
        ...surveyData,
        projectInterests: selectedInterests,
      }),
    )

    navigate("/user-survey-form3")
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
    nextButton: {
      backgroundColor: "#267987",
      color: "white",
      padding: "5px 32px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      marginTop: "32px",
      fontFamily: "Poppins, sans-serif",
      alignSelf: "flex-end",
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
            <h2 style={styles.sectionTitle}>Project Interests</h2>
            <p style={styles.subtitle}>Select your project interests</p>

            <div style={styles.checkboxGroup}>
              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={interests.webApp}
                  onChange={() => handleInterestChange("webApp")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: interests.webApp ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>Web App Development</span>
              </div>

              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={interests.ecommerce}
                  onChange={() => handleInterestChange("ecommerce")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: interests.ecommerce ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>E-Commerce Systems</span>
              </div>

              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={interests.mobileApp}
                  onChange={() => handleInterestChange("mobileApp")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: interests.mobileApp ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>Mobile App Development</span>
              </div>

              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={interests.gameDev}
                  onChange={() => handleInterestChange("gameDev")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: interests.gameDev ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>Game Development</span>
              </div>

              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={interests.taskManagement}
                  onChange={() => handleInterestChange("taskManagement")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: interests.taskManagement ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>Task Management Systems</span>
              </div>

              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={interests.aiDev}
                  onChange={() => handleInterestChange("aiDev")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: interests.aiDev ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>AI Development</span>
              </div>

              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={interests.other}
                  onChange={() => handleInterestChange("other")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: interests.other ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>Others:</span>
                <input
                  type="text"
                  value={otherInterest}
                  onChange={(e) => setOtherInterest(e.target.value)}
                  style={{
                    marginLeft: "8px",
                    padding: "4px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "#CA9F58",
                    color: "#FFFFFF",
                    pointerEvents: interests.other ? "auto" : "none",
                    opacity: interests.other ? "1" : "0.5",
                  }}
                  placeholder="Specify other interests"
                  disabled={!interests.other}
                />
              </div>
            </div>
          </div>
          <div style={styles.buttonContainer}>
            <button type="button" style={styles.backButton} onClick={handleBack}>
              Back
            </button>

            <button type="button" style={styles.nextButton} onClick={handleNext}>
              Next
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
