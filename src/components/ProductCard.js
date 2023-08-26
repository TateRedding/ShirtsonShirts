import React from "react";

const ProductCard = ({ item }) => {
    return (
        <div className="card align-items-center product-card m-3">
            <a className="nav-link" href={`/#/shirts/${item.name.split(" ").join("_")}`}>
                <h5 className="card-title my-3 text-center">{item.isActive ? item.name : `${item.name} (INACTIVE)`}</h5>
                <div className="d-flex align-items-center justify-content-center">
                    <img className="product-display-image" src={item.imageURL} alt={item.name} />
                </div>
            </a>
            <div className="card-body">
                <p className="card-text text-center">${item.price.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default ProductCard;