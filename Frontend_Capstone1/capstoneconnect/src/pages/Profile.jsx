import '../css/Profile.css';
import logo from '../assets/logo.png';
import vyn from '../assets/vyn.jpg';
import '../css/Navigation.css';

const Profile = () => {
  return (
    <>
      <header className="site-header">
        <div className="header__logo">
          <a href="#">
            <img src={logo} alt="CapstoneConnect Logo" />
          </a>
        </div>
        <nav className="header__nav">
          <ul className="nav-list">
            <li className="nav-item nav-item--active"><a href="#">Home</a></li>
            <li className="nav-item"><a href="#">Profile</a></li>
            <li className="nav-item"><a href="#">Projects</a></li>
            <li className="nav-item"><a href="#">Team</a></li>
            <li className="nav-item"><a href="#">More</a></li>
          </ul>
        </nav>
        <div className="header__auth">
          <button className="btn btn--primary">Logout</button>
        </div>
      </header>

      {/* Only the profile-page is flex-centered */}
      <div className="profile-page">
        <main className="profile-container">
          <div className="profile-header">
            <div className="profile-pic">
              <img src={vyn} alt="Profile" />
            </div>
            <div className="profile-info">
              <div className="profile-actions">
                <button className="projects-btn">Your Projects</button>
                <button className="edit-btn">Edit Profile</button>
              </div>
              <h1>John Doe</h1>
              <p>john.doe@cit-university.edu</p>
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
    </>
  );
};

export default Profile;
