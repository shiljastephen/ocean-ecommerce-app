import { useState } from "react";
import API from "../services/api";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("users/login/", {
        username: username,
        password: password,
      });
      console.log("LOGIN RESPONSE:", res.data); 
      localStorage.setItem("token", res.data.access);
      alert("Login successful 🎉");
      window.location.href = "/";   // ✅ REDIRECT TO HOME
       
    } catch (err) {
      console.log(err.response.data); // shows backend error
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <div >
        <h2>Login Here</h2>
      </div>
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
      </form>
    </div>
  );
}

export default Login;
