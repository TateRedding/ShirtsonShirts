import React, { useState, useEffect } from "react";
import axios from "axios";
import SizeSelect from "./tools/SizeSelect"
import { useNavigate, useParams } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";

const ItemDetails = ({ userToken, user, sizes, isLoggedIn }) => {
    const itemName = useParams().itemName.split("_").join(" ");
    const [item, setItem] = useState({});
    const [selectedItemColor, setSelectedItemColor] = useState({});
    const [selectedSizeId, setSelectedSizeId] = useState("");
    const [selectedItemColorSize, setSelectedItemColorSize] = useState({});
    const [quantity, setQuantity] = useState("");
    const [showQuantityError, setShowQuantityError] = useState(false);
    const [showItemInCartError, setShowItemInCartError] = useState(false);

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
            if (iss && iss.stock) {
                setSelectedSizeId(iss.sizeId);
            };
        };
    }, [selectedItemColor]);

    useEffect(() => {
        if (selectedItemColor.sizes && selectedSizeId) {
            setSelectedItemColorSize(selectedItemColor.sizes.find(itemColorSize => itemColorSize.sizeId === Number(selectedSizeId)));
        };
    }, [selectedItemColor, selectedSizeId]);

    const addToCart = async (event) => {
        event.preventDefault();
        setShowQuantityError(false);
        setShowItemInCartError(false);
        if (selectedItemColorSize.stock < quantity) {
            setShowQuantityError(true);
        } else {
            try {
                const response = await axios.post("/api/cartItemColorSizes/",
                    {
                        itemColorSizeId: selectedItemColorSize.id,
                        quantity
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );
                if (response.data.success) {
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
            const response = await axios.patch(`api/items/${item.id}`,
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
        <div className="item-detail-container">

            <h1>{item.name}</h1>
            {
                !item.isActive ?
                    <h2 className="text-danger">This shirt is no longer for sale.</h2>
                    :
                    null
            }
            <div className="item-detail-child">
                <div className="item-detail-image-container">
                    <img className="item-detail-image" src={selectedItemColor.imageURL} alt={`${item.name} in color ${selectedItemColor.name}`} />
                </div>

                <div className="item-detail-description">
                    <li>{item.price}$</li>
                    <li>{item.description}</li>
                </div>
                {
                    (user.isAdmin) ?
                        <div>
                            <Link to={`/shirts/edit/${item.id}`}><button className="btn btn-primary">Edit Item</button></Link>
                            {
                                item.isActive ?
                                    <button className="btn btn-danger" onClick={deactivateItem}>Deactivate Item</button>
                                    :
                                    <button className="btn btn-success" onClick={reactivateItem}>Reactivate Item</button>
                            }
                        </div>
                        :
                        null
                }
                {
                    item.isActive ?
                        <form className="item-selection-form" onSubmit={addToCart}>
                            {
                                item.colors && item.colors.length > 1 ?
                                    <select
                                        className="form-select"
                                        aria-label="color-select"
                                        value={selectedItemColor.id}
                                        required
                                        onChange={(event) => {
                                            setSelectedSizeId("");
                                            setSelectedItemColor(item.colors.find(color => color.id.toString() === event.target.value))
                                        }}>
                                        {
                                            item.colors.map((color) => <option value={color.id} key={color.id}>{color.name}</option>)
                                        }
                                    </select>
                                    :
                                    null
                            }
                            <SizeSelect
                                itemColor={selectedItemColor}
                                sizes={sizes}
                                selectedSizeId={selectedSizeId}
                                setSelectedSizeId={setSelectedSizeId}
                            />
                            {
                                isLoggedIn ?
                                    <>
                                        <div className="form-floating mb-3" id="quantity-input">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="floatingInput"
                                                onChange={(event) => setQuantity(event.target.value)}
                                                required
                                                placeholder="0"
                                                name="quantity"
                                                value={quantity}
                                            />
                                            <label htmlFor="floatingInput">Quantity</label>
                                            {
                                                showQuantityError ?
                                                    <div id="quantity-error-message" className="form-text">
                                                        Sorry, there are only {selectedItemColorSize.stock} left in stock.
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Add To Cart
                                        </button>
                                    </>
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
            </div>
        </div >
    );
};

export default ItemDetails;
