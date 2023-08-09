const client = require("./client");

const createItemStyle = async (fields) => {
    const keys = Object.keys(fields);
    const valuesString = keys.map((key, index) => `$${index + 1}`).join(", ");
    const columnNames = keys.map((key) => `"${key}"`).join(", ");
    try {
        const { rows: [itemStyle] } = await client.query(`
            INSERT INTO item_styles(${columnNames})
            VALUES (${valuesString})
            RETURNING *;
        `, Object.values(fields));
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