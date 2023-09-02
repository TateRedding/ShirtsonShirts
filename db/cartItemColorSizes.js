const client = require('./client');

const createCartItemColorSize = async ({ cartId, itemColorSizeId, quantity }) => {
    try {
        const { rows: [cartItemColorSize] } = await client.query(`
            INSERT INTO cart_item_color_sizes("cartId", "itemColorSizeId", quantity)
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [cartId, itemColorSizeId, quantity]);
        return cartItemColorSize;
    } catch (error) {
        console.error(error);
    };
};

const getCartItemColorSizeById = async (id) => {
    try {
        const { rows: [cartItemColorSize] } = await client.query(`
            SELECT *
            FROM cart_item_color_sizes
            WHERE id=${id}
        `);
        return cartItemColorSize;
    } catch (error) {
        console.error(error);
    };
};

const getCartItemColorSizeByCartIdAndItemColorSizeId = async (cartId, itemColorSizeId) => {
    try {
        const { rows: [cartItemColorSize] } = await client.query(`
            SELECT *
            FROM cart_item_color_sizes
            WHERE "cartId"=${cartId}
            AND "itemColorSizeId"=${itemColorSizeId}
        `);
        return cartItemColorSize;
    } catch (error) {
        console.error(error);
    };
};

const getCartItemColorSizesByCartId = async (cartId) => {
    try {
        const { rows: cartItemColors } = await client.query(`
            SELECT ciss.id AS "cartItemColorSizeId", ciss."cartId", ciss."itemColorSizeId", ciss.quantity,
                iss.stock,
                items.name AS item, items.price,
                sizes.symbol AS size,
                colors.name AS color,
                item_colors."imageURL"
            FROM cart_item_color_sizes AS ciss
            JOIN item_color_sizes AS iss
                ON ciss."itemColorSizeId"=iss.id
            JOIN sizes
                ON iss."sizeId"=sizes.id
            JOIN item_colors
                ON iss."itemColorId"=item_colors.id
            JOIN colors
                ON item_colors."colorId"=colors.id
            JOIN items
                ON item_colors."itemId"=items.id
            WHERE ciss."cartId"=${cartId};
        `);
        return cartItemColors;
    } catch (error) {
        console.error(error);
    };
};

const getCartItemColorSizesByItemColorSizeId = async (itemColorSizeId) => {
    try {
        const { rows: cartItemColorSizes } = await client.query(`
            SELECT ciss.id, ciss."cartId", ciss."itemColorSizeId",
                carts."isPurchased"
            FROM cart_item_color_sizes AS ciss
            JOIN carts
                ON ciss."cartId"=carts.id
            WHERE ciss."itemColorSizeId"=${itemColorSizeId}
        `);
        return cartItemColorSizes;
    } catch (error) {
        console.error(error);
    };
};

const updateCartItemColorSize = async (id, quantity) => {
    try {
        const { rows: [cartItemColorSize] } = await client.query(`
            UPDATE cart_item_color_sizes
            SET quantity=${quantity}
            WHERE id=${id}
            RETURNING *;
        `);
        return cartItemColorSize;
    } catch (error) {
        console.error(error);
    };
};

const destroyCartItemColorSize = async (id) => {
    try {
        const { rows: [cartItemColorSize] } = await client.query(`
            DELETE FROM cart_item_color_sizes
            WHERE id=${id}
            RETURNING *;
        `);
        return cartItemColorSize;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createCartItemColorSize,
    getCartItemColorSizeByCartIdAndItemColorSizeId,
    getCartItemColorSizeById,
    getCartItemColorSizesByCartId,
    getCartItemColorSizesByItemColorSizeId,
    updateCartItemColorSize,
    destroyCartItemColorSize
};