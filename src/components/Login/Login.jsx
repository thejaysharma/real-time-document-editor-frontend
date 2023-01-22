import "./login.scss";
import React, { useState } from "react";
import { useAuth } from "../../context/auth";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { BsKey } from "react-icons/bs";
import { MdOutlineMailOutline } from "react-icons/md";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUser } = useAuth();
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post("http://localhost:3001/users/login", { email, password });
      setUser(data.user);
      localStorage.setItem("token", data.token);
      history.push("/dashboard");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login_container">
        <form onSubmit={handleSubmit}>
          <h1>Login Account</h1>
          <div className="input_box">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email" className="label-name">Email Address</label>
            <MdOutlineMailOutline className="input_icons" />

          </div>
          <div className="input_box">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password" className="label-name">Password</label>
            <BsKey className="input_icons" />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" disabled={isLoading} className="btn">
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
