import React, { useState, useEffect } from "react";
import axios from "axios";
import SingleCartItem from "./SingleCartItem";

const Cart = ({ cart, getCart, userToken }) => {
    const [total, setTotal] = useState(0);
    const shippingCost = 9.99;
    const taxRate = .05;

    const calcTotal = () => {
        if (cart.items) {
            setTotal(
                cart.items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
            );
        };
    };

    const checkout = async () => {
        try {
            const response = await axios.patch(
                `/api/carts/${cart.id}`, {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`,
                    },
                }
            );
            if (response.data.success) {
                getCart();
            };
        } catch (error) {
            console.error(error);
        };
    };

    useEffect(() => {
        calcTotal();
    }, [cart]);

    return (
        <div className="cart-content d-flex flex-column align-items-center">
            <h2 className="my-3"><b>Your Cart {
                cart.items ?
                    `(${cart.items.reduce((total, item) => total + item.quantity, 0)} items)`
                    :
                    0
            }</b></h2>
            {
                cart.items && cart.items.length ?
                    <>
                        <div className="cart-header-container border-bottom border-secondary pb-3 mb-3 w-100">
                            <span className="cart-header">Item</span>
                            <span className="cart-header">Price</span>
                            <span className="cart-header">Quantity</span>
                            <span className="cart-header">Total</span>
                            <span className="cart-header">Remove</span>
                        </div>
                        <div className="w-100">
                            {
                                cart.items.map((item) => {
                                    return (
                                        <SingleCartItem
                                            cartItem={item}
                                            userToken={userToken}
                                            getCart={getCart}
                                            calcTotal={calcTotal}
                                            isPurchased={cart.isPurchased}
                                            key={item.cartItemColorSizeId}
                                        />
                                    );
                                })
                            }
                        </div>
                        <div className="cart-total d-flex flex-column">
                            <div className="d-flex w-100 justify-content-between mb-3">
                                <b>Subtotal:</b>
                                <span>${total}</span>
                            </div>
                            <div className="d-flex w-100 justify-content-between mb-3">
                                <b>Shipping:</b>
                                <span>${shippingCost}</span>
                            </div>
                            <div className="d-flex w-100 justify-content-between mb-3">
                                <b>Sales Tax:</b>
                                <span>${(total * taxRate).toFixed(2)}</span>
                            </div>
                            <div className="d-flex w-100 justify-content-between mb-3">
                                <b>Grand Total:</b>
                                <b>${(total * (1 + taxRate) + shippingCost).toFixed(2)}</b>
                            </div>
                            <button className="btn btn-dark" onClick={checkout}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                    :
                    <h5 className="text-center">Your cart is empty. Go buy some shirts!</h5>
            }
        </div>
    );
};

export default Cart;
