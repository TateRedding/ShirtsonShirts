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
        <div>
            <input
                className="form-control"
                value={name}
                placeholder="Color Name"
                required
                onChange={(event) => setName(event.target.value)}
            />

            <input
                className="form-control"
                value={imageURL}
                onChange={(event) => setImageURL(event.target.value)}
            />

            <div>
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