const client = require("../db/client");

const createStyle = async (name) => {
    try {
        const { rows: [style] } = await client.query(`
            INSERT INTO styles(name)
            VALUES ($1)
            RETURNING *;
        `, [name]);
        return style;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createStyle
};