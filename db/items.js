const client = require("./client");

const createItem = async ({
    name,
    price,
    categoryId,
    description,
    imageURL
}) => {
    try {
        const { rows: [item] } = await client.query(`
            INSERT INTO items(name, price, "categoryId", description, "imageURL")
            VALUES($1, $2, $3, $4, $5)
            RETURNING *;
        `, [name, price, categoryId, description, imageURL]);
        return item;
    } catch (error) {
        console.error(error);
    };
};

const getAllItems = async () => {
    try {
        const { rows } = await client.query(`
            SELECT * 
            FROM items;`
        );
        return rows;
    } catch (error) {
        console.error(error);
    };
};

const getItemById = async (id) => {
    try {
        const { rows: [item] } = await client.query(`
            SELECT * 
            FROM items 
            WHERE id = ${id};
        `);
        return item;
    } catch (error) {
        console.error(error);
    };
};

const getItemsByCategoryId = async (categoryId) => {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM items
            WHERE "categoryId" = ${categoryId};
        `);
        return rows;
    } catch (error) {
        console.error(error);
    };
};

const getItemByName = async (name) => {
    try {
        const { rows: [item] } = await client.query(`
            SELECT *
            FROM items
            WHERE name = '${name}';
        `);
        return item;
    } catch (error) {
        console.error(error);
    };
};

const updateItem = async (id, fields) => {
    const setString = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`).join(', ');
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

const destroyItem = async (id) => {
    try {
        const { rows: [item] } = await client.query(`
            DELETE FROM items
            WHERE id = ${id}
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
    destroyItem,
};