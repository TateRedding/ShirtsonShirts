const client = require("../db/client");

const createSize = async (name, symbol) => {
    try {
        const { rows: [size] } = await client.query(`
            INSERT INTO sizes(name, symbol)
            VALUES ($1, $2)
            RETURNING *;
        `, [name, symbol]);
        return size;
    } catch (error) {
        console.error(error);
    };
};

const getAllSizes = async () => {
    try {
        const { rows: sizes } = await client.query(`
            SELECT *
            FROM sizes
        `);
        return sizes;
    } catch (error) {
        console.error(error);
    };
};

const getSizeByName = async (name) => {
    try {
        const { rows: [size] } = await client.query(`
            SELECT *
            FROM sizes
            WHERE name='${name}'
        `);
        return size;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createSize,
    getAllSizes,
    getSizeByName
};