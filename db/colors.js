const client = require("./client");

const createColor = async (name) => {
    try {
        const { rows: [color] } = await client.query(`
            INSERT INTO colors(name)
            VALUES ($1)
            RETURNING *;
        `, [name]);
        return color;
    } catch (error) {
        console.error(error);
    };
};

const getColorByName = async (name) => {
    try {
        const { rows: [color] } = await client.query(`
            SELECT *
            FROM colors
            WHERE name='${name}';
        `);
        return color;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createColor,
    getColorByName
};