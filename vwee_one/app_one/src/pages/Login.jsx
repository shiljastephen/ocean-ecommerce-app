import { useState } from "react";
import API from "../services/api";
import "./Login.css";
import { Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("users/login/", {
        username,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);

      alert("Login successful 🎉");

      // ✅ AUTO REDIRECT BASED ON ROLE
      if (res.data.role === "vendor") {
        window.location.href = "/vendor/dashboard";
      } else {
        window.location.href = "/";
      }

    } catch (err) {
      console.log(err.response?.data);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login Here</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
        {/* ✅ Register Link */}
       <p style={{ marginTop: "15px" }}>
         Don't have an account?{" "}
         <Link to="/register" style={{ color: "blue", fontWeight: "bold" }}>
           Register here
         </Link>
       </p>
      </form>
    </div>
  );
}

export default Login;
