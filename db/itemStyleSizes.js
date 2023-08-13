const client = require("../db/client");

const createItemStyleSize = async ({ itemStyleId, sizeId, stock }) => {
    try {
        const { rows: [itemStyleSize] } = await client.query(`
            INSERT INTO item_style_sizes("itemStyleId", "sizeId", stock)
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [itemStyleId, sizeId, stock]);
        return itemStyleSize;
    } catch (error) {
        console.error(error);
    };
};

const getItemStyleSizesByItemStyleId = async (itemStyleId) => {
    try {
        const { rows: itemStyleSizes } = await client.query(`
            SELECT *
            FROM item_style_sizes
            WHERE "itemStyleId"=${itemStyleId};
        `)
        return itemStyleSizes;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createItemStyleSize,
    getItemStyleSizesByItemStyleId
};