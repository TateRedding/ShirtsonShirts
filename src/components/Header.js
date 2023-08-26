import React from "react";
import { Link } from "react-router-dom";


const Header = ({ setUserToken, isLoggedIn, setIsLoggedIn }) => {

    const logout = () => {
        window.localStorage.removeItem("token");
        setUserToken("");
        setIsLoggedIn(false);
    };

    return (
        <header>
            <nav className="navbar navbar-expand-sm bg-primary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Shirts on Shirts</a>
                    <button
                        className="navbar-toggler"
                        type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarNavAltMarkup"
                        aria-controls="navbarNavAltMarkup"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <ul className="navbar-nav d-flex justify-content-between w-100">
                            <li className="nav-item">
                                <Link className="nav-link" to="/shirts">
                                    <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Shirts</span>
                                </Link>
                            </li>
                            {
                                isLoggedIn ?
                                    <div className="account-nav d-flex">
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/previous_orders">
                                                <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Order History</span>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/cart">
                                                <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show"><i className="bi bi-cart"></i></span>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/shirts">
                                                <span
                                                    data-bs-toggle="collapse"
                                                    data-bs-target=".navbar-collapse.show"
                                                    onClick={() => logout()}
                                                >
                                                    Logout
                                                </span>
                                            </Link>
                                        </li>
                                    </div>
                                    :
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">
                                            <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Login</span>
                                        </Link>
                                    </li>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;