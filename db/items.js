const client = require("./client");
const { getItemColorsByItemId } = require("./itemColors");
const { getItemColorSizesByItemColorId } = require("./itemColorSizes");

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
            SELECT items.*, item_colors."imageURL"
            FROM items
            LEFT JOIN item_colors
                ON item_colors."itemId"=items.id
                AND item_colors."colorId"=(
                    SELECT MIN(item_colors."colorId")
                    FROM item_colors
                    WHERE item_colors."itemId"=items.id
                );
        `);
        return items;
    } catch (error) {
        console.error(error);
    };
};

const getAllActiveItems = async () => {
    try {
        const { rows: items } = await client.query(`
            SELECT items.*, item_colors."imageURL"
            FROM items
            LEFT JOIN item_colors
                ON item_colors."itemId"=items.id
                AND item_colors."colorId"=(
                    SELECT MIN(item_colors."colorId")
                    FROM item_colors
                    WHERE item_colors."itemId"=items.id
                )
            WHERE items."isActive"=true;
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
            item.colors = await getItemColorsByItemId(id);
            if (item.colors) {
                for (let i = 0; i < item.colors.length; i++) {
                    item.colors[i].sizes = await getItemColorSizesByItemColorId(item.colors[i].id);
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
            LEFT JOIN item_colors
                ON item_colors."itemId"=items.id
                AND item_colors."colorId"=(
                    SELECT MIN(item_colors."colorId")
                    FROM item_colors
                    WHERE item_colors."itemId"=items.id
                )
            WHERE "categoryId"=${categoryId};
        `);
        return items;
    } catch (error) {
        console.error(error);
    };
};

const getActiveItemsByCategoryId = async (categoryId) => {
    try {
        const { rows: items } = await client.query(`
            SELECT *
            FROM items
            LEFT JOIN item_colors
                ON item_colors."itemId"=items.id
                AND item_colors."colorId"=(
                    SELECT MIN(item_colors."colorId")
                    FROM item_colors
                    WHERE item_colors."itemId"=items.id
                )
            WHERE "categoryId"=${categoryId}
            AND items."isActive"=true;
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
            item.colors = await getItemColorsByItemId(item.id);
            if (item.colors) {
                for (let i = 0; i < item.colors.length; i++) {
                    item.colors[i].sizes = await getItemColorSizesByItemColorId(item.colors[i].id);
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
    getAllActiveItems,
    getItemById,
    getItemsByCategoryId,
    getActiveItemsByCategoryId,
    getItemByName,
    updateItem,
    deactivateItem
};