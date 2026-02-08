import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // success
      console.log("Logged in user:", data.userId);
      // store user id in localStorage
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userIsAdmin", data.userIsAdmin);

      // if admin go to admin page
      if (data.userIsAdmin) {
        navigate("/admin");
        return;
      }
      console.log("User not admin");

      navigate("/"); // go home
    } catch (err) {
      setError("Server error:", err.message);
    }
  };

  return (
    <>
      <div className="login-header">
        <Link to="/" className="login-logo">
          MyStore
        </Link>
      </div>

      <div className="login-page">
        <form className="login-box" onSubmit={handleSubmit}>
          <h1>Sign in</h1>

          {error && <p className="login-error">{error}</p>}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}

export default Login;
