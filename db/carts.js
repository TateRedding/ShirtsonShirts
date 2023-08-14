const client = require("./client");
const { getCartItemStyleSizesByCartId } = require("./cartItemStyleSizes");

const createCart = async (userId) => {
    try {
        const { rows: [cart] } = await client.query(`
            INSERT INTO carts("userId")
            VALUES ($1)
            RETURNING *;
        `, [userId]);
        return cart;
    } catch (error) {
        console.error(error);
    };
};

const getCartById = async (id) => {
    try {
        const { rows: [cart] } = await client.query(`
            SELECT *
            FROM carts
            WHERE id=${id};
        `);
        return cart;
    } catch (error) {
        console.error(error);
    };
};

const purchaseCart = async (id) => {
    try {
        const { rows: [cart] } = await client.query(`
            UPDATE carts
            SET "isPurchased"=true, "purchaseTime"=CURRENT_TIMESTAMP
            WHERE id=${id}
            RETURNING *;
        `);
        return cart;
    } catch (error) {
        console.error(error);
    };
};

const getCurrentCart = async (userId) => {
    try {
        const { rows: [cart] } = await client.query(`
            SELECT *
            FROM carts
            WHERE "userId"=${userId}
            AND "isPurchased"=false;
        `);
        if (cart) {
            cart.items = await getCartItemStyleSizesByCartId(cart.id);
            return cart;
        };
    } catch (error) {
        console.error(error);
    };
};

const getPreviousCarts = async (userId) => {
    try {
        const { rows: carts } = await client.query(`
            SELECT *
            FROM carts
            WHERE "userId"=${userId}
            AND "isPurchased"=true
        `);
        if (carts) {
            for (let i = 0; i < carts.length; i++) {
                if (carts[i]) carts[i].items = await getCartItemStyleSizesByCartId(carts[i].id);
            };
            return carts;
        };
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createCart,
    getCartById,
    purchaseCart,
    getCurrentCart,
    getPreviousCarts
};