const express = require("express");
const router = express.Router();
const { requireUser, requireAdmin } = require("./utils");
const { createItemColorSize, getItemColorSizesByItemColorId } = require("../db/itemColorSizes");

// POST /api/itemColorSizes
router.post("/", requireUser, requireAdmin, async (req, res) => {
    try {
        const itemColorSize = await createItemColorSize(req.body);
        if (itemColorSize) {
            res.send({
                success: true,
                itemColorSize
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.error(error);
    };
});

// GET /api/itemColorSizes/:itemColorId
router.get("/:itemColorId", async (req, res) => {
    const { itemColorId } = req.params;;
    try {
        const itemColorSizes = await getItemColorSizesByItemColorId(itemColorId);
        if (itemColorSizes) {
            res.send({
                success: true,
                itemColorSizes
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;