import React, { useEffect, useState } from "react";

const ItemStyleForm = ({ itemStyle, itemStyles, setItemStyles, index }) => {
    const [name, setName] = useState(itemStyle.name);
    const [imageURL, setImageURL] = useState(itemStyle.imageURL);
    const [itemStylesSizes, setitemStyelSizes] = useState(itemStyle.sizes);

    useEffect(() => {
        const temp = [...itemStyles];
        temp[index] = {
            name: name.toLowerCase(),
            imageURL,
            sizes: itemStylesSizes
        };
        setItemStyles([...temp]);
    }, [name, imageURL, itemStylesSizes]);

    return (
        <div>
            <input
                className="form-control"
                value={name}
                placeholder="Style Name"
                onChange={(event) => setName(event.target.value)}
            />

            <input
                className="form-control"
                value={imageURL}
                onChange={(event) => setImageURL(event.target.value)}
            />
        </div>
    );
};

export default ItemStyleForm;