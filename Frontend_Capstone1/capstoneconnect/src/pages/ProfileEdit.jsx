import '../css/ProfileEdit.css'; // Assuming you have a CSS file for styling
import logo from '../assets/logo.png'; // Placeholder for your logo
import vyn from '../assets/vyn.jpg'; // Placeholder for your profile picture

const ProfileEdit = () => {
  return (
    <div>
      {/* Navigation */}
      <header className="site-header">
        <div className="header__logo">
          <a href="#">
            <img src={logo} alt="Logo" />
          </a>
        </div>
        <nav className="header__nav">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="#">Home</a>
            </li>
            <li className="nav-item">
              <a href="#">Profile</a>
            </li>
            <li className="nav-item">
              <a href="#">Projects</a>
            </li>
            <li className="nav-item">
              <a href="#">Team</a>
            </li>
            <li className="nav-item">
              <a href="#">More</a>
            </li>
          </ul>
        </nav>
        <div className="header__auth">
          <button className="btn btn--primary">Logout</button>
        </div>
      </header>

      {/* Main Profile Section */}
      <main className="container">
        {/* Sidebar */}
        <aside className="sidebar">
          <img src={vyn} alt="Profile Picture" />
          <h2>John Doe</h2>
          <p>john.doe@cit-university.edu</p>
        </aside>

        {/* Profile Content */}
        <section className="profile-content">
          <form>
            <div>
              <label htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" name="fullName" value="John Doe" />
            </div>

            <div>
              <label htmlFor="role">Role</label>
              <select id="role" name="role">
                <option value="pm" selected>
                  Project Manager
                </option>
                <option value="dev">Developer</option>
                <option value="ux">UI/UX Designer</option>
              </select>
            </div>

            <div>
              <label htmlFor="skills">Technical Skills</label>
              <textarea id="skills" name="skills">
                Database Administration
                Data Management
                Dev Ops
                Automation
                Software Testing
              </textarea>
            </div>

            <div>
              <label>Project Interest</label>
              <div className="radio-group">
                <div className="radio-item">
                  <input
                    type="radio"
                    id="interest1"
                    name="interest"
                    value="pm"
                    checked
                  />
                  <label htmlFor="interest1">Project Manager</label>
                </div>
                <div className="radio-item">
                  <input type="radio" id="interest2" name="interest" value="dev" />
                  <label htmlFor="interest2">Developer</label>
                </div>
                <div className="radio-item">
                  <input type="radio" id="interest3" name="interest" value="qa" />
                  <label htmlFor="interest3">QA Tester</label>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="github">GitHub</label>
              <input
                type="text"
                id="github"
                name="github"
                placeholder="https://github.com/username"
              />
            </div>

            {/* Buttons */}
            <div className="button-group">
              <button type="submit" className="btn-save">
                Save
              </button>
              <button type="button" className="btn-cancel">
                Cancel
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ProfileEdit;
