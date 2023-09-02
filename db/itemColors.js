const client = require("./client");

const createItemColor = async ({ itemId, colorId, imageURL }) => {
    try {
        const { rows: [itemColor] } = await client.query(`
            INSERT INTO item_colors("itemId", "colorId", "imageURL")
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [itemId, colorId, imageURL]);
        return itemColor;
    } catch (error) {
        console.error(error);
    };
};

const getItemColorsByItemId = async (itemId) => {
    try {
        const { rows: itemColors } = await client.query(`
            SELECT item_colors.*, colors.name
            FROM item_colors
            JOIN colors
                ON item_colors."colorId"=colors.id
            WHERE "itemId"=${itemId};
        `);
        return itemColors;
    } catch (error) {
        console.error(error);
    };
};

const getItemColorByItemIdAndColorId = async (itemId, colorId) => {
    try {
        const { rows: [itemColor] } = await client.query(`
            SELECT *
            FROM item_colors
            WHERE "itemId"=${itemId}
            AND "colorId"=${colorId};
        `);
        return itemColor;
    } catch (error) {
        console.error(error);
    };
};

const updateItemColor = async (id, fields) => {
    const setString = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`).join(", ");
    if (!setString.length) {
        return;
    };
    try {
        const { rows: [itemColor] } = await client.query(`
            UPDATE item_colors
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
        `, Object.values(fields));
        return itemColor;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createItemColor,
    getItemColorsByItemId,
    getItemColorByItemIdAndColorId,
    updateItemColor
};