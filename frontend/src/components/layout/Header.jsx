import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        Low-Code Form Platform
      </div>

      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/dashboard">Forms</Link>
      </nav>
    </header>
  );
}

export default Header;
