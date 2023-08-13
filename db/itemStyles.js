const client = require("./client");

const createItemStyle = async ({ itemId, styleId, imageURL }) => {
    try {
        const { rows: [itemStyle] } = await client.query(`
            INSERT INTO item_styles("itemId", "styleId", "imageURL")
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [itemId, styleId, imageURL]);
        return itemStyle;
    } catch (error) {
        console.error(error);
    };
};

const getItemStylesByItemId = async (itemId) => {
    try {
        const { rows: itemStyles } = await client.query(`
            SELECT item_styles.*, styles.name
            FROM item_styles
            JOIN styles
                ON item_styles."styleId"=styles.id
            WHERE "itemId"=${itemId};
        `);
        return itemStyles;
    } catch (error) {
        console.error(error);
    };
};

const deactivateItemStyle = async (id) => {
    try {
        const { rows: [itemStyle] } = await client.query(`
            UPDATE item_styles
            SET "isActive"=false
            WHERE id=${id}
            RETURNING *;
        `);
        return itemStyle;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createItemStyle,
    getItemStylesByItemId,
    deactivateItemStyle
};