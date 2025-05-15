import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import UserSurveyPage from './pages/UserSurveyPage.jsx';
import UserSurveyForm from './pages/UserSurveyForm.jsx';
import UserSurveyForm2 from './pages/UserSurveyForm2.jsx';
import UserSurveyForm3 from './pages/UserSurveyForm3.jsx';
import SuggestedTeam from './pages/SuggestedTeam.jsx';
import Project from './pages/Project.jsx';
import Team from './pages/Team.jsx';
import PendingTeam from './pages/PendingTeam.jsx';
import Profile from './pages/Profile.jsx';
import ProfileEdit from './pages/ProfileEdit.jsx';
import YourProject from './pages/YourProject.jsx';
import Matching from './pages/Matching.jsx';
import SentRequest from './pages/SentRequest.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user-survey-page" element={<UserSurveyPage />} />
          <Route path="/user-survey-form" element={<UserSurveyForm />} />
          <Route path="/user-survey-form2" element={<UserSurveyForm2 />} />
          <Route path="/user-survey-form3" element={<UserSurveyForm3 />} />
          <Route path="/suggested-team" element={<SuggestedTeam />} />
          <Route path="/project" element={<Project />} />
          <Route path="/team" element={<Team />} />
          <Route path="/pending-team" element={<PendingTeam />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile-edit" element={<ProfileEdit />} />
          <Route path="/your-project" element={<YourProject />} />
          <Route path="/matching" element={<Matching />} />
          <Route path="/sent-request" element={<SentRequest />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;