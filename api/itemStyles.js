const express = require("express");
const router = express.Router();
const { requireUser, requireAdmin } = require("./utils");
const { getItemStyleSizesByItemStyleId } = require("../db/itemStyleSizes");
const { createItemStyle, deactivateItemStyle } = require("../db/itemStyles");
const { getCartItemStyleSizesByItemStyleSizeId, destroyCartItemStyleSize } = require("../db/cartItemStyleSizes");

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
        const itemStyleSizes = await getItemStyleSizesByItemStyleId(id);
        for (let i = 0; i < itemStyleSizes.length; i++) {
            const cartItemStyleSizes = await getCartItemStyleSizesByItemStyleSizeId(itemStyleSizes[i].id);
            for (let j = 0; j < cartItemStyleSizes.length; j++) {
                if (!cartItemStyleSizes[j].isPurchased) destroyCartItemStyleSize(cartItemStyleSizes[j].id);
            };
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