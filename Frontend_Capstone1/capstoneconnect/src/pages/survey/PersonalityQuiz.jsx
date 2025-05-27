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
  };  
  
  // Add a new function to handle going back to Project Interests
  const handleBackToProjectInterests = () => {
    // Call onComplete with a special value to indicate going back
    if (onComplete) {
      onComplete('back_to_interests');
    }
  };

  const submitQuiz = async () => {
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
    return <div className="pq-container">Loading...</div>;
  }
  if (questions.length === 0) {
    return (
      <div className="pq-container">
        <div className="pq-result-container">
          <h2 className="pq-result-title">No questions available</h2>
          <p className="pq-result-description">
            The quiz questions couldn't be loaded. This might be because:
            <br />- The backend server is not running
            <br />- Quiz questions haven't been initialized in the database
            <br />- There's a connection issue between frontend and backend
          </p>
          <button className="pq-continue-button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="pq-container">
        <div className="pq-header">
          <h2>Personality Quiz</h2>
        </div>
        
        <div className="pq-result-container">
          <h2 className="pq-result-title">Your Personality Type:</h2>
          <div className="pq-personality-type">{personalityResult}</div>
          <p className="pq-result-description">
            This personality type reflects your preferences in teamwork, project approach, and problem-solving style. 
            We'll use this information to match you with compatible team members for your projects.
          </p>
          <div className="pq-navigation">
            <button className="pq-back-button" onClick={handleBackToProjectInterests}>
              Back
            </button>
            <div>
              <button className="pq-continue-button" onClick={handleContinue}>
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="pq-container">
      <div className="pq-header">
        <h2>Personality Quiz</h2>
      </div>

      <div className="pq-progress">
        <div 
          className="pq-progress-bar" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="pq-question">
        <h3>{currentQuestion.questionText}</h3>
        
        <div className="pq-options-container">
          <div className="pq-option-item">
            <input
              type="radio"
              id={`option-${currentQuestion.id}-1`}
              name={`question-${currentQuestion.id}`}
              value={1}
              checked={answers[currentQuestion.id] === 1}
              onChange={() => handleAnswerChange(currentQuestion.id, 1)}
            />
            <label htmlFor={`option-${currentQuestion.id}-1`}>
              {currentQuestion.option1}
            </label>
          </div>
          
          <div className="pq-option-item">
            <input
              type="radio"
              id={`option-${currentQuestion.id}-2`}
              name={`question-${currentQuestion.id}`}
              value={2}
              checked={answers[currentQuestion.id] === 2}
              onChange={() => handleAnswerChange(currentQuestion.id, 2)}
            />
            <label htmlFor={`option-${currentQuestion.id}-2`}>
              {currentQuestion.option2}
            </label>
          </div>
          
          <div className="pq-option-item">
            <input
              type="radio"
              id={`option-${currentQuestion.id}-3`}
              name={`question-${currentQuestion.id}`}
              value={3}
              checked={answers[currentQuestion.id] === 3}
              onChange={() => handleAnswerChange(currentQuestion.id, 3)}
            />
            <label htmlFor={`option-${currentQuestion.id}-3`}>
              {currentQuestion.option3}
            </label>
          </div>
          
          <div className="pq-option-item">
            <input
              type="radio"
              id={`option-${currentQuestion.id}-4`}
              name={`question-${currentQuestion.id}`}
              value={4}
              checked={answers[currentQuestion.id] === 4}
              onChange={() => handleAnswerChange(currentQuestion.id, 4)}
            />
            <label htmlFor={`option-${currentQuestion.id}-4`}>
              {currentQuestion.option4}
            </label>
          </div>
          
          <div className="pq-option-item">
            <input
              type="radio"
              id={`option-${currentQuestion.id}-5`}
              name={`question-${currentQuestion.id}`}
              value={5}
              checked={answers[currentQuestion.id] === 5}
              onChange={() => handleAnswerChange(currentQuestion.id, 5)}
            />
            <label htmlFor={`option-${currentQuestion.id}-5`}>
              {currentQuestion.option5}
            </label>
          </div>
        </div>
      </div>

      <div className="pq-navigation">
        <button
          className="pq-back-button"
          onClick={handleBackToProjectInterests}
        >
          Back
        </button>
        
        <div>
          <button
            className={`pq-button-previous ${currentQuestionIndex === 0 ? 'disabled' : ''}`}
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          
          <button
            className="pq-button-next"
            onClick={currentQuestionIndex === questions.length - 1 ? submitQuiz : handleNextQuestion}
            disabled={!answers[currentQuestion.id]}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalityQuiz;
