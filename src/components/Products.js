import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Search from "./tools/Search";
import SelectCategory from "./tools/SelectCategory";
import { Link } from "react-router-dom";
import PriceRangeSelect from "./tools/PriceRangeSelect";
import SortSelect from "./tools/SortSelect";

const Products = ({ items, setItems, getItems, categories, user, userToken }) => {
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(true);

    useEffect(() => {
        setFilteredItems(items);
    }, [items]);

    return (
        <div className="d-flex flex-column align-items-center">
            <h1 className="text-center">Shirts!</h1>
            {
                (user.isAdmin) ?
                    <div className="mb-3">
                        <Link to="/shirts/new">
                            <button className="btn btn-lg btn-primary mt-3">Add New Shirt</button>
                        </Link>
                    </div>
                    :
                    null
            }
            <div className="d-flex px-3 tool-bar">
                <div className="hide-filters me-3" onClick={() => setShowFilters(!showFilters)}>
                    Hide Filters <i className="bi bi-funnel-fill"></i>
                </div>
                <SortSelect />
            </div>
            <div className="d-flex product-container w-100">
                {
                    showFilters ?
                        <div className="filter-container flex-shrink-0 p-3">
                            <Search
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                items={items}
                                setFilteredItems={setFilteredItems}
                            />
                            <SelectCategory
                                setItems={setItems}
                                getItems={getItems}
                                categories={categories}
                                setSearchTerm={setSearchTerm}
                                userToken={userToken}
                            />
                            <PriceRangeSelect />
                        </div>
                        :
                        null
                }
                <div className="product-card-container d-flex flex-wrap justify-content-around flex-grow-1">
                    {
                        filteredItems.map((item, index) => {
                            return <ProductCard item={item} key={index} />
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Products;

