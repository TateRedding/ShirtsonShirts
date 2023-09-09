import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const SingleCartItem = ({ cartItem, userToken, getCart, calcTotal }) => {
    const [showStockWarning, setShowStockWarning] = useState(false);

    useEffect(() => {
        if (cartItem) {
            (cartItem.quantity === cartItem.stock) ? setShowStockWarning(true) : setShowStockWarning(false);
        };
    }, [cartItem, cartItem.quantity]);

    const changeQuantity = async (amount) => {
        try {
            const response = await axios.patch(`/api/cartItemColorSizes/${cartItem.cartItemColorSizeId}`, { quantity: cartItem.quantity + amount }, {
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
        <div className="cart-item-container w-100 d-flex border-bottom py-3">
            <div className="cart-item-column d-flex">
                <div className="cart-thumbnail-wrapper d-flex align-items-center justify-content-center">
                    <img
                        className="cart-thumbnail"
                        src={cartItem.imageURL}
                        alt={`${cartItem.item} in ${cartItem.color}`}
                    />
                </div>
                <div className="cart-item-details d-flex flex-column flex-grow-1">
                    <a className="cart-link" href={`#/shirts/${cartItem.item.split(" ").join("_")}?color=${cartItem.color}&size=${cartItem.size}`}>
                        <h3 className="fw-bold">{cartItem.item}</h3>
                    </a>
                    <div className="w-100 d-flex">
                        <dt className="description-key fw-bold">Size:</dt>
                        <dd>{cartItem.size.toUpperCase()}</dd>
                    </div>
                    <div className="w-100 d-flex">
                        <dt className="description-key fw-bold">Color:</dt>
                        <dd>{cartItem.color[0].toUpperCase() + cartItem.color.slice(1)}</dd>
                    </div>
                </div>
            </div>
            <div className="cart-item-column">
                ${cartItem.price.toFixed(2)}
            </div>
            <div className="cart-item-column">
                <div className="d-flex align-items-center">
                    {
                        cartItem.quantity === 1 ?
                            <i className="bi bi-dash-circle me-2 text-danger"></i>
                            :
                            <i
                                className="quantity-button bi bi-dash-circle me-2"
                                onClick={() => changeQuantity(-1)}
                            ></i>

                    }
                    {cartItem.quantity}
                    {
                        cartItem.quantity === cartItem.stock ?
                            <i className="bi bi-plus-circle ms-2 text-danger"></i>
                            :
                            <i
                                className="quantity-button bi bi-plus-circle ms-2"
                                onClick={() => changeQuantity(1)}
                            ></i>
                    }
                </div>
                {
                    showStockWarning ?
                        <p className="text-danger stock-warning">Can't add more, only {cartItem.stock} left in stock!</p>
                        :
                        null
                }
            </div>
            <div className="cart-item-column">
                ${(cartItem.price * cartItem.quantity).toFixed(2)}
            </div>
            <div className="cart-item-column">
                <i className="remove-item bi bi-x-circle" onClick={removeItem}></i>
            </div>
        </div>
    );
};

export default SingleCartItem;