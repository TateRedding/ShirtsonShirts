import React, { useState, useEffect } from "react";
import axios from "axios";
import SelectOrAddCategory from "../tools/SelectOrAddCategory";

const NewItemForm = ({ userToken, categories, getCategories, user }) => {
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState(0);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [styles, setStyles] = useState([]);

    useEffect(() => {
        getCategories();
    }, []);

    const exampleData = {
        name: "New Item",
        categoryId: 3,
        description: "It's a shirt",
        price: 350,
        styles: [
            {
                name: "yellow",
                imageURL: "./images/yellow_shirt.png",
                sizes: [
                    {
                        name: "medium",
                        stock: 15
                    },
                    {
                        name: "large",
                        stock: 10
                    }
                ]
            },
            {
                name: "green",
                imageURL: "./images/green_shirt.png",
                sizes: [
                    {
                        name: "small",
                        stock: 12
                    },
                    {
                        name: "extraLarge",
                        stock: 9
                    }
                ]
            }
        ]
    }

    const createNewItem = async (event) => {
        event.preventDefault();

        const newItemData = {
            name,
            size,
            description,
            categoryId,
            price,
            imageURL
        };

        const newItem = await axios.post("/api/items", newItemData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}`
            }
        });

        if (newItem) {
            setName("");
            setSize("");
            setDescription("");
            setCategoryId(0);
            setImageURL("");
            setPrice("");
        };
    };

    return (
        <>
            {
                (user.isAdmin) ?
                    <div className="item-form-container">
                        <form onSubmit={createNewItem} className="item-form" autoComplete="off">
                            <h1>New Product</h1>

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
                                        height: 100 + "px"
                                    }}
                                    onChange={(event) => setDescription(event.target.value)}
                                />
                                <label htmlFor="item-description">Description *</label>
                            </div>

                            <div className="form-floating mb-3 item-field">
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

                            <button
                                type="submit"
                                className="btn btn-primary item-form-button"
                                disabled={
                                    name && description && price && categoryId && description ?
                                        false :
                                        true
                                }
                            >
                                Create New Item
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