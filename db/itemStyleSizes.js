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
            SELECT iss.*, sizes.symbol, sizes.name
            FROM item_style_sizes AS iss
            LEFT JOIN sizes
                ON iss."sizeId"=sizes.id
            WHERE "itemStyleId"=${itemStyleId};
        `)
        return itemStyleSizes;
    } catch (error) {
        console.error(error);
    };
};

const updateItemStyleSizeStock = async (id, purchaseAmount) => {
    try {
        const { rows: updatedItemStyleSize } = await client.query(`
            UPDATE item_style_sizes
            SET stock=stock-${purchaseAmount}
            WHERE id=${id}
        `);
        return updatedItemStyleSize;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createItemStyleSize,
    getItemStyleSizesByItemStyleId,
    updateItemStyleSizeStock
};