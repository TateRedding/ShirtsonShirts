import React, { useState, useEffect } from "react";
import axios from "axios";
import SizeSelect from "./tools/SizeSelect"
import { useNavigate, useParams } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import ColorSelect from "./tools/ColorSelect";
import "../styles/ItemDetails.css";

const ItemDetails = ({ userToken, user, sizes, isLoggedIn, getCart }) => {
    const itemName = useParams().itemName.split("_").join(" ");
    const [item, setItem] = useState({});
    const [selectedItemColor, setSelectedItemColor] = useState({});
    const [selectedSize, setSelectedSize] = useState({});
    const [selectedItemColorSize, setSelectedItemColorSize] = useState({});
    const [showItemInCartError, setShowItemInCartError] = useState(false);
    const [showSizeSelectError, setShowSizeSelectError] = useState(false);

    const navigate = useNavigate();

    const useQuery = () => {
        const { search } = useLocation();
        return React.useMemo(() => new URLSearchParams(search), [search]);
    };

    const query = useQuery();
    const colorQuery = query.get("color");
    const sizeQuery = query.get("size");

    const getItem = async () => {
        try {
            const response = await axios.get(`/api/items/name/${itemName}`);
            setItem(response.data.item);
        } catch (err) {
            console.error(err);
        };
    };

    useEffect(() => {
        getItem();
    }, []);

    useEffect(() => {
        if (item.colors) {
            if (colorQuery) {
                setSelectedItemColor(item.colors.find(itemColor => itemColor.name === colorQuery));
            } else {
                setSelectedItemColor(item.colors[0]);
            };
        };
    }, [item]);

    useEffect(() => {
        if (sizeQuery && selectedItemColor.sizes) {
            const iss = selectedItemColor.sizes.find(iss => iss.symbol === sizeQuery);
            if (sizes.length && iss && iss.stock) {
                setSelectedSize(sizes.find(size => size.id === iss.sizeId));
            };
        };
    }, [selectedItemColor]);

    useEffect(() => {
        if (selectedItemColor.sizes && selectedSize.id) {
            setSelectedItemColorSize(selectedItemColor.sizes.find(itemColorSize => itemColorSize.sizeId === Number(selectedSize.id)));
        };
    }, [selectedItemColor, selectedSize]);

    const addToCart = async (event) => {
        event.preventDefault();
        setShowItemInCartError(false);
        setShowSizeSelectError(false);
        if (!Object.keys(selectedSize).length) {
            setShowSizeSelectError(true);
        } else {
            try {
                const response = await axios.post("/api/cartItemColorSizes/",
                    {
                        itemColorSizeId: selectedItemColorSize.id,
                        quantity: 1
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );
                if (response.data.success) {
                    getCart();
                    navigate("/cart");
                } else {
                    if (response.data.error && response.data.error === "ItemAlreadyInCart") setShowItemInCartError(true);
                };
            } catch (error) {
                console.error(error);
            };
        };
    };

    const deactivateItem = async () => {
        try {
            const response = await axios.delete(`api/items/${item.id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`,
                    },
                }
            );
            if (response.data.success) {
                getItem();
            };
        } catch (error) {
            console.error(error);
        };
    };

    const reactivateItem = async () => {
        try {
            const response = await axios.patch(`api/items/reactivate/${item.id}`,
                {
                    isActive: true
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`,
                    },
                }
            );
            if (response.data.success) {
                getItem();
            };
        } catch (error) {
            console.error(error);
        };
    };

    return (
        <div className="product-view d-flex">
            <div className="image-wrapper">
                <div className="product-image d-flex align-items-center justify-content-center">
                    <img src={selectedItemColor.imageURL} alt={`${item.name} in color ${selectedItemColor.name}`} />
                </div>
            </div>
            <div className="product-details">
                <h1>{item.name}</h1>
                {
                    !item.isActive ?
                        <h2 className="text-danger">This shirt is no longer for sale.</h2>
                        :
                        null
                }
                {
                    (user.isAdmin) ?
                        <div className="mb-3">
                            <Link to={`/shirts/edit/${item.id}`}><button className="btn btn-dark me-3">Edit Item</button></Link>
                            {
                                item.isActive ?
                                    <button className="btn btn-dark" onClick={deactivateItem}>Deactivate Item</button>
                                    :
                                    <button className="btn btn-dark" onClick={reactivateItem}>Reactivate Item</button>
                            }
                        </div>
                        :
                        null
                }
                <p>${item.price ? item.price.toFixed(2) : null}</p>
                {
                    item.isActive ?
                        <form onSubmit={addToCart}>
                            <SizeSelect
                                itemColor={selectedItemColor}
                                sizes={sizes}
                                selectedSize={selectedSize}
                                setSelectedSize={setSelectedSize}
                            />
                            {
                                showSizeSelectError ?
                                    <div className="form-text text-danger mb-2" id="size-select-error">
                                        Please select a size.
                                    </div>
                                    :
                                    null
                            }
                            {
                                item.colors && item.colors.length > 1 ?
                                    <ColorSelect
                                        colors={item.colors}
                                        selectedItemColor={selectedItemColor}
                                        setSelectedItemColor={setSelectedItemColor}
                                        setSelectedSize={setSelectedSize}
                                    />
                                    :
                                    null
                            }
                            {
                                isLoggedIn ?
                                    <button
                                        type="submit"
                                        className="btn btn-dark btn-lg w-100 mb-2"
                                    >
                                        Add to Cart
                                    </button>
                                    :
                                    null
                            }
                            {
                                showItemInCartError ?
                                    <>
                                        <p>That shirt is already in your cart!</p>
                                        <p>Edit the quantity from your cart if you wish to buy more</p>
                                    </>
                                    :
                                    null
                            }
                        </form>
                        :
                        null
                }
                <p>{item.description}</p>
            </div>
        </div >
    );
};

export default ItemDetails;
