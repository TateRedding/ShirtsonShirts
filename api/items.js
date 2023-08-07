const express = require("express");
const { destroyCartItem, getCartItemsByItemId } = require("../db/cartItemStyles");
const router = express.Router();
const {
    createItem,
    getAllItems,
    getItemById,
    getItemByName,
    getItemsByCategoryId,
    updateItem,
    destroyItem,
} = require("../db/items");
const { requireUser, requireAdmin } = require("./utils");

// GET /api/items
router.get("/", async (req, res) => {
    try {
        const items = await getAllItems();
        if (items) {
            res.send({
                success: true,
                items,
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.error(error);
    };
});

// POST/api/items
router.post("/", requireUser, requireAdmin, async (req, res) => {
    if (!req.body.imageURL) {
        req.body.imageURL = "./images/default_shirt.png"
    };

    try {
        const item = await createItem(req.body);
        if (item) {
            res.send({
                success: true,
                item,
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.error(error);
    };
});

// GET /api/items/category/:categoryId
router.get("/category/:categoryId", async (req, res) => {
    const { categoryId } = req.params;
    try {
        const items = await getItemsByCategoryId(categoryId);
        if (items) {
            res.send({
                success: true,
                items,
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.error(error);
    };
});

// GET /api/items/:name
router.get("/name/:name", async (req, res) => {
    const { name } = req.params;
    try {
        const item = await getItemByName(name);
        if (item) {
            res.send({
                success: true,
                item,
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.error(error);
    };
});

// PATCH /api/items/:id
router.patch("/:id", requireUser, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const item = await updateItem(id, req.body);
        if (item) {
            res.send({
                success: true,
                item,
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.error(error);
    };
});

// GET /api/items/:id
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const item = await getItemById(id);
        if (item) {
            res.send({
                success: true,
                item,
            });
        } else {
            res.send({ success: false });
        }
    } catch (error) {
        console.error(error);
    }
});

// DELETE /api/items/:id
// NEED TO UPDATE TO MATCH NEW ITEM STYLES AND CART ITEM STYLES STRUCTURE
router.delete("/:id", requireUser, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const cartItems = await getCartItemsByItemId(id);
        for (let i = 0; i < cartItems.length; i++) {
            await destroyCartItem(cartItems[i].id);
        };
        const item = await destroyItem(id);
        if (item) {
            res.send({
                success: true,
                item,
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;