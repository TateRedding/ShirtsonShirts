import React from "react";
import ProductCard from "./ProductCard";

const AllItems = ({ filteredItems }) => {
    return (
        <div className="d-flex flex-wrap justify-content-around">
            {
                filteredItems.map((item, index) => {
                    return <ProductCard item={item} key={index} />
                })
            }
        </div>
    )
}

export default AllItems;