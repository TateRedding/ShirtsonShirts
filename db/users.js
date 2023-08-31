const client = require("./client");
const bcrypt = require("bcrypt");

const createUser = async (fields) => {
    if (fields.password) fields.password = await bcrypt.hash(fields.password, 10);
    const keys = Object.keys(fields);
    const valuesString = keys.map((key, index) => `$${index + 1}`).join(', ');
    const columnNames = keys.map((key) => `"${key}"`).join(', ');
    try {
        const { rows: [user] } = await client.query(`
            INSERT INTO users(${columnNames})
            VALUES (${valuesString})
            RETURNING *;
        `, Object.values(fields));
        if (user) {
            delete user.password;
            return user;
        };
    } catch (error) {
        console.error(error);
    };
};

const getUserById = async (userId) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE id=${userId};
        `);
        if (user) {
            delete user.password;
            return user;
        };
    } catch (error) {
        console.error(error);
    };
};

const getUserByUsername = async (username) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE username='${username}';
        `);
        if (user) {
            delete user.password;
            return user;
        };
    } catch (error) {
        console.error(error);
    };
};

const getUserByEmail = async (email) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE email='${email}';
        `);
        if (user) {
            delete user.password;
            return user;
        };
    } catch (error) {
        console.error(error);
    };
};

const getUser = async ({ username, password }) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE username='${username}';
        `);
        if (user && await bcrypt.compare(password, user.password)) {
            delete user.password;
            return user;
        };
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createUser,
    getUserById,
    getUserByUsername,
    getUserByEmail,
    getUser
};