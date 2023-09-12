import React from "react";
import "../styles/Footer.css";

const Footer = () => {
    return (
        <div className="bg-dark mt-3 text-light">
            <div className="footer-container d-flex">
                <ul className="footer-col">
                    <p>Shop</p>
                    <li><a href="/#/shirts">Shirts</a></li>
                </ul>
                <ul className="footer-col">
                    <p>Help</p>
                    <li><a href="">FAQ</a></li>
                    <li><a href="">Shipping</a></li>
                    <li><a href="">Contact Us</a></li>
                </ul>
                <ul className="footer-col">
                    <p>About</p>
                    <li><a href="">Blog</a></li>
                    <li><a href="">Our Story</a></li>
                    <li><a href="">Return Policy</a></li>
                    <li><a href="">Product Care</a></li>
                </ul>
                <ul className="footer-col">
                    <p>Socials</p>
                    <li><a href=""><i className="bi bi-instagram"></i></a></li>
                    <li><a href=""><i className="bi bi-facebook"></i></a></li>
                    <li><a href=""><i className="bi bi-twitter"></i></a></li>
                    <li><a href=""><i className="bi bi-youtube"></i></a></li>
                </ul>
            </div>
        </div>
    );
};

export default Footer