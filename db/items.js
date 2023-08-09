const client = require("./client");
const { getItemStylesByItemId } = require("./itemStyles");

const createItem = async (fields) => {
    const keys = Object.keys(fields); const valuesString = keys.map((key, index) => `$${index + 1}`).join(", ");
    const columnNames = keys.map((key) => `"${key}"`).join(", ");
    try {
        const { rows: [item] } = await client.query(`
            INSERT INTO items(${columnNames})
            VALUES (${valuesString})
            RETURNING *;
        `, Object.values(fields));
        return item;
    } catch (error) {
        console.error(error);
    };
};

const getAllItems = async () => {
    try {
        const { rows: items } = await client.query(`
            SELECT items.*, item_styles."imageURL"
            FROM items
            LEFT JOIN item_styles
                ON item_styles."itemId"=items.id
                AND item_styles."styleId"=(
                    SELECT MIN(item_styles."styleId")
                    FROM item_styles
                    WHERE item_styles."itemId"=items.id
                );
        `);
        return items;
    } catch (error) {
        console.error(error);
    };
};

const getItemById = async (id) => {
    try {
        const { rows: [item] } = await client.query(`
            SELECT * 
            FROM items 
            WHERE id=${id};
        `);
        if (item) {
            item.styles = await getItemStylesByItemId(id);
            return item;
        };
    } catch (error) {
        console.error(error);
    };
};

const getItemsByCategoryId = async (categoryId) => {
    try {
        const { rows: items } = await client.query(`
            SELECT *
            FROM items
            WHERE "categoryId"=${categoryId};
        `);
        return items;
    } catch (error) {
        console.error(error);
    };
};

const getItemByName = async (name) => {
    try {
        const { rows: [item] } = await client.query(`
            SELECT *
            FROM items
            WHERE name='${name}';
        `);
        if (item) {
            item.styles = await getItemStylesByItemId(item.id);
            return item;
        };
    } catch (error) {
        console.error(error);
    };
};

const updateItem = async (id, fields) => {
    const setString = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`).join(", ");
    if (!setString.length) {
        return;
    };
    try {
        const { rows: [item] } = await client.query(`
            UPDATE items
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
        `, Object.values(fields));
        return item;
    } catch (error) {
        console.error(error);
    };
};

const deactivateItem = async (id) => {
    try {
        const { rows: [item] } = await client.query(`
            UPDATE items
            SET "isActive"=false
            WHERE id=${id}
            RETURNING *;
        `);
        return item;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createItem,
    getAllItems,
    getItemById,
    getItemsByCategoryId,
    getItemByName,
    updateItem,
    deactivateItem
};