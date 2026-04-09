import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>College Management System</h1>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/attendance">Attendance</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
