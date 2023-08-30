import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ isLoggedIn, setIsLoggedIn, setUserToken }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) navigate("/#/previous_orders");
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
        <div className="login-container-main d-flex flex-column align-items-center">
            <h1><b>SIGN IN</b></h1>
            <div className="login-container-bottom d-flex mt-5">
                <form onSubmit={accountLogin} className="login-form">
                    <div className="text-danger text-center">{errorMessage}</div>
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
                    <button onClick={() => navigate("/#/register")} className="register-link btn btn-dark btn-lg">Create Account</button>
                </div>
            </div>
        </div>




        // <div>
        //     <div>
        //         <div>
        //             <h1>Login</h1>
        //             
        //             <form onSubmit={accountLogin}>
        //                 <div className="form-floating mb-3 login-field">
        //                     <input
        //                         className="form-control"
        //                         id="login-username"
        //                         value={username}
        //                         required
        //                         onChange={(event) => setUsername(event.target.value)}
        //                         name="loginUsername"
        //                         placeholder="Username" />

        //                     <label htmlFor="login-username">Username</label>
        //                 </div>
        //                 <div className="form-floating login-field">
        //                     <input
        //                         type="password"
        //                         className="form-control"
        //                         id="login-password"
        //                         value={password}
        //                         required
        //                         onChange={(event) => setPassword(event.target.value)}
        //                         name="loginPassword"
        //                         placeholder="Password"
        //                     />

        //                     <label htmlFor="login-password">Password</label>
        //                 </div>
        //                 <button
        //                     type="submit"
        //                     className="btn btn-primary login-buttons"
        //                 >
        //                     Login
        //                 </button>
        //                 <Link to="/register">
        //                     <button className="btn btn-primary login-buttons">Register</button>
        //                 </Link>
        //             </form>
        //         </div>
        //     </div>
        // </div>
    );
};

export default Login;
