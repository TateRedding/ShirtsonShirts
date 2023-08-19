import React, { useState, useEffect } from "react";
import axios from "axios";
import SizeSelect from "./tools/SizeSelect"
import { useNavigate, useParams } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";

const ItemDetails = ({ userToken, user, sizes, isLoggedIn }) => {
    const itemName = useParams().itemName.split("_").join(" ");
    const [item, setItem] = useState({});
    const [selectedItemStyle, setSelectedItemStyle] = useState({});
    const [selectedSizeId, setSelectedSizeId] = useState("");
    const [selectedItemStyleSize, setSelectedItemStyleSize] = useState({});
    const [quantity, setQuantity] = useState("");
    const [showQuantityError, setShowQuantityError] = useState(false);
    const [showItemInCartError, setShowItemInCartError] = useState(false);

    const navigate = useNavigate();

    const useQuery = () => {
        const { search } = useLocation();
        return React.useMemo(() => new URLSearchParams(search), [search]);
    };

    const query = useQuery();
    const styleQuery = query.get("style");
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
        if (item.styles) {
            if (styleQuery) {
                setSelectedItemStyle(item.styles.find(itemStyle => itemStyle.name === styleQuery));
            } else {
                setSelectedItemStyle(item.styles[0]);
            };
        };
    }, [item]);

    useEffect(() => {
        if (sizeQuery && selectedItemStyle.sizes) {
            const iss = selectedItemStyle.sizes.find(iss => iss.sizeSymbol === sizeQuery);
            if (iss && iss.stock) {
                setSelectedSizeId(iss.sizeId);
            };
        };
    }, [selectedItemStyle]);

    useEffect(() => {
        if (selectedItemStyle.sizes && selectedSizeId) {
            setSelectedItemStyleSize(selectedItemStyle.sizes.find(itemStyleSize => itemStyleSize.sizeId === Number(selectedSizeId)));
        };
    }, [selectedItemStyle, selectedSizeId]);

    const addToCart = async (event) => {
        event.preventDefault();
        setShowQuantityError(false);
        setShowItemInCartError(false);
        if (selectedItemStyleSize.stock < quantity) {
            setShowQuantityError(true);
        } else {
            try {
                const response = await axios.post("/api/cartItemStyleSizes/",
                    {
                        itemStyleSizeId: selectedItemStyleSize.id,
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
                        Authorization: `Bearer ${userToken}`,
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
                        Authorization: `Bearer ${userToken}`,
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

            <h1>{item.name}{!item.isActive ? " (INACTIVE)" : null}</h1>
            <div className="item-detail-child">
                <div className="item-detail-image-container">
                    <img className="item-detail-image" src={selectedItemStyle.imageURL} alt={`${item.name} in style ${selectedItemStyle.name}`} />
                </div>

                <div className="item-detail-description">
                    <li>{item.price}$</li>
                    <li>{item.description}</li>
                </div>
                {
                    (user.isAdmin) ?
                        <div>
                            <Link to={`/products/edit/${item.id}`}><button className="btn btn-primary">Edit Item</button></Link>
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
                                item.styles && item.styles.length > 1 ?
                                    <select
                                        className="form-select"
                                        aria-label="style-select"
                                        value={selectedItemStyle.id}
                                        required
                                        onChange={(event) => {
                                            setSelectedSizeId("");
                                            setSelectedItemStyle(item.styles.find(style => style.id.toString() === event.target.value))
                                        }}>
                                        {
                                            item.styles.map((style) => {
                                                return <option value={style.id} key={style.id}>{style.name}</option>
                                            })
                                        }
                                    </select>
                                    :
                                    null
                            }
                            <SizeSelect
                                itemStyle={selectedItemStyle}
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
                                                        Sorry, there are only {selectedItemStyleSize.stock} left in stock.
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
        </div>
    );
};

export default ItemDetails;
