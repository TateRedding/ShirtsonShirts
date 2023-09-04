import axios from "axios";
import React, { useEffect, useState } from "react";

const SelectCategory = ({ categories, setItems, getItems, setSearchTerm, userToken }) => {
    const [categoryId, setCategoryId] = useState(0);
    const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
    const [showContents, setShowContents] = useState(false);

    const filterByCategory = async () => {
        try {
            if (categoryId) {
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
        <div className="p-3 border-bottom">
            <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0">CATEGORY</p>
                <i className="down-chevron bi bi-chevron-down" onClick={() => setShowContents(!showContents)}></i>
            </div>
            {
                showContents ?
                    <div>
                        <div
                            className={`category-list-item my-2 ${selectedCategoryIdx === 0 ? "fw-bold" : "text-secondary"}`}
                            onClick={() => {
                                setCategoryId(0);
                                setSelectedCategoryIdx(0);
                            }}
                        >
                            All Categories
                        </div>
                        {
                            categories.map((category, idx) => {
                                const name = category.name.split("-").map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(" ");
                                return <div
                                    key={category.id}
                                    className={`category-list-item my-2 ${selectedCategoryIdx === idx + 1 ? "fw-bold" : "text-secondary"}`}
                                    onClick={() => {
                                        setCategoryId(category.id);
                                        setSelectedCategoryIdx(idx + 1);
                                    }}
                                >
                                    {name}
                                </div>
                            })
                        }
                    </div>
                    :
                    null
            }
        </div>


        // <select
        //     className="form-select product-filter"
        //     aria-label="category selection"
        //     defaultValue={0}
        //     onChange={(event) => setCategoryId(event.target.value)}>
        //     <option value={0}>All Categories</option>
        //     {
        //         categories.map((category) => {
        //             const name = category.name.split("-").map(word => word[0].toUpperCase() +word.slice(1).toLowerCase()).join(" ");
        //             return <option value={category.id} key={category.id}>{name}</option>
        //         })
        //     }
        // </select>
    );
};

export default SelectCategory;