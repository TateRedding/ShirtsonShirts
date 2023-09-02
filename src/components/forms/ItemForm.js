import React, { useState, useEffect } from "react";
import axios from "axios";
import SelectOrAddCategory from "../tools/SelectOrAddCategory";
import ItemColorForm from "./ItemColorForm";
import { useLocation, useParams } from "react-router-dom";

const NewItemForm = ({ userToken, categories, getCategories, user, sizes }) => {
    const [item, setItem] = useState({});
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState(0);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [itemColors, setItemColors] = useState([]);

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
            setItemColors(item.colors);
        };
    };

    const createNewItem = async (event) => {
        event.preventDefault();

        const response = await axios.post("/api/items", {
            name,
            categoryId,
            description,
            price,
            colors: itemColors
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
            setItemColors([]);
        };
    };

    const updateItem = async (event) => {
        event.preventDefault();

        const response = await axios.patch(`/api/items/${itemId}`, {
            name,
            categoryId,
            description,
            price,
            colors: itemColors
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}`
            }
        });

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
                                    itemColors.map((itemColor, idx) => (
                                        <ItemColorForm
                                            itemColor={itemColor}
                                            itemColors={itemColors}
                                            setItemColors={setItemColors}
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
                                    setItemColors([...itemColors, {
                                        name: "",
                                        imageURL: "./images/default_shirt.png",
                                        sizes: []
                                    }]);
                                }}
                            >
                                Add Color
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