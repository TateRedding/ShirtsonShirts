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

module.exports = {
    createItemStyle
};