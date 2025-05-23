import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import NotSignedIn from '../NotSignedIn';

const UserSurveyForm2 = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState({
    cLanguage: false,
    php: false,
    htmlCss: false,
    javascript: false,
    java: false,
    python: false,
    other: false,
  });
  const [otherSkill, setOtherSkill] = useState('');
  const [otherError, setOtherError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication and restore state from sessionStorage on mount
  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true);
    }
    
    const saved = JSON.parse(sessionStorage.getItem('surveyStep2') || '{}');
    if (saved.skills) setSkills(saved.skills);
    if (saved.otherSkill) setOtherSkill(saved.otherSkill);
  }, []);

  const handleSkillChange = (skill) => {
    setSkills(prev => ({
      ...prev,
      [skill]: !prev[skill]
    }));
    if (skill === 'other') setOtherError('');
  };

  const handleBack = () => {
    sessionStorage.setItem('surveyStep2', JSON.stringify({ skills, otherSkill }));
    navigate('/user-survey-form'); 
  };

  const handleSignIn = () => {
    window.location.href = '/';
  };

  const selectedSkillCount = Object.values(skills).filter(Boolean).length;
  const isOtherInvalid = skills.other && otherSkill.trim() === '';
  const isNextDisabled = selectedSkillCount < 2 || isOtherInvalid;

  const handleNext = () => {
    sessionStorage.setItem('surveyStep2', JSON.stringify({
      skills,
      otherSkill
    })); // Save this step's answers
    if (isOtherInvalid) {
      setOtherError('Please input this field.');
      return;
    }
    if (!isNextDisabled) {
      navigate('/user-survey-form3');
    }
  };

  const checkboxWrapper = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    color: '#FFFFFF',
    fontFamily: 'Poppins, sans-serif',
    marginLeft: '30px',
    marginBottom: '4px',
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#CA9F58',
      fontFamily: 'Poppins, sans-serif',
    },
    header: {
      backgroundColor: '#FFFFFF',
      padding: '20px',
      textAlign: 'center',
      color: '#267987',
    },
    title: {
      fontSize: '32px',
      margin: '0',
      fontWeight: 'bold',
      fontFamily: 'Poppins, sans-serif',
    },
    main: {
      flex: 1,
      maxWidth: '800px',
      margin: '32px auto',
      padding: '32px',
      backgroundColor: '#CA9F58',
      borderRadius: '8px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    footer: {
      backgroundColor: '#FFFFFF',
      padding: '16px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    logo: {
      height: '30px',
      width: 'auto',
    },
    skillsSection: {
      marginBottom: '32px',
    },
    sectionTitle: {
      color: '#FFFFFF',
      fontSize: '24px',
      marginBottom: '16px',
      textAlign: 'center',
      fontFamily: 'Poppins, sans-serif',
    },
    subtitle: {
      textAlign: 'center',
      color: '#FFFFFF',
      marginBottom: '64px',
      fontFamily: 'Poppins, sans-serif',
    },
    checkboxGroup: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      maxWidth: '600px',
      margin: '0 auto',
    },
    checkboxLabel: {
      color: '#FFFFFF',
      fontFamily: 'Poppins, sans-serif',
      pointerEvents: 'none', 
    },
    checkbox: {
      width: '20px',
      height: '20px',
      cursor: 'pointer',
      appearance: 'none !important',
      '-webkit-appearance': 'none !important',
      '-moz-appearance': 'none !important',
      border: '2px solid #FFFFFF',
      borderRadius: '3px',
      backgroundColor: 'transparent',
      position: 'relative',
    },
    otherInput: {
      marginLeft: '8px',
      padding: '4px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: '#CA9F58',
      color: '#FFFFFF',
      pointerEvents: 'none',
      opacity: '0.5',
    },
    otherInputActive: {
      marginLeft: '8px',
      padding: '4px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: '#CA9F58',
      color: '#FFFFFF',
      pointerEvents: 'auto',
      opacity: '1',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '-10px',
    },
    backButton: {
        backgroundColor: '#CA9F58',
        color: 'white',
        padding: '5px 32px',
        border: '1px solid #FFFFFF',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '32px',
        fontFamily: 'Poppins, sans-serif',
        alignSelf: 'flex-end',
    },
    nextButton: {
      backgroundColor: isNextDisabled ? '#999' : '#267987',
      color: 'white',
      padding: '5px 32px',
      border: 'none',
      borderRadius: '4px',
      cursor: isNextDisabled ? 'not-allowed' : 'pointer',
      fontSize: '16px',
      marginTop: '32px',
      fontFamily: 'Poppins, sans-serif',
      alignSelf: 'flex-end',
    },
    capstoneText: {
      color: '#CA9F58',
      fontWeight: 'bold',
      fontFamily: 'Poppins, sans-serif',
    },
    connectText: {
      color: '#267987',
      fontWeight: 'bold',
      fontFamily: 'Poppins, sans-serif',
    },
    errorText: {
      color: '#FFCCCC',
      fontSize: '12px',
      marginLeft: '8px',
      fontFamily: 'Poppins, sans-serif',
    }
  };

  if (!isAuthenticated) {
    return <NotSignedIn onSignIn={handleSignIn} />;
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
              {[
                { key: 'cLanguage', label: 'C Language' },
                { key: 'php', label: 'PHP' },
                { key: 'htmlCss', label: 'HTML and CSS' },
                { key: 'javascript', label: 'JavaScript' },
                { key: 'java', label: 'Java' },
                { key: 'python', label: 'Python' },
                { key: 'other', label: 'Others:' },
              ].map(({ key, label }) => (
                <div key={key} style={checkboxWrapper}>
                  <input
                    type="checkbox"
                    checked={skills[key]}
                    onChange={() => handleSkillChange(key)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      border: '2px solid #FFFFFF',
                      borderRadius: '3px',
                      backgroundColor: skills[key] ? '#514BC3' : 'transparent',
                      position: 'relative',
                    }}
                  />
                  <span style={styles.checkboxLabel}>{label}</span>
                  {key === 'other' && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <input
                        type="text"
                        value={otherSkill}
                        onChange={(e) => {
                          setOtherSkill(e.target.value);
                          setOtherError('');
                        }}
                        style={skills.other ? styles.otherInputActive : styles.otherInput}
                        placeholder="Specify other skills"
                        disabled={!skills.other}
                      />
                      {otherError && <span style={styles.errorText}>{otherError}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div style={styles.buttonContainer}>
            <button 
              type="button" 
              style={styles.backButton}
              onClick={handleBack}
            >
              Back
            </button>
            <button 
              type="button" 
              style={styles.nextButton}
              onClick={handleNext}
              disabled={isNextDisabled}
            >
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
  );
};

const style = document.createElement('style');
style.textContent = `
  .white-placeholder::placeholder {
    color: white !important;
  }
`;
document.head.appendChild(style);

export default UserSurveyForm2;
