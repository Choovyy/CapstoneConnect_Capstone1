import React, { useState, useEffect } from 'react';
import { initializeQuiz, getQuizQuestions, submitQuizAnswers } from '../../api';
import '../../css/PersonalityQuiz.css';

const PersonalityQuiz = ({ onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [personalityResult, setPersonalityResult] = useState('');  
  
  useEffect(() => {
    // Fetch quiz questions
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching quiz questions...');
        
        // First try to initialize the questions (if not already done)
        try {
          await initializeQuiz();
          console.log('Quiz questions initialized');
        } catch (initError) {
          console.warn('Could not initialize quiz questions:', initError);
        }
        
        // Then fetch the questions
        const questionsData = await getQuizQuestions();
        console.log('Questions fetched:', questionsData);
        setQuestions(questionsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching quiz questions:', error);
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: parseInt(value)
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };  const submitQuiz = async () => {
    try {
      setIsLoading(true);
      
      // Check if we have answers for all questions
      const answeredQuestions = Object.keys(answers).length;
      const totalQuestions = questions.length;
      
      if (answeredQuestions < totalQuestions) {
        console.warn(`Not all questions answered: ${answeredQuestions}/${totalQuestions}`);
        // You might want to handle this case differently
      }
      
      // Get user ID from the token if available
      let userId = null;
      const token = sessionStorage.getItem('jwtToken');
      
      if (!token) {
        console.error('No authentication token found');
        setIsLoading(false);
        return;
      }
      
      try {
        // Decode the JWT token to get the user ID
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decodedToken = JSON.parse(jsonPayload);
        userId = decodedToken.userId;
        console.log('User ID from token:', userId);
      } catch (err) {
        console.error('Error decoding JWT:', err);
        throw new Error('Failed to decode user information from token');
      }
      
      if (!userId) {
        throw new Error('User ID could not be extracted from token');
      }
      
      console.log('Submitting answers:', answers);
      
      // Use the centralized API function to submit the quiz
      const personalityType = await submitQuizAnswers(userId, answers);
      
      if (!personalityType) {
        throw new Error('Received empty personality type from server');
      }
      
      console.log('Received personality type:', personalityType);
      setPersonalityResult(personalityType);
      setShowResults(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert(`Error submitting quiz: ${error.message || 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (onComplete) {
      console.log('Calling onComplete with personality result:', personalityResult);
      onComplete(personalityResult);
    } else {
      console.error('onComplete prop is not provided');
    }
  };

  if (isLoading) {
    return <div className="personality-quiz-container">Loading...</div>;
  }
  if (questions.length === 0) {
    return (
      <div className="personality-quiz-container">
        <div className="result-container">
          <h2 className="result-title">No questions available</h2>
          <p className="result-description">
            The quiz questions couldn't be loaded. This might be because:
            <br />- The backend server is not running
            <br />- Quiz questions haven't been initialized in the database
            <br />- There's a connection issue between frontend and backend
          </p>
          <button className="continue-button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="personality-quiz-container">
        <div className="result-container">
          <h2 className="result-title">Your Personality Type:</h2>
          <div className="personality-type">{personalityResult}</div>
          <p className="result-description">
            This personality type reflects your preferences in teamwork, project approach, and problem-solving style. 
            We'll use this information to match you with compatible team members for your projects.
          </p>
          <button className="continue-button" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="personality-quiz-container">
      <div className="personality-quiz-header">
        <h2>Personality Quiz</h2>
        <p>Discover how you can best contribute to a project team</p>
      </div>

      <div className="quiz-progress">
        <div 
          className="quiz-progress-bar" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="quiz-question">
        <div className="question-number">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <h3>{currentQuestion.questionText}</h3>
        
        <div className="options-container">
          {[
            { value: 1, label: currentQuestion.option1 },
            { value: 2, label: currentQuestion.option2 },
            { value: 3, label: currentQuestion.option3 },
            { value: 4, label: currentQuestion.option4 },
            { value: 5, label: currentQuestion.option5 }
          ].map((option) => (
            <div key={option.value} className="option-item">
              <input
                type="radio"
                id={`option-${currentQuestion.id}-${option.value}`}
                name={`question-${currentQuestion.id}`}
                value={option.value}
                checked={answers[currentQuestion.id] === option.value}
                onChange={() => handleAnswerChange(currentQuestion.id, option.value)}
              />
              <label htmlFor={`option-${currentQuestion.id}-${option.value}`}>
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        <button
          className={`quiz-button back-button ${currentQuestionIndex === 0 ? 'disabled' : ''}`}
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        
        <button
          className={`quiz-button ${currentQuestionIndex === questions.length - 1 ? 'submit-button' : 'next-button'}`}
          onClick={handleNextQuestion}
          disabled={!answers[currentQuestion.id]}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default PersonalityQuiz;
