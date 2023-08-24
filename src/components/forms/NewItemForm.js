import React, { useState, useEffect } from "react";
import axios from "axios";
import SelectOrAddCategory from "../tools/SelectOrAddCategory";
import ItemStyleForm from "./ItemStyleForm";

const NewItemForm = ({ userToken, categories, getCategories, user, sizes }) => {
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState(0);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [itemStyles, setItemStyles] = useState([]);

    useEffect(() => {
        getCategories();
    }, []);

    console.log(itemStyles);

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
                                    itemStyles.map((itemStyle, idx) => {
                                        return <ItemStyleForm
                                            itemStyle={itemStyle}
                                            itemStyles={itemStyles}
                                            setItemStyles={setItemStyles}
                                            index={idx}
                                            sizes={sizes}
                                            key={idx}
                                        />
                                    })
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