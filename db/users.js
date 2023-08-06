const client = require('./client');
const bcrypt = require('bcrypt');

const createUser = async ({ username, password, isAdmin }) => {
    try {
        password = await bcrypt.hash(password, 10);
        const { rows: [user] } = await client.query(`
            INSERT INTO users(username, password, "isAdmin")
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [username, password, isAdmin]);
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
    getUser
};