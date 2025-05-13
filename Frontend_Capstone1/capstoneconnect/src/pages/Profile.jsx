import '../css/Profile.css'; // Assuming you have a CSS file for styling
import logo from '../assets/logo.png'; // Placeholder for your logo
import vyn from '../assets/vyn.jpg'; // Placeholder for your profile picture

const Profile = () => {
  return (
    <div className="profile-page">
      <header>
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav>
          <div className="nav-item active">Home</div>
          <div className="nav-item">Profile</div>
          <div className="nav-item">Projects</div>
        </nav>
        <div className="logout-btn">Logout</div>
      </header>

      <main className="profile-container">
        <div className="profile-header">
          <div className="profile-pic">
            <img src={vyn} alt="Profile" />
          </div>
          <div className="profile-info">
            <h1>John Doe</h1>
            <p>john.doe@cit-university.edu</p>
            <button className="edit-btn">Edit Profile</button>
          </div>
        </div>

        <div className="profile-section">
          <h2>Role</h2>
          <p>Software Developer / Frontend Engineer</p>
        </div>

        <div className="profile-section">
          <h2>Technical Skills</h2>
          <p>HTML, CSS, JavaScript, React, Java, Spring Boot</p>
        </div>

        <div className="profile-section">
          <h2>Project Interests</h2>
          <p>Web Development, AI Projects, Open Source Contributions</p>
        </div>

        <div className="profile-section">
          <h2>GitHub</h2>
          <p>https://github.com/johndoe</p>
        </div>
      </main>
    </div>
  );
};

export default Profile;
