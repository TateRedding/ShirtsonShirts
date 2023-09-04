import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
    };

    return (
        <div className="mb-3">
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
