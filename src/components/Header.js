import React from 'react';
import { Link } from 'react-router-dom';


const Header = (props) => {

    const Logout = () => {
        window.localStorage.removeItem('token');
        props.setUserToken('');
        return props.setIsLoggedIn(false);
    }

    return (
        <>
            <nav id='header' className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className='container'>
                    <a className="navbar-brand" href="#">Shirts on Shirts</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            <Link className="nav-item nav-link" to="/">Home</Link>
                            <Link className="nav-item nav-link" to="/products">Products</Link>
                            {props.isLoggedIn ? <Link className="nav-item nav-link" to="/previous_orders">Orders</Link> : null }
                            {props.isLoggedIn ? <Link className="nav-item nav-link" to="/cart">Cart</Link> : null }
                            {props.isLoggedIn ? <Link onClick={() => {
                                Logout();
                            }} className="nav-item nav-link" to="/products">Logout</Link> : <Link className="nav-item nav-link" to="/login">Login</Link>}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header;