import React, { useEffect, useState } from "react";
import SizeStockSelector from "../tools/SizeStockSelector";

const ItemColorForm = ({ itemColor, itemColors, setItemColors, index, sizes }) => {
    const [name, setName] = useState(itemColor.name);
    const [imageURL, setImageURL] = useState(itemColor.imageURL);
    const [itemColorSizes, setItemColorSizes] = useState(itemColor.sizes);

    useEffect(() => {
        const temp = [...itemColors];
        temp[index] = {
            name: name.toLowerCase(),
            imageURL,
            sizes: itemColorSizes
        };
        setItemColors([...temp]);
    }, [name, imageURL, itemColorSizes]);

    return (
        <div className="item-color-form me-3 mb-3">
            <div className="mb-3">
                <label htmlFor={`color-name-${index}`}>Color: *</label>
                <input
                    className="form-control"
                    id={`color-name-${index}`}
                    value={name}
                    required
                    onChange={(event) => setName(event.target.value)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor={`color-path-${index}`}>Image Path: *</label>
                <input
                    className="form-control"
                    id={`color-name-${index}`}
                    value={imageURL}
                    onChange={(event) => setImageURL(event.target.value)}
                />
            </div>

            <div className="size-stock-selector">
                {
                    sizes.map((size, idx) => (
                        <SizeStockSelector
                            size={size}
                            itemColor={itemColor}
                            itemColorIndex={index}
                            itemColorSizes={itemColorSizes}
                            setItemColorSizes={setItemColorSizes}
                            key={size.id}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default ItemColorForm;