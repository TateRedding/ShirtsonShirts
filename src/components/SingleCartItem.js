import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SingleCartItem = ({ cartItem, userToken, getCart, calcTotal }) => {
    const [quantity, setQuantity] = useState(cartItem.quantity);
    const [showStockWarning, setShowStockWarning] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (cartItem) {
            (quantity > cartItem.stock) ? setShowStockWarning(true) : setShowStockWarning(false);
        };
    }, [quantity]);

    const updateQuantity = async (event) => {
        event.preventDefault();
        if (cartItem.quantity !== quantity) {
            try {
                const response = await axios.patch(`/api/cartItemColorSizes/${cartItem.cartItemColorSizeId}`, { quantity }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`
                    }
                });
                if (response.data.success) cartItem.quantity = response.data.updatedCartItemColorSize.quantity;
                calcTotal();
            } catch (error) {
                console.error(error);
            };
        };
    };

    const removeItem = async () => {
        try {
            await axios.delete(`api/cartItemColorSizes/${cartItem.cartItemColorSizeId}`, {
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
                    <button className="btn btn-outline-secondary" onClick={() => {
                        navigate(`/shirts/${cartItem.item.split(" ").join("_")}?color=${cartItem.color}&size=${cartItem.size}`)
                    }}>
                        <img
                            className="product-thumbnail"
                            src={cartItem.imageURL}
                            alt={cartItem.item}
                        />
                    </button>
                </div>
                <div className="flex-grow-1">
                    <div className="card-body">
                        <a className="nav-link" href={
                            `/#/shirts/${cartItem.item.split(" ").join("_")}?color=${cartItem.color}&size=${cartItem.size}`
                        }>
                            <h5 className="card-title">{cartItem.item}</h5>
                        </a>
                        <p className="card-text">Size: {cartItem.size.toUpperCase()}</p>
                        <p className="card-text">Color: {cartItem.color}</p>
                        <form onSubmit={updateQuantity}>
                            <div className="mb-3 row align-items-center">
                                <div className="col-auto">
                                    <label htmlFor="cart-item-quantity" className="form-label card-text">Quantity</label>
                                </div>
                                <div className="col-auto">
                                    <input
                                        type="number"
                                        className="form-control quantity-selection"
                                        aria-describedby="stock-warning"
                                        id="cart-item-quantity"
                                        value={quantity}
                                        onChange={(event) => setQuantity(event.target.value)}
                                    />
                                </div>
                                {
                                    showStockWarning ?
                                        <div className="form-text col-auto text-danger" id="stock-warning">
                                            Only {cartItem.stock} left in stock!
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={
                                    (!quantity || Number(quantity) === cartItem.quantity || quantity > cartItem.stock) ?
                                        true
                                        :
                                        false
                                }
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