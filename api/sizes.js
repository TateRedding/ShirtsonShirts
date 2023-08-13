const express = require("express");
const router = express.Router();
const { getAllSizes } = require("../db/sizes");

// GET /api/sizes
router.get("/", async (req, res) => {
    try {
        const sizes = await getAllSizes();
        if (sizes) {
            res.send({
                success: true,
                sizes
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;