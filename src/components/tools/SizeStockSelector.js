import React, { useEffect, useState } from "react";

const SizeStockSelector = ({ size, itemColor, itemColorIndex, itemColorSizes, setItemColorSizes }) => {
    const [selected, setSelected] = useState(false);
    const [stock, setStock] = useState(0);

    useEffect(() => {
        const iss = itemColor.sizes.find(iss => iss.name === size.name);
        if (iss && iss.stock) {
            setSelected(true);
            setStock(iss.stock);
        };
    }, []);

    useEffect(() => {
        const temp = [...itemColorSizes];
        const itemColorSize = temp.find(iss => iss.name === size.name);
        if (itemColorSize) {
            const idx = temp.indexOf(itemColorSize);
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
        setItemColorSizes(temp);
    }, [selected, stock]);

    return (
        <div className="d-flex">
            <div className="size-checkbox">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selected}
                    onChange={(event) => setSelected(event.target.checked)}
                    id={`${size.name}-checkbox-iss-${itemColorIndex}`}
                />
                <label className="form-check-label ms-1 me-3" htmlFor={`${size.name}-checkbox-iss-${itemColorIndex}`}>
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