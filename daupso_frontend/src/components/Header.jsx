import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo.png";

function Header({ cartItems }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate total cart quantity
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="login-logo">
          <img
            src={logo}
            alt="MyStore logo"
            style={{ height: "40px", objectFit: "contain" }}
          />
        </Link>

        <input
          className="search"
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
        />

        <div className="right">
          <button onClick={() => navigate("/login")}>Login</button>

          <div
            className="cart"
            onClick={() => navigate("/cart")}
            style={{ cursor: "pointer" }}
          >
            🛒 <span className="count">{totalCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
