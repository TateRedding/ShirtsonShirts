const express = require("express");
const router = express.Router();
const { requireUser, requireAdmin } = require("./utils");
const { createItemStyleSize, getItemStyleSizesByItemStyleId } = require("../db/itemStyleSizes");

// POST /api/itemStyleSizes
router.post("/", requireUser, requireAdmin, async (req, res) => {
    try {
        const itemStyleSize = await createItemStyleSize(req.body);
        if (itemStyleSize) {
            res.send({
                success: true,
                itemStyleSize
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.error(error);
    };
});

// GET /api/itemStyleSizes/:itemStyleId
router.get("/:itemStyleId", async (req, res) => {
    const { itemStyleId } = req.params;;
    try {
        const itemStyleSizes = await getItemStyleSizesByItemStyleId(itemStyleId);
        if (itemStyleSizes) {
            res.send({
                success: true,
                itemStyleSizes
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;