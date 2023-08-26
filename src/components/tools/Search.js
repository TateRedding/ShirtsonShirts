import React from "react";

const Search = ({ searchTerm, setSearchTerm, items, setFilteredItems }) => {
    const handleSearch = (event) => {
        const value = event.target.value;
        const filteredItems = items.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
        setSearchTerm(value);
        setFilteredItems(filteredItems);
    };

    return (
        <div>
            <input
                className="form-control search-bar"
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleSearch}
            />
        </div>
    );
};

export default Search;
