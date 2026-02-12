import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar({ search, setSearch }) {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("username");
    const userRole = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      setUsername(user);
      setRole(userRole);
    }
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload(); // refresh navbar state
  };

  return (
    <nav className="navbar">
      <h2 className="logo">OCEAN 🛒</h2>

      {/* 🔍 Search */}
      <input
        type="text"
        className="search-bar"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="subhead">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">Orders</Link>

        {/* Show Vendor Apply only if logged in and not vendor */}
        {isLoggedIn && role !== "vendor" && (
          <Link to="/vendor/apply">Become Vendor</Link>
        )}

        {/* ⭐ If Logged In */}
        {isLoggedIn ? (
          <>
            <span className="username">Hi, {username}</span>

            {/* If Vendor */}
            {role === "vendor" && (
              <Link to="/vendor/dashboard">Vendor Panel</Link>
            )}

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
