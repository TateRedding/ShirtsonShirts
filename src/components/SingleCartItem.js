import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SingleCartItem = ({ cartItem, userToken, getCart, calcTotal }) => {
    const navigate = useNavigate();

    const [quantity, setQuantity] = useState(cartItem.quantity);

    const updateQuantity = async (event) => {
        event.preventDefault();
        if (cartItem.quantity !== quantity) {
            try {
                const response = await axios.patch(`/api/cartItemStyleSizes/${cartItem.cartItemStyleSizeId}`, { quantity }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`
                    }
                });
                if (response.data.success) cartItem.quantity = response.data.updatedCartItemStyleSize.quantity;
                calcTotal();
            } catch (error) {
                console.error(error);
            };
        };
    };

    const removeItem = async () => {
        try {
            await axios.delete(`api/cartItemStyleSizes/${cartItem.cartItemStyleSizeId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`
                }
            });
            getCart();
            calcTotal();
        } catch (error) {
            console.error(error);
        };
    };

    return (
        <div className="card mb-3 cart-item-card">
            <div className="cart-item-details d-flex align-items-center">
                <div className="flex-grow-2 d-flex justify-content-center">
                    <button className="btn btn-outline-secondary" onClick={() => navigate(`/products/${cartItem.item.split(" ").join("%20")}`)}>
                        <img
                            className="product-thumbnail"
                            src={cartItem.imageURL}
                            alt={cartItem.item}
                        />
                    </button>
                </div>
                <div className="flex-grow-1">
                    <div className="card-body">
                        <a className="nav-link" href={`/#/products/${cartItem.item.split(" ").join("%20")}`}>
                            <h5 className="card-title">{cartItem.item}</h5>
                        </a>
                        <p className="card-text">Size: {cartItem.size.toUpperCase()}</p>
                        <p className="card-text">Color/ Style: {cartItem.style}</p>
                        <form onSubmit={updateQuantity}>
                            <div className="mb-3 row align-items-center">
                                <div className="col-auto">
                                    <label htmlFor="cart-item-quantity" className="form-label card-text">Quantity</label>
                                </div>
                                <div className="col-auto">
                                    <input
                                        type="number"
                                        className="form-control quantity-selection"
                                        id="cart-item-quantity"
                                        value={quantity}
                                        onChange={(event) => setQuantity(event.target.value)}>
                                    </input>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={(!quantity || Number(quantity) === cartItem.quantity) ? true : false}
                            >
                                Update Quantity
                            </button>
                        </form>
                    </div>
                </div>
                <div className="flex-grow-2 d-flex flex-column align-items-center">
                    <button className="btn btn-danger" onClick={removeItem}>Remove Item</button>
                </div>
            </div>
        </div>
    );
};

export default SingleCartItem;