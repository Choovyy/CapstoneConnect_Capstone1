"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"

const UserSurveyForm = () => {
  const navigate = useNavigate()
  const [skills, setSkills] = useState({
    cLanguage: false,
    php: false,
    htmlCss: false,
    javascript: false,
    java: false,
    python: false,
    other: false,
  })
  const [otherSkill, setOtherSkill] = useState("")

  // Load existing data if available
  useEffect(() => {
    const savedData = localStorage.getItem("surveyData")
    if (savedData) {
      const surveyData = JSON.parse(savedData)
      if (surveyData.technicalSkills && surveyData.technicalSkills.length > 0) {
        const newSkills = { ...skills }

        surveyData.technicalSkills.forEach((skill) => {
          if (skill === "C Language") newSkills.cLanguage = true
          else if (skill === "PHP") newSkills.php = true
          else if (skill === "HTML and CSS") newSkills.htmlCss = true
          else if (skill === "JavaScript") newSkills.javascript = true
          else if (skill === "Java") newSkills.java = true
          else if (skill === "Python") newSkills.python = true
          else {
            newSkills.other = true
            setOtherSkill(skill)
          }
        })

        setSkills(newSkills)
      }
    }
  }, [])

  const handleSkillChange = (skill) => {
    setSkills((prev) => ({
      ...prev,
      [skill]: !prev[skill],
    }))
  }

  const handleNext = () => {
    // Convert selected skills to array format for the backend
    const selectedSkills = []
    if (skills.cLanguage) selectedSkills.push("C Language")
    if (skills.php) selectedSkills.push("PHP")
    if (skills.htmlCss) selectedSkills.push("HTML and CSS")
    if (skills.javascript) selectedSkills.push("JavaScript")
    if (skills.java) selectedSkills.push("Java")
    if (skills.python) selectedSkills.push("Python")
    if (skills.other && otherSkill.trim()) selectedSkills.push(otherSkill.trim())

    // Save to localStorage for use in other pages
    const existingData = localStorage.getItem("surveyData")
    const surveyData = existingData ? JSON.parse(existingData) : {}

    localStorage.setItem(
      "surveyData",
      JSON.stringify({
        ...surveyData,
        technicalSkills: selectedSkills,
      }),
    )

    navigate("/user-survey-form2")
  }

  const checkboxWrapper = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    color: "#FFFFFF",
    fontFamily: "Poppins, sans-serif",
    marginLeft: "48px",
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
    nextButton: {
      backgroundColor: "#267987",
      color: "white",
      padding: "5px 32px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      marginTop: "33px",
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
            <h2 style={styles.sectionTitle}>Technical Skills</h2>
            <p style={styles.subtitle}>Select your top skills</p>

            <div style={styles.checkboxGroup}>
              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={skills.cLanguage}
                  onChange={() => handleSkillChange("cLanguage")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: skills.cLanguage ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>C Language</span>
              </div>

              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={skills.php}
                  onChange={() => handleSkillChange("php")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: skills.php ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>PHP</span>
              </div>

              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={skills.htmlCss}
                  onChange={() => handleSkillChange("htmlCss")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: skills.htmlCss ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>HTML and CSS</span>
              </div>

              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={skills.javascript}
                  onChange={() => handleSkillChange("javascript")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: skills.javascript ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>JavaScript</span>
              </div>

              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={skills.java}
                  onChange={() => handleSkillChange("java")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: skills.java ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>Java</span>
              </div>

              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={skills.python}
                  onChange={() => handleSkillChange("python")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: skills.python ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>Python</span>
              </div>

              <div style={checkboxWrapper}>
                <input
                  type="checkbox"
                  checked={skills.other}
                  onChange={() => handleSkillChange("other")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    border: "2px solid #FFFFFF",
                    borderRadius: "3px",
                    backgroundColor: skills.other ? "#514BC3" : "transparent",
                    position: "relative",
                  }}
                />
                <span style={styles.checkboxLabel}>Others:</span>
                <input
                  type="text"
                  value={otherSkill}
                  onChange={(e) => setOtherSkill(e.target.value)}
                  style={{
                    marginLeft: "8px",
                    padding: "4px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "#CA9F58",
                    color: "#FFFFFF",
                    pointerEvents: skills.other ? "auto" : "none",
                    opacity: skills.other ? "1" : "0.5",
                  }}
                  placeholder="Specify other skills"
                  disabled={!skills.other}
                />
              </div>
            </div>
          </div>
          <button type="button" style={styles.nextButton} onClick={handleNext}>
            Next
          </button>
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
