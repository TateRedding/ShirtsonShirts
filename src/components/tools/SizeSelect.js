import React from "react";

const SizeSelect = ({ itemColor, sizes, selectedSizeId, setSelectedSizeId }) => {
    return (
        <select
            className="form-select"
            aria-label="size-select"
            value={selectedSizeId}
            required
            onChange={(event) => setSelectedSizeId(event.target.value)}
        >
            <option value="">Select Size</option>
            {
                sizes.length && itemColor.sizes ?
                    sizes.map(size => {
                        return itemColor.sizes.find(itemColorSize => itemColorSize.sizeId === size.id && itemColorSize.stock) ?
                            <option value={size.id} key={size.id}>{size.symbol.toUpperCase()}</option> :
                            <option value={size.id} key={size.id} disabled>{size.symbol.toUpperCase()} Out of Stock</option>
                    })
                    :
                    null
            }
        </select>
    );
};

export default SizeSelect;