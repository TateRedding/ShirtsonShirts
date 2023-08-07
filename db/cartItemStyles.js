const client = require('./client');

const createCartItemStyle = async ({ cartId, itemStyleId, quantity, size }) => {
    try {
        const { rows: [cartItemStyle] } = await client.query(`
            INSERT INTO cart_item_styles("cartId", "itemStyleId", quantity, size)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [cartId, itemStyleId, quantity, size]);
        return cartItemStyle;
    } catch {
        console.error(error);
    };
};

const getCartItem = async ({ cartId, itemId }) => {
    try {
        const query = {
            text: 'SELECT * FROM cart_items WHERE "cartId" = $1 AND "itemId" = $2',
            values: [cartId, itemId]
        };

        const { rows } = await client.query(query);
        return rows[0];
    } catch (error) {
        console.error(error);
    };
};

const getCartItemById = async (id) => {
    try {
        const query = {
            text: 'SELECT * FROM cart_items WHERE id = $1',
            values: [id]
        };

        const { rows } = await client.query(query);
        return rows[0];
    } catch (error) {
        console.error(error);
    };
};

const getCartItemsByCartId = async (cartId) => {
    try {
        const { rows: cartItems } = await client.query(`
      SELECT cart_items.id AS "cartItemId", cart_items."cartId", cart_items."itemId", cart_items.quantity, items.name, items.size, items."imageURL", items.price
      FROM cart_items
      JOIN items
        ON cart_items."itemId"=items.id
      WHERE cart_items."cartId"=${cartId};
    `);
        return cartItems;
    } catch (error) {
        console.error(error);
    };
};

const getCartItemsByItemId = async (itemId) => {
    try {
        const query = {
            text: `SELECT * FROM cart_items WHERE "itemId" = $1`,
            values: [itemId]
        };
        const { rows } = await client.query(query);
        return rows;
    } catch (error) {
        console.log(error);
    };
};

const updateCartItem = async (id, quantity) => {
    try {
        const query = {
            text: 'UPDATE cart_items SET quantity=($1) WHERE id=($2) RETURNING *;',
            values: [quantity, id]
        };

        const { rows } = await client.query(query);
        return rows[0];
    } catch (error) {
        console.error(error);
    };
};

const destroyCartItem = async (id) => {
    try {
        const query = {
            text: 'DELETE FROM cart_items WHERE id=($1) RETURNING *;',
            values: [id]
        };

        const { rows } = await client.query(query);
        return rows[0];
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createCartItemStyle,
    getCartItem,
    getCartItemById,
    getCartItemsByCartId,
    getCartItemsByItemId,
    updateCartItem,
    destroyCartItem
};