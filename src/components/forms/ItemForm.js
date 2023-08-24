import React, { useState, useEffect } from "react";
import axios from "axios";
import SelectOrAddCategory from "../tools/SelectOrAddCategory";
import ItemStyleForm from "./ItemStyleForm";
import { useLocation, useParams } from "react-router-dom";

const NewItemForm = ({ userToken, categories, getCategories, user, sizes }) => {
    const [item, setItem] = useState({});
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState(0);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [itemStyles, setItemStyles] = useState([]);

    const { itemId } = useParams();

    const { pathname } = useLocation();

    useEffect(() => {
        getCategories();
        setEditing(pathname.includes("edit"));
    }, []);

    useEffect(() => {
        if (editing) getItemData();
    }, [editing]);

    useEffect(() => {
        setValues();
    }, [item]);

    const getItemData = async () => {
        try {
            const response = await axios.get(`/api/items/${itemId}`);
            setItem(response.data.item);
        } catch (error) {
            console.error(error);
        };
    };

    const setValues = () => {
        if (item && Object.keys(item).length) {
            setName(item.name)
            setCategoryId(item.categoryId);
            setDescription(item.description);
            setPrice(item.price);
            setItemStyles(item.styles);
        };
    };

    const createNewItem = async (event) => {
        event.preventDefault();

        const response = await axios.post("/api/items", {
            name,
            categoryId,
            description,
            price,
            styles: itemStyles
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}`
            }
        });

        if (response.data.success) {
            setName("");
            setCategoryId(0);
            setDescription("");
            setPrice("");
            setItemStyles([]);
        };
    };

    const updateItem = async (event) => {
        event.preventDefault();

        const response = await axios.patch(`/api/items/${itemId}`, {
            name,
            categoryId,
            description,
            price,
            styles: itemStyles
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}`
            }
        });

        console.log(response.data);

        if (response.data.success) {
            getItemData();
        };
    };

    return (
        <>
            {
                (user.isAdmin) ?
                    <div className="item-form-container">
                        <form onSubmit={(event) => editing ? updateItem(event) : createNewItem(event)} className="item-form" autoComplete="off">
                            <h1>{editing ? "Edit Product" : "New Product"}</h1>

                            <div className="form-floating mb-3 item-field">
                                <input
                                    className="form-control"
                                    id="item-name"
                                    value={name}
                                    required
                                    placeholder="Name"
                                    onChange={(event) => setName(event.target.value)}
                                />
                                <label htmlFor="item-name">Item Name *</label>
                            </div>

                            <SelectOrAddCategory
                                categories={categories}
                                getCategories={getCategories}
                                categoryId={categoryId}
                                setCategoryId={setCategoryId}
                                userToken={userToken}
                            />

                            <div className="form-floating mb-3">
                                <textarea
                                    className="form-control"
                                    id="item-description"
                                    value={description}
                                    required
                                    rows={5}
                                    placeholder="Description"
                                    style={{
                                        height: "100px"
                                    }}
                                    onChange={(event) => setDescription(event.target.value)}
                                />
                                <label htmlFor="item-description">Description *</label>
                            </div>

                            <div className="form-floating mb-3">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="item-price"
                                    value={price}
                                    required
                                    onChange={(event) => setPrice(event.target.value)}
                                />
                                <label htmlFor="item-price">Price *</label>
                            </div>

                            <div className="d-flex">
                                {
                                    itemStyles.map((itemStyle, idx) => (
                                        <ItemStyleForm
                                            itemStyle={itemStyle}
                                            itemStyles={itemStyles}
                                            setItemStyles={setItemStyles}
                                            index={idx}
                                            sizes={sizes}
                                            key={idx}
                                        />
                                    ))
                                }
                            </div>

                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => {
                                    setItemStyles([...itemStyles, {
                                        name: "",
                                        imageURL: "./images/default_shirt.png",
                                        sizes: []
                                    }]);
                                }}
                            >
                                Add Style
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                {editing ? "Update Product" : "Create Product"}
                            </button>
                        </form >
                    </div >
                    :
                    <div className="admin-warning">
                        <h2>Access Denied</h2>
                        <h3>You must be an administrator to view this page!</h3>
                    </div>
            }
        </>
    );
};

export default NewItemForm;