import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
    const navigate = useNavigate();

    const featuredImages = [
        [
            {
                path: "./images/rainbow_long_sleeve.png",
                alt: "Pride Flag Long Sleeve Tee Shirt"
            },
            {
                path: "./images/socataca_tee/blue.png",
                alt: "SoCaTaCa Tee Shirt in blue"
            },
            {
                path: "./images/react_tee/green.png",
                alt: "React Logo Tee Shirt in green"
            }
        ],
        [
            {
                path: "./images/socataca_tank/red.png",
                alt: "SoCaTaCa Tank Top in red"
            },
            {
                path: "./images/plain_tee/yellow.png",
                alt: "Plain Tee Shirt in yellow"
            },
            {
                path: "./images/aperture_long_sleeve/white.png",
                alt: "Aperture Logo Long Sleeve Tee Shirt in white"
            }
        ],
        [
            {
                path: "./images/plain_tee/green.png",
                alt: "Plain Tee Shirt in green"
            },
            {
                path: "./images/rainbow_tank.png",
                alt: "Pride Flag Tank Top"
            },
            {
                path: "./images/aperture_long_sleeve/green.png",
                alt: "Aperture Logo Long Sleeve Tee Shirt in green"
            }
        ],

    ];

    return (
        <div className="d-flex flex-column align-items-center">
            <div className="shirt-carousel carousel slide my-5 border-bottom border-top border-secondary" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {
                        featuredImages.map((imageArr, idx) => (
                            <div className={`carousel-item ${idx === 0 ? "active" : ""}`} key={idx}>
                                <div className="carousel-image-container d-flex">
                                    {
                                        imageArr.map((image, idx) => (
                                            <div className="carousel-image-wrapper d-flex align-items-center justify-content-center" key={idx}>
                                                <img src={image.path} alt={image.alt} />
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <h1 className="text-center">Your new favorite shirt is here!</h1>
            <button className="btn btn-lg btn-dark" onClick={() => navigate("/shirts")}>Shop Now!</button>
        </div>
    );
};

export default Home;