import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";


const Header = ({ setUserToken, isLoggedIn, setIsLoggedIn, cart }) => {

    const logout = () => {
        window.localStorage.removeItem("token");
        setUserToken("");
        setIsLoggedIn(false);
    };

    return (
        <header>
            <nav className="navbar navbar-dark navbar-expand-sm bg-dark">
                <div className="container-fluid mx-5">
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
                        <ul className="navbar-nav d-flex w-100">
                            <li className="nav-item nav-text">
                                <Link className="nav-link" to="/shirts">
                                    <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Shop</span>
                                </Link>
                            </li>
                            <div className="account-nav d-flex">
                                <li className="nav-item nav-icon">
                                    <Link className="nav-link" to={isLoggedIn ? "/previous_orders" : "/login"}>
                                        <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show"><i className="bi bi-person"></i></span>
                                    </Link>
                                </li>
                                {
                                    isLoggedIn ?
                                        <li className="nav-item nav-icon">
                                            <Link className="nav-link" to="/shirts">
                                                <span
                                                    data-bs-toggle="collapse"
                                                    data-bs-target=".navbar-collapse.show"
                                                    onClick={() => logout()}
                                                >
                                                    <i className="bi bi-box-arrow-right"></i>
                                                </span>
                                            </Link>
                                        </li>
                                        :
                                        null
                                }
                                <li className="nav-item nav-icon position-relative">
                                    <Link className="nav-link" to={isLoggedIn ? "/cart" : "/login"}>
                                        <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">
                                            <i className="bi bi-cart"></i>
                                            {
                                                cart.items && cart.items.length ?
                                                    <span className="cart-pill position-absolute top-25 start-75 translate-middle badge rounded-pill bg-danger">
                                                        {cart.items.reduce((total, item) => total + item.quantity, 0)}
                                                        <span className="visually-hidden">unpurchased items</span>
                                                    </span>
                                                    :
                                                    null
                                            }
                                        </span>
                                    </Link>
                                </li>
                            </div>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;