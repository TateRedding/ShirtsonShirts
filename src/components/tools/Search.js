import React, { useState } from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
    const [showContents, setShowContents] = useState(false);

    return (
        <div className="p-3 border-bottom">
            <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0">SEARCH</p>
                <i className="down-chevron bi bi-chevron-down" onClick={() => setShowContents(!showContents)}></i>
            </div>
            {
                showContents ?
                    <div className="mt-2">
                        <input
                            className="form-control search-bar"
                            type="text"
                            placeholder="Search by name"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>
                    :
                    null
            }
        </div>
    );
};

export default Search;
