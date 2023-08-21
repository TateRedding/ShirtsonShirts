import axios from "axios";
import React, { useEffect, useState } from "react";

const SelectCategory = ({ categories, setItems, getItems, setSearchTerm, userToken }) => {
    const [categoryId, setCategoryId] = useState("0");

    const filterByCategory = async () => {
        try {
            if (categoryId !== "0") {
                const response = await axios.get(`/api/items/category/${categoryId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`
                    }
                });
                if (response.data.success) setItems(response.data.items);
            } else {
                getItems();
            };
            setSearchTerm("");
        } catch (error) {
            console.error(error);
        };
    };

    useEffect(() => {
        filterByCategory();
    }, [categoryId]);

    return (
        <select
            className="form-select mx-3 category-filter"
            aria-label="category selection"
            defaultValue={0}
            onChange={(event) => setCategoryId(event.target.value)}>
            <option value={0}>All Categories</option>
            {
                categories.map((category) => {
                    return <option value={category.id} key={category.id}>{category.name}</option>
                })
            }
        </select>
    );
};

export default SelectCategory;