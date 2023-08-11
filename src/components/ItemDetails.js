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
        try {
            const response = await axios.post(
                `/api/cartItems/`,
                {
                    itemId: selectedItem.id,
                    quantity: quantity,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            if (response.data.success) {
                navigate("/cart")
            }
        } catch (error) {
            console.error(error);
        };
    };

    const onChange = (event) => {
        if (event.target.name === "quantity-name") {
            setQuantity(event.target.value);
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
                        <Link to={`/products/edit/${item.id}`}><button className="btn btn-primary">Edit Item</button></Link> :
                        null
                }
                <form className="item-selection-form" onSubmit={addToCart}>
                    {
                        item.styles && item.styles.length > 1 ?
                            <select
                                className="form-select"
                                aria-label="style-select"
                                defaultValue={selectedItemStyle.id}
                                onChange={(event) => {
                                    setSelectedSize("");
                                    setSelectedItemStyle(item.styles.find(style => style.id.toString() === event.target.value))
                                }}>
                                {
                                    item.styles.map((style) => {
                                        return <option value={style.id} key={style.id}>{style.name}</option>
                                    })
                                }
                            </select> :
                            null
                    }
                    <SizeSelect
                        itemStyle={selectedItemStyle}
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}
                    />
                    {
                        isLoggedIn ?
                            <div className="form-floating mb-3" id="quantity-input">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingInput"
                                    onChange={onChange}
                                    placeholder="1"
                                    name="quantity-name"
                                    value={quantity}
                                />
                                <label htmlFor="floatingInput">Quantity</label>
                            </div> :
                            null
                    }
                    {
                        isLoggedIn ?
                            <button
                                type="add-to-cart"
                                className="btn btn-primary"
                                id="add-to-cart-button"
                                onClick={addToCart}
                            >
                                Add To Cart
                            </button> :
                            null
                    }
                </form>
            </div>
        </div>
    );
};

export default ItemDetails;
