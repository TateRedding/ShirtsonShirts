import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = ({ isLoggedIn, setIsLoggedIn, setUserToken }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [showPasswordMatchWarning, setShowPasswordMatchWarning] = useState(false);
    const [showPasswordLengthWarning, setShowPasswordLengthWarning] = useState(false);
    const [showUsernameWarning, setShowUsernameWarining] = useState(false);
    const [showEmailWarning, setShowEmailWarning] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) navigate("/previous_orders");
    }, []);

    useEffect(() => {
        if (confirmPassword) {
            (password === confirmPassword) ? setShowPasswordMatchWarning(false) : setShowPasswordMatchWarning(true);
        } else {
            setShowPasswordMatchWarning(false);
        };

        if (password) {
            (password.length < 8) ? setShowPasswordLengthWarning(true) : setShowPasswordLengthWarning(false);
        } else {
            setShowPasswordLengthWarning(false);
        };
    }, [password, confirmPassword]);

    const accountRegister = async (event) => {
        event.preventDefault();
        setShowEmailWarning(false);
        setShowUsernameWarining(false);
        setShowPasswordLengthWarning(false);
        if (password.length < 8) {
            setShowPasswordLengthWarning(true);
            return;
        } else if (password !== confirmPassword) {
            setShowPasswordMatchWarning(true);
            return;
        };
        const newUser = {
            username,
            password,
            firstName,
            email,
            password,
        };
        if (lastName) newUser.lastName = lastName;
        try {
            const response = await axios.post("/api/users/register", newUser);

            console.log(response.data);

            setPassword("");
            setConfirmPassword("");

            if (response.data.success) {
                setUserToken(response.data.token);
                window.localStorage.setItem("token", `${response.data.token}`);
                setIsLoggedIn(true);
                setUsername("");
                setEmail("");
                setFirstName("");
                setLastName("");
                navigate("/products");
            } else if (response.data.error === "UsernameTakenError") {
                setShowUsernameWarining(true);
            } else if (response.data.error === "EmailAlreadyInUse") {
                setShowEmailWarning(true);
            } else if (response.data.error === "PasswordTooShortError") {
                setShowPasswordLengthWarning(true);
            };
        } catch (error) {
            console.error(error);
        };
    };

    return (
        <div>
            <h1 className="text-center">New Account</h1>
            <form className="container register-form" onSubmit={accountRegister}>
                <div className="row">
                    <div className="col-12 col-sm-6 mb-4">
                        <label className="register-required-label" htmlFor="register-username">
                            Username
                            <small>REQUIRED</small>
                        </label>
                        <input
                            className="form-control"
                            id="register-username"
                            aria-describedby="username-taken-error"
                            value={username}
                            required
                            onChange={(event) => setUsername(event.target.value)}
                        />
                        {
                            showUsernameWarning ?
                                <small className="text-danger" id="username-taken-error">That username is taken!</small>
                                :
                                null
                        }
                    </div>
                    <div className="col-12 col-sm-6 mb-4">
                        <label className="register-required-label" htmlFor="register-email">
                            Email
                            <small>REQUIRED</small>
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="register-email"
                            aria-describedby="email-in-use-error"
                            value={email}
                            required
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        {
                            showEmailWarning ?
                                <small className="text-danger" id="email-in-use-error">That email is already in use!</small>
                                :
                                null
                        }
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 col-sm-6 mb-4">
                        <label className="register-required-label" htmlFor="register-first-name">
                            First Name
                            <small>REQUIRED</small>
                        </label>
                        <input
                            className="form-control"
                            id="register-first-name"
                            value={firstName}
                            required
                            onChange={(event) => setFirstName(event.target.value)}
                        />
                    </div>
                    <div className="col-12 col-sm-6 mb-4">
                        <label htmlFor="register-last-name">Last Name</label>
                        <input
                            className="form-control"
                            id="register-last-name"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 col-sm-6 mb-4">
                        <label className="register-required-label" htmlFor="register-password">
                            Password
                            <small>REQUIRED</small>
                        </label>
                        <input
                            type="password"
                            className={`form-control ${password ? showPasswordLengthWarning ? "is-invalid" : "is-valid" : null}`}
                            id="register-password"
                            aria-describedby="password-length-error"
                            value={password}
                            required
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        {
                            showPasswordLengthWarning ?
                                <small className="text-danger" id="password-length-error">Passwords must contain at least 8 characters</small>
                                :
                                null
                        }
                    </div>
                    <div className="col-12 col-sm-6 mb-4">
                        <label className="register-required-label" htmlFor="register-confirm-password">
                            Confirm Password
                            <small>REQUIRED</small>
                        </label>
                        <input
                            type="password"
                            className={`form-control ${confirmPassword ? showPasswordMatchWarning ? "is-invalid" : "is-valid" : null}`}
                            id="register-confirm-password"
                            aria-describedby="password-match-error"
                            value={confirmPassword}
                            required
                            onChange={(event) => setConfirmPassword(event.target.value)}
                        />
                        {
                            showPasswordMatchWarning ?
                                <small className="text-danger" id="password-match-error">Passwords must match!</small>
                                :
                                null
                        }
                    </div>
                </div>
                <div className="row justify-content-center">
                    <button className="col-auto btn btn-dark btn-lg" type="submit">
                        Create Account
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register;