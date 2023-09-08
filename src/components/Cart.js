import React, { useState, useEffect } from "react";
import axios from "axios";
import SingleCartItem from "./SingleCartItem";

const Cart = ({ cart, getCart, userToken }) => {
    const [total, setTotal] = useState(0);

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
        <>
            {
                Object.keys(cart).length && cart.items.length ?
                    <div className="d-flex justify-content-around">
                        <div>
                            {
                                cart.items.map((item) => {
                                    return (
                                        <SingleCartItem
                                            cartItem={item}
                                            userToken={userToken}
                                            getCart={getCart}
                                            calcTotal={calcTotal}
                                            key={item.cartItemColorSizeId}
                                        />
                                    );
                                })
                            }
                        </div>
                        <div>
                            <h5>Total: ${total}</h5>
                            <button className="btn btn-primary" onClick={checkout}>
                                Checkout
                            </button>
                        </div>
                    </div>
                    :
                    <h5 className="text-center mt-3">Your cart is empty. Go buy some shirts!</h5>

            }
        </>
    );
};

export default Cart;
