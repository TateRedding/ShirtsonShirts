const client = require("./client");

const createItemColorSize = async ({ itemColorId, sizeId, stock }) => {
    try {
        const { rows: [itemColorSize] } = await client.query(`
            INSERT INTO item_color_sizes("itemColorId", "sizeId", stock)
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [itemColorId, sizeId, stock]);
        return itemColorSize;
    } catch (error) {
        console.error(error);
    };
};

const getItemColorSizesByItemColorId = async (itemColorId) => {
    try {
        const { rows: itemColorSizes } = await client.query(`
            SELECT iss.*, sizes.symbol, sizes.name
            FROM item_color_sizes AS iss
            LEFT JOIN sizes
                ON iss."sizeId"=sizes.id
            WHERE "itemColorId"=${itemColorId};
        `)
        return itemColorSizes;
    } catch (error) {
        console.error(error);
    };
};

const getItemColorSizeByItemColorIdAndSizeId = async (itemColorId, sizeId) => {
    try {
        const { rows: [itemColorSize] } = await client.query(`
            SELECT *
            FROM item_color_sizes
            WHERE "itemColorId"=${itemColorId}
            AND "sizeId"=${sizeId};
        `);
        return itemColorSize;
    } catch (error) {
        console.error(error);
    };
};

const purchaseItemColorSize = async (id, purchaseAmount) => {
    try {
        const { rows: updatedItemColorSize } = await client.query(`
            UPDATE item_color_sizes
            SET stock=stock-${purchaseAmount}
            WHERE id=${id}
        `);
        return updatedItemColorSize;
    } catch (error) {
        console.error(error);
    };
};

const updateItemColorSize = async (id, stock) => {
    try {
        const { rows: updatedItemColorSize } = await client.query(`
            UPDATE item_color_sizes
            SET stock=${stock}
            WHERE id=${id}
        `);
        return updatedItemColorSize;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createItemColorSize,
    getItemColorSizesByItemColorId,
    getItemColorSizeByItemColorIdAndSizeId,
    purchaseItemColorSize,
    updateItemColorSize
};