import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import UserSurveyPage from './pages/survey/UserSurveyPage.jsx';
import UserSurveyForm from './pages/survey/UserSurveyForm.jsx';
import UserSurveyForm2 from './pages/survey/UserSurveyForm2.jsx';
import UserSurveyForm3 from './pages/survey/UserSurveyForm3.jsx';
import SuggestedTeam from './pages/home/SuggestedTeam.jsx';
import Project from './pages/project/Project.jsx';
import Team from './pages/team/Team.jsx';
import PendingTeam from './pages/more/PendingTeam.jsx';
import Profile from './pages/profile/Profile.jsx';
import ProfileEdit from './pages/profile/ProfileEdit.jsx';
import YourProject from './pages/profile/YourProject.jsx';
import Matching from './pages/more/Matching.jsx';
import SentRequest from './pages/more/SentRequest.jsx';

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
          <Route path="/project" element={<Project />} />
          <Route path="/team" element={<Team />} />
          <Route path="/pending-team" element={<PendingTeam />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile-edit" element={<ProfileEdit />} />
          <Route path="/your-project" element={<YourProject />} />
          <Route path="/matching" element={<Matching />} />
          <Route path="/sent-request" element={<SentRequest />} />
          <Route path="/home" element={<SuggestedTeam />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;