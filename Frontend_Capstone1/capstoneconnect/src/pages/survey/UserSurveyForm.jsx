import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import NotSignedIn from '../NotSignedIn';

const UserSurveyForm = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication and restore state from sessionStorage on mount
  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true);
    }
    
    const saved = JSON.parse(sessionStorage.getItem('surveyStep1') || '{}');
    if (saved.selectedRole) setSelectedRole(saved.selectedRole);
  }, []);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setError('');
  };

  const handleSignIn = () => {
    window.location.href = '/';
  };

  const isNextDisabled = !selectedRole;

  const handleNext = () => {
    sessionStorage.setItem('surveyStep1', JSON.stringify({
      selectedRole
    })); // Save this step's answers
    
    if (!isNextDisabled) {
      navigate('/user-survey-form2');
    }
  };

  const radioWrapper = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    color: '#FFFFFF',
    fontFamily: 'Poppins, sans-serif',
    marginLeft: '48px',
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
    radioGroup: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      maxWidth: '600px',
      margin: '0 auto',
    },
    radioLabel: {
      color: '#FFFFFF',
      fontFamily: 'Poppins, sans-serif',
      pointerEvents: 'none',
    },
    radio: {
      width: '20px',
      height: '20px',
      cursor: 'pointer',
      appearance: 'none',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      border: '2px solid #FFFFFF',
      borderRadius: '50%',
      backgroundColor: 'transparent',
      position: 'relative',
    },
    nextButton: {
      backgroundColor: isNextDisabled ? '#999' : '#267987',
      color: 'white',
      padding: '5px 32px',
      border: 'none',
      borderRadius: '4px',
      cursor: isNextDisabled ? 'not-allowed' : 'pointer',
      fontSize: '16px',
      marginTop: '89px',
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

  const roles = [
    'UI/UX Designer',
    'Game Developer',
    'Frontend Developer',
    'Team Leader',
    'Backend Developer',
    'Technical Writer'
  ];

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
            <h2 style={styles.sectionTitle}>Preferred Roles</h2>
            <p style={styles.subtitle}>Select your preferred role</p>

            <div style={styles.radioGroup}>
              {roles.map(role => (
                <div key={role} style={radioWrapper}>
                  <input
                    type="radio"
                    checked={selectedRole === role}
                    onChange={() => handleRoleChange(role)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      border: '2px solid #FFFFFF',
                      borderRadius: '50%',
                      backgroundColor: selectedRole === role ? '#514BC3' : 'transparent',
                      position: 'relative',
                    }}
                  />
                  <span style={styles.radioLabel}>{role}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            style={styles.nextButton}
            onClick={handleNext}
            disabled={isNextDisabled}
          >
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
  );
};

const style = document.createElement('style');
style.textContent = `
  .white-placeholder::placeholder {
    color: white !important;
  }
`;
document.head.appendChild(style);

export default UserSurveyForm;
