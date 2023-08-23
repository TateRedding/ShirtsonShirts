import React, { useState, useEffect } from "react";
import axios from "axios";

const SelectOrAddCategory = ({ categories, getCategories, categoryId, setCategoryId, userToken }) => {
    const [addingNewCategory, setAddingNewCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [showCategoryWarning, setShowCategoryWarning] = useState(false);

    useEffect(() => {
        setAddingNewCategory(categoryId === "new");
    }, [categoryId]);

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
        <div className="d-flex">
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
    );
};

export default SelectOrAddCategory;