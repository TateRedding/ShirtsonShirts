import React, { useEffect, useState } from "react";

const SizeStockSelector = ({ size, itemStyleIndex, itemStyleSizes, setItemStyleSizes }) => {
    const [selected, setSelected] = useState(false);
    const [stock, setStock] = useState(0);

    useEffect(() => {
        const temp = [...itemStyleSizes];
        const itemStyleSize = temp.find(iss => iss.name === size.name);
        if (itemStyleSize) {
            const idx = temp.indexOf(itemStyleSize);
            if (selected) {
                temp[idx].stock = Number(stock);
            } else {
                temp[idx].stock = 0;
            };
        } else {
            if (selected) {
                temp.push({
                    name: size.name,
                    stock: Number(stock)
                });
            };
        };
        setItemStyleSizes(temp);
    }, [selected, stock]);

    return (
        <div className="d-flex">
            <div>
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selected}
                    onChange={(event) => setSelected(event.target.checked)}
                    id={`${size.name}-checkbox-iss-${itemStyleIndex}`}
                />
                <label className="form-check-label" htmlFor={`${size.name}-checkbox-iss-${itemStyleIndex}`}>
                    {size.symbol.toUpperCase()}
                </label>
            </div>
            <div>
                <input
                    className="form-control"
                    type="number"
                    value={stock}
                    disabled={!selected}
                    onChange={(event) => setStock(event.target.value)}
                />
            </div>
        </div>
    );
};

export default SizeStockSelector;