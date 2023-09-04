import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ item }) => {
    const navigate = useNavigate();

    return (
        <div className="product-card">
            <div className="product-link" onClick={() => navigate(`/shirts/${item.name.split(" ").join("_")}`)}>
                <div className="product-card-image-container d-flex align-items-center justify-content-center mb-2">
                    <img src={item.imageURL} alt={item.name} />
                </div>
                <h5><b>{item.isActive ? item.name : `${item.name} (INACTIVE)`}</b></h5>
            </div>
            <p>${item.price.toFixed(2)}</p>
        </div>
    );
};

export default ProductCard;