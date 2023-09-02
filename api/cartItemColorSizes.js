const express = require("express");
const router = express.Router();
const { requireUser } = require('./utils');
const {
    createCartItemColorSize,
    getCartItemColorSizeByCartIdAndItemColorSizeId,
    getCartItemColorSizeById,
    updateCartItemColorSize,
    destroyCartItemColorSize } = require("../db/cartItemColorSizes");
const { getCartById, getCurrentCart, createCart } = require('../db/carts');

// POST /api/cartItemColorSizes
router.post('/', requireUser, async (req, res) => {
    const { itemColorSizeId, quantity } = req.body;
    try {
        let currentCart = await getCurrentCart(req.user.id);
        if (!currentCart) {
            currentCart = await createCart(req.user.id);
        };

        const _cartItemColorSize = await getCartItemColorSizeByCartIdAndItemColorSizeId(currentCart.id, itemColorSizeId);
        if (_cartItemColorSize) {
            res.send({
                success: false,
                error: "ItemAlreadyInCart",
                message: "That item is already in your cart!"
            });
        } else {
            const cartItemColorSize = await createCartItemColorSize({
                cartId: currentCart.id,
                itemColorSizeId,
                quantity
            });
            if (cartItemColorSize) {
                res.send({
                    success: true,
                    cartItemColorSize
                });
            };
        };
    } catch (error) {
        console.error(error);
    };
});

// PATCH /api/cartItemColorSizes/:cartItemColorSizeId
router.patch('/:cartItemColorSizeId', requireUser, async (req, res) => {
    const { cartItemColorSizeId } = req.params;
    const { quantity } = req.body;
    try {
        const cartItemColorSize = await getCartItemColorSizeById(cartItemColorSizeId);
        if (cartItemColorSize) {
            const cart = await getCartById(cartItemColorSize.cartId);
            if (cart.userId === req.user.id) {
                if (cart.isPurchased) {
                    res.send({
                        success: false,
                        error: "CartAlreadyPurchased",
                        message: "You can not update an item from a previous order!"
                    });
                } else {
                    const updatedCartItemColorSize = await updateCartItemColorSize(cartItemColorSizeId, quantity);
                    if (updatedCartItemColorSize) {
                        res.send({
                            success: true,
                            updatedCartItemColorSize
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
                error: "InvalidCartItemColorSizeId",
                message: `Can not find a cart_item_color_size with id ${cartItemColorSizeId}`
            });
        };

    } catch (error) {
        console.error(error);
    };
});

// DELETE /api/cartItemColorSizes/:cartItemColorSizeId
router.delete('/:cartItemColorSizeId', requireUser, async (req, res) => {
    const { cartItemColorSizeId } = req.params;
    try {
        const cartItemColorSize = await getCartItemColorSizeById(cartItemColorSizeId);
        if (cartItemColorSize) {
            const cart = await getCartById(cartItemColorSize.cartId);
            if (cart.userId === req.user.id) {
                if (cart.isPurchased) {
                    res.send({
                        success: false,
                        error: "CartAlreadyPurchased",
                        message: "You can not remove an item from a previous order!"
                    });
                } else {
                    const deletedCartItemColorSize = await destroyCartItemColorSize(cartItemColorSizeId);
                    res.send({
                        success: true,
                        deletedCartItemColorSize
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
                error: "InvalidCartItemColorSizeId",
                message: `Can not find a cart_item_color_size with id ${cartItemColorSizeId}`
            });
        };
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;