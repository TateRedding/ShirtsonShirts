import React, { useState } from "react";

const PriceRangeSelect = ({ priceMin, setPriceMin, priceMax, setPriceMax }) => {
    const [showContents, setShowContents] = useState(false);
    return (
        <div className="p-3 border-bottom">
            <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0">PRICE</p>
                <i className="down-chevron bi bi-chevron-down" onClick={() => setShowContents(!showContents)}></i>
            </div>
            {
                showContents ?
                    <div className="d-flex mt-2">
                        <input
                            type="number"
                            className="form-control price-input"
                            value={priceMin}
                            placeholder="Min."
                            onChange={(event) => setPriceMin(event.target.value)}
                        />
                        <input
                            type="number"
                            className="form-control price-input"
                            value={priceMax}
                            placeholder="Max."
                            onChange={(event) => setPriceMax(event.target.value)}
                        />
                    </div>
                    :
                    null
            }
        </div>
    );
};

export default PriceRangeSelect;