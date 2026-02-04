import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import "./Header.css";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo */}
        <Link to="/" className="logo">
          MyStore
        </Link>

        {/* Search */}
        <input className="search" type="text" placeholder="Search products" />

        {/* Right side */}
        <div className="right">
          <button onClick={() => navigate("/login")}>Login</button>

          <div className="cart">
            🛒 <span className="count">0</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
