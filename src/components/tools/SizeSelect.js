import React from "react";

const SizeSelect = ({ itemStyle, selectedSize, setSelectedSize }) => {
    const sizes = {
        "extraSmall": "XS",
        "small": "S",
        "medium": "M",
        "large": "L",
        "extraLarge": "XL",
        "doubleExtraLarge": "XXL"
    };

    return (
        <select
            className="form-select"
            aria-label="size-select"
            value={selectedSize}
            required
            onChange={(event) => setSelectedSize(event.target.value)}
        >
            <option value={""}>Select Size</option>
            {
                Object.keys(sizes).map(size => {
                    return itemStyle[size] ?
                        <option value={size} key={size}>{sizes[size]}</option> :
                        <option value={size} key={size} disabled>{sizes[size]} Out of Stock</option>
                })
            }
        </select>
    );
};

export default SizeSelect;