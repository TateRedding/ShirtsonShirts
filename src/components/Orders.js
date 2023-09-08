import React, { useState, useEffect } from "react";
import axios from "axios";
import PreviousOrderCard from "./PreviousOrderCard";

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
        <>
            <h1 className="oh-title">Order History</h1>
            {
                orders.length ?
                    orders.reverse().map((order) => {
                        return order.items.map((cartItem) => {
                            return (
                                <PreviousOrderCard
                                    cartItem={cartItem}
                                    userToken={userToken}
                                    purchaseTime={order.purchaseTime}
                                    getCart={getCart}
                                    key={cartItem.cartItemColorSizeId}
                                />
                            );
                        });
                    })
                    :
                    <h5 className="no-previous-orders">
                        You do not have any previous orders! Get to shopping!
                    </h5>
            }
        </>
    );
};

export default Orders;
