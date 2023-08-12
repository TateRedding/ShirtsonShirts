import React, { useState, useEffect } from "react";
import axios from "axios";
import SizeSelect from "./tools/SizeSelect"
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const ItemDetails = ({ userToken, user, isLoggedIn }) => {
    const { itemname } = useParams();
    const [item, setItem] = useState([]);
    const [selectedItemStyle, setSelectedItemStyle] = useState({});
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState("");
    const [showQuantityError, setShowQuantityError] = useState(false);
    const [showItemInCartError, setShowItemInCartError] = useState(false);

    const navigate = useNavigate();

    const getItems = async () => {
        try {
            const response = await axios.get(`/api/items/name/${itemname}`);
            setItem(response.data.item);
            setSelectedItemStyle(response.data.item.styles[0]);
        } catch (err) {
            console.error(err);
        };
    };
    useEffect(() => {
        getItems();
    }, []);

    const addToCart = async (event) => {
        event.preventDefault();
        setShowQuantityError(false);
        setShowItemInCartError(false);
        if (selectedItemStyle[selectedSize] < quantity) {
            setShowQuantityError(true);
        } else {
            try {
                const response = await axios.post(
                    `/api/cartItemStyles/`,
                    {
                        itemStyleId: selectedItemStyle.id,
                        quantity,
                        size: selectedSize
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

    return (
        <div className="item-detail-container">
            <h1>{item.name}</h1>
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
                        <Link to={`/products/edit/${item.id}`}><button className="btn btn-primary">Edit Item</button></Link>
                        :
                        null
                }
                <form className="item-selection-form" onSubmit={addToCart}>
                    {
                        item.styles && item.styles.length > 1 ?
                            <select
                                className="form-select"
                                aria-label="style-select"
                                defaultValue={selectedItemStyle.id}
                                required
                                onChange={(event) => {
                                    setSelectedSize("");
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
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}
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
                                                Sorry, there are only {selectedItemStyle[selectedSize]} left in stock.
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
            </div>
        </div>
    );
};

export default ItemDetails;
