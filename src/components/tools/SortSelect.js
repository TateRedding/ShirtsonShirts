import React from "react";

const SortSelect = ({ sortingFunctions, selectedSortIdx, setSelectedSortIdx }) => {
    return (
        <div>
            <select
                className="form-select sort-select"
                value={selectedSortIdx}
                onChange={(event) => setSelectedSortIdx(event.target.value)}
            >
                {
                    sortingFunctions.map((sort, idx) => <option value={idx} key={idx}>{sort.name}</option>)
                }
            </select>
        </div>
    );
};

export default SortSelect;