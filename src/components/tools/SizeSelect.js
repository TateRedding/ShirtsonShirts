import React from "react";

const SizeSelect = ({ itemStyle, sizes, selectedSizeId, setSelectedSizeId }) => {
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
                sizes.length && itemStyle.sizes ?
                    sizes.map(size => {
                        return itemStyle.sizes.find(itemStyleSize => itemStyleSize.sizeId === size.id && itemStyleSize.stock) ?
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