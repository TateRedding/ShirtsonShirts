const client = require("./client");
const { getItemStylesByItemId } = require("./itemStyles");
const { getItemStyleSizesByItemStyleId } = require("./itemStyleSizes");

const createItem = async ({ name, categoryId, description, price }) => {
    try {
        const { rows: [item] } = await client.query(`
            INSERT INTO items(name, "categoryId", description, price)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [name, categoryId, description, price]);
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
            if (item.styles) {
                for (let i = 0; i < item.styles.length; i++) {
                    item.styles[i].sizes = await getItemStyleSizesByItemStyleId(item.styles[i].id);
                };
            };
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
            LEFT JOIN item_styles
                ON item_styles."itemId"=items.id
                AND item_styles."styleId"=(
                    SELECT MIN(item_styles."styleId")
                    FROM item_styles
                    WHERE item_styles."itemId"=items.id
                );
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
            if (item.styles) {
                for (let i = 0; i < item.styles.length; i++) {
                    item.styles[i].sizes = await getItemStyleSizesByItemStyleId(item.styles[i].id);
                };
            };
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