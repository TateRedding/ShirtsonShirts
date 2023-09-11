import React, { useState, useEffect } from "react";
import axios from "axios";
import SingleCartItem from "./SingleCartItem";

const Orders = ({ userToken, user, getCart }) => {
    const [orders, setOrders] = useState([]);

    const getOrders = async () => {
        try {
            if (user.id) {
                const response = await axios.get(
                    `/api/carts/${user.id}/previous`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${userToken}`,
                        },
                    }
                );
                console.log(response.data.carts)
                if (response.data.success) setOrders(response.data.carts);
            };
        } catch (error) {
            console.error(error);
        };
    };

    useEffect(() => {
        getOrders();
    }, [user]);

    return (
        <div className="cart-content d-flex flex-column">
            <h2 className="mt-3"><b>Orders</b></h2>
            {
                orders.length ?
                    orders.sort((a, b) => a.purchaseTime > b.purchaseTime).map(order => (
                        <div key={order.id}>
                            <div className="pb-3 mt-3 d-flex justify-content-between">
                                <h4><b>{new Date(Date.parse(order.purchaseTime)).toString().split(" ").slice(0, 4).join(" ")}</b></h4>
                                <h4>Total: ${order.items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0).toFixed(2)}</h4>
                            </div>
                            <div className="cart-header-container border-bottom border-secondary pb-3 mb-3 w-100">
                                <span className="cart-header">Item</span>
                                <span className="cart-header">Price</span>
                                <span className="cart-header">Quantity</span>
                                <span className="cart-header">Total</span>
                                <span className="cart-header">Reorder</span>
                            </div>
                            {
                                order.items.map(cartItem => (
                                    <SingleCartItem
                                        cartItem={cartItem}
                                        userToken={userToken}
                                        getCart={getCart}
                                        isPurchased={order.isPurchased}
                                        key={cartItem.cartItemColorSizeId}
                                    />
                                ))
                            }
                        </div>
                    ))
                    :
                    <h5>
                        You do not have any previous orders! Get to shopping!
                    </h5>
            }
        </div>
    );
};

export default Orders;
