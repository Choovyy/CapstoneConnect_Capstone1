import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import UserSurveyPage from './pages/UserSurveyPage.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user-survey" element={<UserSurveyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
