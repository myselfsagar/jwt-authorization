import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";
import { ACCESS_TOKEN, setItem } from "../../utils/localStorageManager";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axiosClient.post("/auth/login", {
        email,
        password,
      });

      setItem(ACCESS_TOKEN, response?.data.result.accessToken);

      navigate(`${location?.state?.prevUrl}` || "/");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="Login">
      <div className="login-box">
        <h2 className="heading">Login</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="passwoprd">Password</label>
          <input
            type="text"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input type="submit" value="Login" />
        </form>

        <p className="footer">
          Don't have an account? <Link to={"/signup"}>Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
