const express = require("express");
const router = express.Router();
const { requireUser } = require('./utils');
const {
    createCartItemStyle,
    getCartItemStyleByCartIdAndItemStyleId,
    getCartItemStyleById,
    updateCartItemStyle,
    destroyCartItemStyle } = require("../db/cartItemStyles");
const { getCartById, getCurrentCart, createCart } = require('../db/carts');

// POST /api/cartItemStyles
router.post('/', requireUser, async (req, res) => {
    const { itemStyleId, quantity, size } = req.body;
    try {
        let currentCart = await getCurrentCart(req.user.id);
        if (!currentCart) {
            currentCart = await createCart({ userId: req.user.id });
        };

        const _cartItemStyle = await getCartItemStyleByCartIdAndItemStyleId(currentCart.id, itemStyleId);
        if (_cartItemStyle) {
            res.send({
                success: false,
                error: "CartItemStyleAlreadyExists",
                message: "That item is already in your cart!"
            });
        } else {
            const cartItemStyle = await createCartItemStyle({
                cartId: currentCart.id,
                itemStyleId,
                quantity,
                size
            });
            if (cartItemStyle) {
                res.send({
                    success: true,
                    cartItemStyle
                });
            };
        };
    } catch (error) {
        console.error(error);
    };
});

// PATCH /api/cartItemStyles/:cartItemStyleId
router.patch('/:cartItemStyleId', requireUser, async (req, res) => {
    const { cartItemStyleId } = req.params;
    const { quantity } = req.body;
    try {
        const _cartItemStyle = await getCartItemStyleById(cartItemStyleId);
        if (_cartItemStyle) {
            const cart = await getCartById(_cartItemStyle.cartId);
            if (cart.userId === req.user.id) {
                if (cart.isPurchased) {
                    res.send({
                        success: false,
                        error: "CartAlreadyPurchased",
                        message: "You can not update an item from a previous order!"
                    });
                } else {
                    const cartItemStyle = await updateCartItemStyle(cartItemStyleId, quantity);
                    if (cartItemStyle) {
                        res.send({
                            success: true,
                            cartItemStyle
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
                error: "InvalidCartItemId",
                message: `Can not find a cart item with id ${cartItemId}`
            })
        }

    } catch (error) {
        console.error(error);
    };
});

// DELETE /api/cartItemStyles/:cartItemStyleId
router.delete('/:cartItemStyleId', requireUser, async (req, res) => {
    const { cartItemStyleId } = req.params;
    try {
        const cartItemStyle = await getCartItemById(cartItemStyleId);
        if (cartItemStyle) {
            const cart = await getCartById(cartItemStyle.cartId);
            if (cart.userId === req.user.id) {
                if (cart.isPurchased) {
                    res.send({
                        success: false,
                        error: "CartAlreadyPurchased",
                        message: "You can not remove an item from a previous order!"
                    });
                } else {
                    const deletedCartItemStyle = await destroyCartItemStyle(cartItemStyleId);
                    res.send({
                        success: true,
                        deletedCartItemStyle
                    });
                }
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
                error: "InvalidCartItemStyleId",
                message: `Can not find a cart_item_style with id ${cartItemStyleId}`
            });
        }
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;