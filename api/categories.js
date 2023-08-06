const express = require("express");
const { requireUser, requireAdmin } = require("./utils");
const router = express.Router();
const { getAllCategories, createCategory, getCategoryByName } = require("../db/categories");

// POST /api/categories
router.post("/", requireUser, requireAdmin, async (req, res) => {
    try {
        const category = await createCategory(req.body.name);
        if (category) {
            res.send({
                success: true,
                category
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.error(error);
    };
});

// GET /api/categories
router.get("/", async (req, res) => {
    try {
        const categories = await getAllCategories();
        if (categories) {
            res.send({
                success: true,
                categories
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.error(error);
    };
});

// GET /api/categories/:name
router.get("/:name", async (req, res) => {
    const { name } = req.params;
    try {
        const category = await getCategoryByName(name);
        if (category) {
            res.send({
                success: true,
                category,
            });
        } else {
            res.send({
                success: false,
                error: "CategoryDoesNotExist",
                message: `The category \"${name}\" does not exist!`
            });
        };
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;