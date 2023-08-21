import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Search from "./tools/Search";
import SelectCategory from "./tools/SelectCategory";
import { Link } from "react-router-dom";
import NewCategoryForm from "./forms/NewCategoryForm"

const Products = ({ items, setItems, getItems, categories, user, userToken }) => {
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setFilteredItems(items);
    }, [items]);

    return (
        <div>
            <h1 className="text-center">Shirts!</h1>
            <div className="d-flex justify-content-evenly">
                <div className="d-flex product-page-tool">
                    <SelectCategory
                        setItems={setItems}
                        getItems={getItems}
                        categories={categories}
                        setSearchTerm={setSearchTerm}
                        userToken={userToken}
                    />
                    <Search
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        items={items}
                        setFilteredItems={setFilteredItems}
                    />
                </div>
                {
                    (user.isAdmin) ?
                        <>
                            <div className="product-page-tool">
                                <NewCategoryForm userToken={userToken} />
                            </div>
                            <div className="product-page-tool">
                                <Link to="/products/new"><button className="btn btn-primary">Add new Product</button></Link>
                            </div>
                        </> :
                        null
                }
            </div>
            <div className="d-flex flex-wrap justify-content-around">
                {
                    filteredItems.map((item, index) => {
                        return <ProductCard item={item} key={index} />
                    })
                }
            </div>
        </div>
    )
}

export default Products;

