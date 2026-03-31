import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
   fetch("https://parking-management-system-6.onrender.com/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email,
    password
  })
})
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          navigate("/home");   // ✅ CORRECT ROUTE
        } else {
          alert("Invalid Credentials");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Server Error ❌");
      });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="logo">LOGIN</h1>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Log in</button>
      </div>
    </div>
  );
}

export default Login;