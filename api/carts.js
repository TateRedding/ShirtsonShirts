const express = require("express");
const { requireUser } = require("./utils");
const { getCurrentCart, getPreviousCarts, purchaseCart } = require("../db/carts");
const { getCartItemColorSizesByCartId } = require("../db/cartItemColorSizes");
const { purchaseItemColorSize } = require("../db/itemColorSizes");
const router = express.Router();

// GET /api/carts/:userId/current
router.get("/:userId/current", requireUser, async (req, res) => {
    const { userId } = req.params;
    try {
        const cart = await getCurrentCart(userId);
        if (cart) {
            res.send({
                success: true,
                cart,
            });
        } else {
            res.send({
                success: false,
                error: "NoCurrentCart",
                message: "No current cart! Please create a new one.",
            });
        };
    } catch (error) {
        console.error(error);
    };
});

// GET /api/carts/:userId/previous
router.get("/:userId/previous", requireUser, async (req, res) => {
    const { userId } = req.params;
    try {
        const carts = await getPreviousCarts(userId);
        if (carts) {
            res.send({
                success: true,
                carts,
            });
        } else {
            res.send({
                success: false,
                error: "NoPreviousCarts",
                message: "This user does not have any previous orders",
            });
        };
    } catch (error) {
        console.error(error);
    };
});

// PATCH /api/carts/:id
router.patch("/:id", requireUser, async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await purchaseCart(id);
        const stockUpdateErrors = [];
        if (cart) {
            const cartItemColorSizes = await getCartItemColorSizesByCartId(id);
            if (cartItemColorSizes) {
            for (let i = 0; i < cartItemColorSizes.length; i++) {
                const updatedItemColorSize = await purchaseItemColorSize(cartItemColorSizes[i].itemColorSizeId, cartItemColorSizes[i].quantity);
                if (!updatedItemColorSize) stockUpdateErrors.push(cartItemColorSizes[i]);
            };
        };
            res.send({
                success: true,
                cart,
                stockUpdateErrors
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;