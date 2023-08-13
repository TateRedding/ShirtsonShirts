const express = require("express");
const router = express.Router();
const { getStyleByName } = require("../db/styles");
const { getItemStyleSizesByItemStyleId } = require("../db/itemStyleSizes");
const { getCartItemStyleSizesByItemStyleSizeId, destroyCartItemStyleSize } = require("../db/cartItemStyleSizes");
const { getItemStylesByItemId, deactivateItemStyle, createItemStyle } = require("../db/itemStyles");
const {
    createItem,
    getAllItems,
    getItemById,
    getItemByName,
    getItemsByCategoryId,
    updateItem,
    deactivateItem,
} = require("../db/items");
const { requireUser, requireAdmin } = require("./utils");

// POST/api/items
router.post("/", requireUser, requireAdmin, async (req, res) => {
    try {
        const styles = [];
        if (req.body.styles) {
            styles = [...req.body.styles];
            delete req.body.styles;
        };

        const item = await createItem(req.body);
        if (item) {
            const styleErrors = [];
            const itemStyleErrors = [];
            let message = "";
            if (!item.isUnique && styles.length) {
                for (let i = 0; i < styles.length; i++) {
                    const { name } = styles[i];
                    delete styles[i].name;
                    let currentStyle = await getStyleByName(name);
                    if (!currentStyle) currentStyle = await createStyle(name);
                    if (currentStyle) {
                        styles[i].itemId = item.id;
                        styles[i].styleId = currentStyle.id;
                        if (!styles[i].imageURL) styles[i].imageURL = "./images/default_shirt.png";
                        const currentItemStyle = await createItemStyle(styles[i]);
                        if (!currentItemStyle) itemStyleErrors.push(name);
                    } else {
                        styleErrors.push(name);
                    };
                };
                if (styleErrors.length) {
                    message += `Error creating styles ${styleErrors.join(", ")}! `
                } else if (itemStyleErrors.length) {
                    message += `Error adding styles ${itemStyleErrors.join(", ")} to new item!`
                } else {
                    message = "No errors creating and adding styles to item!"
                };
            } else {
                message = "No styles created or added to item."
            };
            res.send({
                success: true,
                message,
                item
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.error(error);
    };
});

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
        const updatedItem = await updateItem(id, req.body);
        if (updatedItem) {
            res.send({
                success: true,
                updatedItem,
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
router.delete("/:id", requireUser, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const itemStyles = await getItemStylesByItemId(id);
        for (let i = 0; i < itemStyles.length; i++) {
            const itemStyleSizes = await getItemStyleSizesByItemStyleId(itemStyles[i].id);
            for (let j = 0; j < itemStyleSizes.length; j++) {
                const cartItemStyleSizes = await getCartItemStyleSizesByItemStyleSizeId(itemStyleSizes[j].id);
                for (let k = 0; k < cartItemStyleSizes.length; k++) {
                    if (!cartItemStyleSizes[k].isPurchased) destroyCartItemStyleSize(cartItemStyleSizes[k].id);
                };
            };
            await deactivateItemStyle(itemStyles[i]);
        };

        const deactivatedItem = await deactivateItem(id);
        if (deactivatedItem) {
            res.send({
                success: true,
                deactivatedItem,
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;