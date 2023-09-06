import React from "react";

const SizeSelect = ({ itemColor, sizes, selectedSize, setSelectedSize }) => {
    return (
        <div className="order-form-selector mb-3">
            <label className="text-secondary my-2" htmlFor="size-options">
                Size: {selectedSize.symbol ? selectedSize.symbol.toUpperCase() : null}
            </label>
            <div id="size-options" className="d-flex">
                {
                    sizes.length && itemColor.sizes ?
                        sizes.map(size => (
                            itemColor.sizes.find(itemColorSize => itemColorSize.sizeId === size.id && itemColorSize.stock) ?
                                <div
                                    className={`order-form-option size available d-flex align-items-center justify-content-center ${size.id === selectedSize.id ? "selected" : ""}`}
                                    key={size.id}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size.symbol.toUpperCase()}
                                </div>
                                :
                                <div
                                    className={`order-form-option size disabled d-flex align-items-center justify-content-center ${size.id === selectedSize.id ? "selected" : ""}`}
                                    key={size.id}
                                >
                                    {size.symbol.toUpperCase()}
                                </div>
                        ))
                        :
                        null
                }
            </div>
        </div>
    );
};

export default SizeSelect;