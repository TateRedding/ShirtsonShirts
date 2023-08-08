const express = require("express");
const router = express.Router();
const { requireUser, requireAdmin } = require("./utils");
const {
    createItemStyle,
    deactivateItemStyle
} = require("../db/itemStyles");
const { getCartItemStylesByItemStyleId, destroyCartItemStyle } = require("../db/cartItemStyles");

// POST /api/itemStyles
router.post("/", requireUser, requireAdmin, async (req, res) => {
    try {
        const itemStyle = await createItemStyle(req.body);
        if (itemStyle) {
            res.send({
                success: true,
                itemStyle
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.error(error);
    };
});

// DELETE /api/itemStyles/:id
router.delete("/:id", requireUser, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const cartItemStyles = await getCartItemStylesByItemStyleId(id);
        for (let i = 0; i < cartItemStyles.length; i++) {
            if (!cartItemStyles[i].isPurchased) await destroyCartItemStyle(cartItemStyles[i].id);
        };

        const deactivatedItemStyle = await deactivateItemStyle(id);
        if (deactivatedItemStyle) {
            res.send({
                success: true,
                deactivatedItemStyle
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.error(error);
    };
});