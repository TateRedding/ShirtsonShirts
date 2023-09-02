const express = require("express");
const router = express.Router();
const { requireUser, requireAdmin } = require("./utils");
const { createItemColor, updateItemColor } = require("../db/itemColors");

// POST /api/itemColors
router.post("/", requireUser, requireAdmin, async (req, res) => {
    try {
        const itemColor = await createItemColor(req.body);
        if (itemColor) {
            res.send({
                success: true,
                itemColor
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.error(error);
    };
});

// PATCH /api/itemColors/:id
router.patch("/:id", requireUser, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const updatedItemColor = await updateItemColor(id, req.body);
        if (updatedItemColor) {
            res.send({
                success: true,
                updatedItemColor
            });
        } else {
            res.send({ success: false })
        };
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;