import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserSurveyPage from './pages/UserSurveyPage.jsx';
import UserSurveyForm from './pages/UserSurveyForm.jsx';
import UserSurveyForm2 from './pages/UserSurveyForm2.jsx';
import UserSurveyForm3 from './pages/UserSurveyForm3.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PendingTeam from './pages/PendingTeam.jsx';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PendingTeam />} />
          <Route path="/user-survey-page" element={<UserSurveyPage />} />
          <Route path="/user-survey-form" element={<UserSurveyForm />} />
          <Route path="/user-survey-form2" element={<UserSurveyForm2 />} />
          <Route path="/user-survey-form3" element={<UserSurveyForm3 />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
