import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserId, saveSurvey } from '../../api';
import logo from '../../assets/logo.png';
import NotSignedIn from '../NotSignedIn';
import PersonalityQuiz from './PersonalityQuiz';

const UserSurveyForm3 = () => {
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
  // New state for the quiz flow
  const [showQuiz, setShowQuiz] = useState(false);
  const [personalityType, setPersonalityType] = useState('');

  // Check authentication and restore state from sessionStorage on mount
  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true);
    }
    
    const saved = JSON.parse(sessionStorage.getItem('surveyStep3') || '{}');
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

  const handleSignIn = () => {
    window.location.href = '/';
  };

  const selectedSkillCount = Object.values(skills).filter(Boolean).length;
  const isOtherInvalid = skills.other && otherSkill.trim() === '';
  const isSubmitDisabled = selectedSkillCount < 2 || isOtherInvalid;

  const handleBack = () => {
    sessionStorage.setItem('surveyStep3', JSON.stringify({ skills, otherSkill }));
    navigate('/user-survey-form2'); 
  };  // Helper to map skills object to array of selected strings for each step
  function extractSelectedSkills(skillsObj, otherSkill, mapping) {
    return Object.entries(skillsObj)
      .filter(([key, checked]) => checked && mapping[key])
      .map(([key]) => mapping[key] === '__OTHER__' ? (otherSkill && otherSkill.trim() ? otherSkill.trim() : null) : mapping[key])
      .filter(Boolean);
  }

  // This is now the "Next" button which leads to the quiz
  const handleContinueToQuiz = () => {
    if (isOtherInvalid) {
      setOtherError('Please specify your other interest');
      return;
    }
    sessionStorage.setItem('surveyStep3', JSON.stringify({ skills, otherSkill }));
    setShowQuiz(true);
  };

  // New handler for when personality quiz is completed
  const handleQuizComplete = async (personalityResult) => {
    console.log('Quiz completed with result:', personalityResult);
    
    // Validate personality result
    if (!personalityResult || personalityResult.trim() === '') {
      console.error('ERROR: Received empty personality result from quiz');
      personalityResult = 'Unknown'; // Set default value
    }
    
    setPersonalityType(personalityResult);

    try {
      // Now submit everything including the personality
      const step1 = JSON.parse(sessionStorage.getItem('surveyStep1') || '{}');
      const step2 = JSON.parse(sessionStorage.getItem('surveyStep2') || '{}');
      
      // Log session storage data for debugging
      console.log('Step 1 data:', step1);
      console.log('Step 2 data:', step2);
      console.log('Step 3 skills:', skills);
      console.log('Step 3 otherSkill:', otherSkill);
      console.log('Personality result:', personalityResult);
      
      // Step 2: Technical Skills
      const technicalSkillsMapping = {
        cLanguage: 'C Language',
        php: 'PHP',
        htmlCss: 'HTML and CSS',
        javascript: 'JavaScript',
        java: 'Java',
        python: 'Python',
        other: '__OTHER__',
      };
      
      // Step 3: Project Interests
      const projectInterestsMapping = {
        cLanguage: 'Web App Development',
        php: 'E-Commerce Systems',
        htmlCss: 'Mobile App Development',
        javascript: 'Game Development',
        java: 'Task Management Systems',
        python: 'AI Development',
        other: '__OTHER__',
      };
      
      // Get single role from step1 (it's a direct value, not using the mapping function)
      const preferredRoles = step1.selectedRole ? [step1.selectedRole] : [];
      
      const technicalSkills = extractSelectedSkills(step2.skills || {}, step2.otherSkill || '', technicalSkillsMapping);
      const projectInterests = extractSelectedSkills(skills || {}, otherSkill || '', projectInterestsMapping);
      
      // Validate that we have at least some data to submit
      if (!preferredRoles.length) {
        console.warn('No preferred roles found in session storage');
      }
      if (!technicalSkills.length) {
        console.warn('No technical skills found in session storage');
      }
      if (!projectInterests.length) {
        console.warn('No project interests found in the current form');
      }
      
      // Include personality in the survey data
      const surveyData = {
        preferredRoles,
        technicalSkills,
        projectInterests,
        personality: personalityResult || 'Unknown' // Ensure we don't send null or empty string
      };
      
      // Get JWT and userId
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Log the stringified data to see the exact format being sent
      console.log('Saving survey data JSON:', JSON.stringify(surveyData));
      
      // Get user ID in a safer way
      const userIdResponse = await getUserId();
      if (!userIdResponse || !userIdResponse.userId) {
        throw new Error('Failed to retrieve user ID');
      }
      const userId = userIdResponse.userId;
      
      console.log('User ID:', userId);
      console.log('Saving survey data:', surveyData);
      
      // Submit to backend
      const response = await saveSurvey(userId, surveyData);
      console.log('Survey save response:', response);
      
      // Optionally clear survey data from sessionStorage
      sessionStorage.removeItem('surveyStep1');
      sessionStorage.removeItem('surveyStep2');
      sessionStorage.removeItem('surveyStep3');
      
      // Navigate to home page
      console.log('Survey saved successfully, navigating to home page');
      navigate('/home');
    } catch (error) {
      console.error('Error saving survey:', error);
      // More detailed error message
      alert(`There was an error saving your survey: ${error.message || 'Unknown error'}. Please try again.`);
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
      backgroundColor: showQuiz ? '#FFFFFF' : '#CA9F58',
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
      '&[type="checkbox"]:checked': {
        backgroundColor: '#514BC3 !important'
      }
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
    errorText: {
      color: '#FFCCCC',
      fontSize: '12px',
      marginLeft: '8px',
      fontFamily: 'Poppins, sans-serif',
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
    submitButton: {
      backgroundColor: isSubmitDisabled ? '#999' : '#267987',
      color: 'white',
      padding: '5px 21px',
      border: 'none',
      borderRadius: '4px',
      cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
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
    }
  };
  if (!isAuthenticated) {
    return <NotSignedIn onSignIn={handleSignIn} />;
  }
  
  // Show the personality quiz if we're at that step
  if (showQuiz) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Personality Quiz</h1>
        </header>
        
        <main style={styles.main}>
          <PersonalityQuiz onComplete={handleQuizComplete} />
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
              {Object.entries(skills).map(([key, checked]) => (
                <div key={key} style={checkboxWrapper}>
                  <input
                    type="checkbox"
                    checked={checked}
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
                      backgroundColor: checked ? '#514BC3' : 'transparent',
                      position: 'relative',
                    }}
                  />
                  <span style={styles.checkboxLabel}>
                    {{
                      cLanguage: 'Web App Development',
                      php: 'E-Commerce Systems',
                      htmlCss: 'Mobile App Development',
                      javascript: 'Game Development',
                      java: 'Task Management Systems',
                      python: 'AI Development',
                      other: 'Others:',
                    }[key]}
                  </span>
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
                        placeholder="Specify other interests"
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
            </button>            <button 
              type="button" 
              style={styles.submitButton}
              onClick={handleContinueToQuiz}
              disabled={isSubmitDisabled}
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

export default UserSurveyForm3;
