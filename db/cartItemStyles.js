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

const getCartItemStyleByCartIdAndItemStyleId = async (cartId, itemStyleId) => {
    try {
        const { rows: [cartItemStyle] } = await client.query(`
            SELECT *
            FROM cart_item_styles
            WHERE "cartId"=${cartId}
            AND "itemStyleId"=${itemStyleId};
        `);
        return cartItemStyle;
    } catch (error) {
        console.error(error);
    };
};

const getCartItemStyleById = async (id) => {
    try {
        const { rows: [cartItemStyle] } = await client.query(`
            SELECT *
            FROM cart_item_styles
            WHERE id=${id}
        `);
        return cartItemStyle;
    } catch (error) {
        console.error(error);
    };
};

const getCartItemStylesByCartId = async (cartId) => {
    try {
        const { rows: cartItems } = await client.query(`
            SELECT cart_item_styles.id AS "cartItemStyleId",
                cart_item_styles."cartId", cart_item_styles."itemId", cart_item_styles.quantity, cart_item_styles.size,
                items.name, items.price,
                item_styles."imageURL"
            FROM cart_items
            JOIN items
                ON cart_item_styles."itemId"=items.id
            JOIN item_styles
                ON cart_item_styles."itemStyleId"=item_styles.id
            WHERE cart_item_styles."cartId"=${cartId};
        `);
        return cartItems;
    } catch (error) {
        console.error(error);
    };
};

const updateCartItemStyle = async (id, quantity) => {
    try {
        const { rows: [cartItemStyle] } = await client.query(`
            UPDATE cart_item_styles
            SET quantity=${quantity}
            WHERE id=${id}
            RETURNING *;
        `);
        return cartItemStyle;
    } catch (error) {
        console.error(error);
    };
};

const destroyCartItemStyle = async (id) => {
    try {
        const { rows: [cartItemStyle] } = await client.query(`
            DELETE FROM cart_item_styles
            WHERE id=${id}
            RETURNING *;
        `);
        return cartItemStyle;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createCartItemStyle,
    getCartItemStyleByCartIdAndItemStyleId,
    getCartItemStyleById,
    getCartItemStylesByCartId,
    updateCartItemStyle,
    destroyCartItemStyle
};