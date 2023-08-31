import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ isLoggedIn, setIsLoggedIn, setUserToken }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [incorrectCredentials, setIncorrectCredentials] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) navigate("/previous_orders");
    }, []);

    const accountLogin = async (event) => {
        event.preventDefault();
        setIncorrectCredentials(false);
        try {
            const response = await axios.post("/api/users/login", {
                username,
                password
            });

            if (response.data.success) {
                setUserToken(response.data.token);
                window.localStorage.setItem("token", `${response.data.token}`);
                setIsLoggedIn(true);
                navigate("/shirts");
            } else if (response.data.error === "IncorrectCredentialsError") {
                setIncorrectCredentials(true);
            };
        } catch (err) {
            console.error(err);
        };
    };

    return (
        <div className="login-container-main d-flex flex-column align-items-center">
            <h1><b>SIGN IN</b></h1>
            <div className="login-container-bottom d-flex mt-5">
                <form onSubmit={accountLogin} className="login-form">
                    {
                        incorrectCredentials ?
                            <div className="text-danger text-center">Username and password do not match!</div>
                            :
                            null
                    }
                    <div className="mb-4 px-3">
                        <label htmlFor="login-username">Username:</label>
                        <input
                            className="form-control"
                            id="login-username"
                            value={username}
                            required
                            onChange={(event) => setUsername(event.target.value)}
                        />
                    </div>
                    <div className="mb-4 px-3">
                        <label htmlFor="login-password">Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            id="login-password"
                            value={password}
                            required
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    <button type="submit" className="login-button btn btn-dark btn-lg">
                        Sign In
                    </button>
                </form>
                <div className="new-customer">
                    <h2 className="text-center">You new here?</h2>
                    <p className="mb-0">Create an account now so you can:</p>
                    <ul>
                        <li>Add shirts to your cart</li>
                        <li>Access your order history</li>
                        <li>Track your orders</li>
                        <li>Order you favorite shirts again and again</li>
                    </ul>
                    <button onClick={() => navigate("/register")} className="register-link btn btn-dark btn-lg">Create Account</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
