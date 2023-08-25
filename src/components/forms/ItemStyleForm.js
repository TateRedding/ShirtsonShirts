import React, { useEffect, useState } from "react";
import SizeStockSelector from "../tools/SizeStockSelector";

const ItemStyleForm = ({ itemStyle, itemStyles, setItemStyles, index, sizes }) => {
    const [name, setName] = useState(itemStyle.name);
    const [imageURL, setImageURL] = useState(itemStyle.imageURL);
    const [itemStyleSizes, setItemStyleSizes] = useState(itemStyle.sizes);

    useEffect(() => {
        const temp = [...itemStyles];
        temp[index] = {
            name: name.toLowerCase(),
            imageURL,
            sizes: itemStyleSizes
        };
        setItemStyles([...temp]);
    }, [name, imageURL, itemStyleSizes]);

    return (
        <div>
            <input
                className="form-control"
                value={name}
                placeholder="Style Name"
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
                            itemStyle={itemStyle}
                            itemStyleIndex={index}
                            itemStyleSizes={itemStyleSizes}
                            setItemStyleSizes={setItemStyleSizes}
                            key={size.id}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default ItemStyleForm;