import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ isLoggedIn, setIsLoggedIn, setUserToken }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) navigate("/shirts");
    }, []);

    const accountLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("/api/users/login", {
                username,
                password
            });
            if (!response.data.success) {
                setErrorMessage(response.data.message);
            } else {
                setUserToken(response.data.token);
                window.localStorage.setItem("token", `${response.data.token}`);
                setIsLoggedIn(true);
                navigate("/shirts");
            };
        } catch (err) {
            console.error(err);
        };
    };

    return (
        <div className="container" id="loginform">
            <div id="login-container">
                <div id="login">
                    <h1>Login</h1>
                    <div className="text-danger">{errorMessage}</div>
                    <form onSubmit={accountLogin}>
                        <div className="form-floating mb-3 login-field">
                            <input
                                className="form-control"
                                id="login-username"
                                value={username}
                                required
                                onChange={(event) => setUsername(event.target.value)}
                                name="loginUsername"
                                placeholder="Username" />

                            <label htmlFor="login-username">Username</label>
                        </div>
                        <div className="form-floating login-field">
                            <input
                                type="password"
                                className="form-control"
                                id="login-password"
                                value={password}
                                required
                                onChange={(event) => setPassword(event.target.value)}
                                name="loginPassword"
                                placeholder="Password"
                            />

                            <label htmlFor="login-password">Password</label>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary login-buttons"
                        >
                            Login
                        </button>
                        <Link to="/register">
                            <button className="btn btn-primary login-buttons">Register</button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default Login;
