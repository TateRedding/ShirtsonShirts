const client = require('./client');

const createCartItemStyleSize = async ({ cartId, itemStyleSizeId, quantity }) => {
    try {
        const { rows: [cartItemStyleSize] } = await client.query(`
            INSERT INTO cart_item_style_sizes("cartId", "itemStyleSizeId", quantity)
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [cartId, itemStyleSizeId, quantity]);
        return cartItemStyleSize;
    } catch (error) {
        console.error(error);
    };
};

const getCartItemStyleSizeById = async (id) => {
    try {
        const { rows: [cartItemStyleSize] } = await client.query(`
            SELECT *
            FROM cart_item_style_sizes
            WHERE id=${id}
        `);
        return cartItemStyleSize;
    } catch (error) {
        console.error(error);
    };
};

const getCartItemStyleSizeByCartIdAndItemStyleSizeId = async (cartId, itemStyleSizeId) => {
    try {
        const { rows: [cartItemStyleSize] } = await client.query(`
            SELECT *
            FROM cart_item_style_sizes
            WHERE "cartId"=${cartId}
            AND "itemStyleSizeId"=${itemStyleSizeId}
        `);
        return cartItemStyleSize;
    } catch (error) {
        console.error(error);
    };
};

const getCartItemStyleSizesByCartId = async (cartId) => {
    try {
        const { rows: cartItemStyles } = await client.query(`
            SELECT ciss.id AS "cartItemStyleSizeId",
                ciss."cartId", ciss."itemId", ciss.quantity, ciss.size,
                items.name, items.price,
                item_styles."imageURL"
            FROM cart_item_style_sizes AS ciss
            JOIN items_styles_sizes AS iss
                ON ciss."itemStyleSizeId"=iss.id
            JOIN item_styles
                ON iss."itemStyleId"=item_styles.id
            JOIN items
                ON item_styles."itemId"=item.id
            WHERE ciss."cartId"=${cartId};
        `);
        return cartItemStyles;
    } catch (error) {
        console.error(error);
    };
};

const getCartItemStyleSizesByItemStyleSizeId = async (itemStyleSizeId) => {
    try {
        const { rows: cartItemStyleSizes } = await client.query(`
            SELECT ciss.id, ciss."cartId", ciss."itemStyleSizeId",
                carts."isPurchased"
            FROM cart_item_style_sizes AS ciss
            JOIN carts
                ON ciss."cartId"=carts.id
            WHERE ciss."itemStyleSizeId"=${itemStyleSizeId}
        `);
        return cartItemStyleSizes;
    } catch (error) {
        console.error(error);
    };
};

const updateCartItemStyleSize = async (id, quantity) => {
    try {
        const { rows: [cartItemStyleSize] } = await client.query(`
            UPDATE cart_item_style_sizes
            SET quantity=${quantity}
            WHERE id=${id}
            RETURNING *;
        `);
        return cartItemStyleSize;
    } catch (error) {
        console.error(error);
    };
};

const destroyCartItemStyleSize = async (id) => {
    try {
        const { rows: [cartItemStyleSize] } = await client.query(`
            DELETE FROM cart_item_style_sizes
            WHERE id=${id}
            RETURNING *;
        `);
        return cartItemStyleSize;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createCartItemStyleSize,
    getCartItemStyleSizeByCartIdAndItemStyleSizeId,
    getCartItemStyleSizeById,
    getCartItemStyleSizesByCartId,
    getCartItemStyleSizesByItemStyleSizeId,
    updateCartItemStyleSize,
    destroyCartItemStyleSize
};