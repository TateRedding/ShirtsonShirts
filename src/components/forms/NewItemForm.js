import React, { useState, useEffect } from "react";
import axios from "axios";

const NewItemForm = ({ userToken, categories, getCategories, user }) => {
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState(0);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [styles, setStyles] = useState([]);

    const [addingNewCategory, setAddingNewCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [showCategoryWarning, setShowCategoryWarning] = useState(false);

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        setAddingNewCategory(categoryId === "new");
    }, [categoryId]);

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

    const createNewCategory = async (event) => {
        event.preventDefault();
        setShowCategoryWarning(false);
        if (!newCategory) return;

        try {
            const existingCategory = await axios.get(`/api/categories/${newCategory}`);
            if (existingCategory.data.success) {
                setShowCategoryWarning(true);
            } else {
                const response = await axios.post("/api/categories", { name: newCategory }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`
                    }
                });
                if (response.data.success) {
                    setCategoryId(response.data.category.id);
                    setAddingNewCategory(false);
                    getCategories();
                };
            };
        } catch (error) {
            console.error(error);
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

                            <div className="d-flex align-items-between">
                                <select
                                    className="form-select mb-3"
                                    onChange={(event) => setCategoryId(event.target.value)}
                                    value={categoryId}
                                >
                                    <option value={""}>Select Category</option>
                                    <option value={"new"}>Add New Category</option>
                                    {
                                        categories.length ?
                                            categories.map((category, idx) => {
                                                return (
                                                    <option value={category.id} key={idx}>{category.name}</option>
                                                )
                                            }) :
                                            null
                                    }
                                </select>
                                {
                                    addingNewCategory ?
                                        <>
                                            <input
                                                className="form-control"
                                                value={newCategory}
                                                onChange={(event) => setNewCategory(event.target.value)}
                                            />
                                            {
                                                showCategoryWarning ?
                                                    <div className="form-text text-danger">
                                                        That category already exists!
                                                    </div>
                                                    :
                                                    null
                                            }
                                            <button
                                                className="btn btn-primary"
                                                onClick={createNewCategory}
                                            >
                                                Add
                                            </button>
                                        </>
                                        :
                                        null
                                }
                            </div>

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