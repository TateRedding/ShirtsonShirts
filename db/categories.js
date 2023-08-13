const client = require("../db/client");

const createCategory = async (name) => {
    try {
        const { rows: [category] } = await client.query(`
            INSERT INTO categories(name)
            VALUES ($1)
            RETURNING *;
        `, [name]);
        return category;
    } catch (error) {
        console.error(error);
    };
};

const getAllCategories = async () => {
    try {
        const { rows: categories } = await client.query(`
            SELECT *
            FROM categories
        `);
        return categories;
    } catch (error) {
        console.error(error);
    };
};

const getCategoryByName = async (name) => {
    try {
        const { rows: [category] } = await client.query(`
            SELECT *
            FROM categories
            WHERE name=${name};
        `);
        return category;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryByName
};