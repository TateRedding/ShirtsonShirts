import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PreviousOrderCard = ({ cartItem, userToken, purchaseTime }) => {
    const navigate = useNavigate();

    const orderAgain = async () => {
        try {
            if (item) {
                await axios.post("/api/cartItems", {
                    itemId: cartItem.itemId,
                    quantity: cartItem.quantity
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`
                    }
                })
            };
            navigate("/cart");
        } catch (error) {
            console.error(error);
        };

    };

    return (
        <div className="card mb-3 previous-order-card">
            <div className="previous-order-details d-flex align-items-center">
                <div className="flex-grow-2 d-flex justify-content-center">
                    <button className="btn btn-outline-secondary" onClick={() => navigate(`/products/${cartItem.item.split(" ").join("_")}`)}>
                        <img
                            className="product-thumbnail"
                            src={cartItem.imageURL}
                            alt={cartItem.item}
                        />
                    </button>
                </div>
                <div className="flex-grow-1">
                    <div className="card-body">
                        <a className="nav-link" href={`/#/products/${cartItem.item.split(" ").join("_")}`}>
                            <h5 className="card-title">{cartItem.item}</h5>
                        </a>
                        <p className="card-text">Size: {cartItem.size}</p>
                        <p className="card-text">Quantity: {cartItem.quantity}</p>
                        <p className="card-text">Total: ${cartItem.price * cartItem.quantity}</p>
                    </div>
                </div>
                <div className="flex-grow-2 d-flex flex-column align-items-center">
                    <p className="card-text">Purchased on: {new Date(Date.parse(purchaseTime)).toString().split(" ").slice(0, 5).join(" ")}</p>
                    <button className="btn btn-success" onClick={orderAgain}>Order Again</button>
                </div>
            </div>
        </div>
    )

};

export default PreviousOrderCard;