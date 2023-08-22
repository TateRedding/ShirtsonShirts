const express = require("express");
const router = express.Router();
const { requireUser, requireAdmin } = require("./utils");
const { createItemStyle, updateItemStyle } = require("../db/itemStyles");

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

// PATCH /api/itemStyles/:id
router.patch("/:id", requireUser, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const updatedItemStyle = await updateItemStyle(id, req.body);
        if (updatedItemStyle) {
            res.send({
                success: true,
                updatedItemStyle
            });
        } else {
            res.send({ success: false })
        };
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;