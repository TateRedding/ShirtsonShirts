const express = require("express");
const router = express.Router();
const { requireUser } = require('./utils');
const {
    createCartItemStyleSize,
    getCartItemStyleSizeByCartIdAndItemStyleSizeId,
    getCartItemStyleSizeById,
    updateCartItemStyleSize,
    destroyCartItemStyleSize } = require("../db/cartItemStyleSizes");
const { getCartById, getCurrentCart, createCart } = require('../db/carts');

// POST /api/cartItemStyleSizes
router.post('/', requireUser, async (req, res) => {
    const { itemStyleSizeId, quantity } = req.body;
    try {
        let currentCart = await getCurrentCart(req.user.id);
        if (!currentCart) {
            currentCart = await createCart(req.user.id);
        };

        const _cartItemStyleSize = await getCartItemStyleSizeByCartIdAndItemStyleSizeId(currentCart.id, itemStyleSizeId);
        if (_cartItemStyleSize) {
            res.send({
                success: false,
                error: "ItemAlreadyInCart",
                message: "That item is already in your cart!"
            });
        } else {
            const cartItemStyleSize = await createCartItemStyleSize({
                cartId: currentCart.id,
                itemStyleSizeId,
                quantity
            });
            if (cartItemStyleSize) {
                res.send({
                    success: true,
                    cartItemStyleSize
                });
            };
        };
    } catch (error) {
        console.error(error);
    };
});

// PATCH /api/cartItemStyleSizes/:cartItemStyleSizeId
router.patch('/:cartItemStyleSizeId', requireUser, async (req, res) => {
    const { cartItemStyleSizeId } = req.params;
    const { quantity } = req.body;
    try {
        const cartItemStyleSize = await getCartItemStyleSizeById(cartItemStyleSizeId);
        if (cartItemStyleSize) {
            const cart = await getCartById(cartItemStyleSize.cartId);
            if (cart.userId === req.user.id) {
                if (cart.isPurchased) {
                    res.send({
                        success: false,
                        error: "CartAlreadyPurchased",
                        message: "You can not update an item from a previous order!"
                    });
                } else {
                    const updatedCartItemStyleSize = await updateCartItemStyleSize(cartItemStyleSizeId, quantity);
                    if (updatedCartItemStyleSize) {
                        res.send({
                            success: true,
                            updatedCartItemStyleSize
                        });
                    }
                }
            } else {
                res.send({
                    success: false,
                    error: "UnauthorizedUpdateError",
                    message: "You can not modify an item in a cart that is not yours!"
                });
            };
        } else {
            res.send({
                success: false,
                error: "InvalidCartItemStyleSizeId",
                message: `Can not find a cart_item_style_size with id ${cartItemStyleSizeId}`
            });
        };

    } catch (error) {
        console.error(error);
    };
});

// DELETE /api/cartItemStyleSizes/:cartItemStyleSizeId
router.delete('/:cartItemStyleSizeId', requireUser, async (req, res) => {
    const { cartItemStyleSizeId } = req.params;
    try {
        const cartItemStyleSize = await getCartItemStyleSizeById(cartItemStyleSizeId);
        if (cartItemStyleSize) {
            const cart = await getCartById(cartItemStyleSize.cartId);
            if (cart.userId === req.user.id) {
                if (cart.isPurchased) {
                    res.send({
                        success: false,
                        error: "CartAlreadyPurchased",
                        message: "You can not remove an item from a previous order!"
                    });
                } else {
                    const deletedCartItemStyleSize = await destroyCartItemStyleSize(cartItemStyleSizeId);
                    res.send({
                        success: true,
                        deletedCartItemStyleSize
                    });
                };
            } else {
                res.send({
                    success: false,
                    error: "UnauthorizedDeleteError",
                    message: "You do not have permission to remove this item!"
                });
            };
        } else {
            res.send({
                success: false,
                error: "InvalidCartItemStyleSizeId",
                message: `Can not find a cart_item_style_size with id ${cartItemStyleSizeId}`
            });
        };
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;