const express = require("express");
const router = express.Router();
const { getStyleByName, createStyle } = require("../db/styles");
const { getSizeByName } = require("../db/sizes");
const { getItemStyleSizesByItemStyleId, createItemStyleSize } = require("../db/itemStyleSizes");
const { getCartItemStyleSizesByItemStyleSizeId, destroyCartItemStyleSize } = require("../db/cartItemStyleSizes");
const { getItemStylesByItemId, deactivateItemStyle, createItemStyle } = require("../db/itemStyles");
const {
    createItem,
    getAllItems,
    getAllActiveItems,
    getItemById,
    getItemByName,
    getItemsByCategoryId,
    getActiveItemsByCategoryId,
    updateItem,
    deactivateItem
} = require("../db/items");
const { requireUser, requireAdmin } = require("./utils");

// POST/api/items
router.post("/", requireUser, requireAdmin, async (req, res) => {
    const { name, categoryId, description, price } = req.body;
    const { styles } = req.body.styles;
    try {
        const item = await createItem({ name, categoryId, description, price });
        if (item) {
            const styleErrors = [];
            const itemStyleErrors = [];
            const itemStyleSizeErrors = [];
            for (let i = 0; i < styles.length; i++) {
                let style = await getStyleByName(styles[i].name);
                if (!style) style = await createStyle(styles[i].name);
                if (style) {
                    let imageURL = styles[i].imageURL;
                    if (!imageURL) imageURL = "./images/default_shirt.png";
                    const itemStyle = await createItemStyle({
                        itemId: item.id,
                        styleId: style.id,
                        imageURL
                    });
                    if (itemStyle) {
                        for (let j = 0; j < styles[i].sizes; j++) {
                            const size = await getSizeByName(styles[i].sizes[j].name);
                            if (!size) {
                                itemStyleSizeErrors.push({
                                    item: item.name,
                                    style: style.name,
                                    size: styles[i].sizes[j].name
                                });
                            } else {
                                const itemStyleSize = await createItemStyleSize({
                                    itemStyleId: itemStyle.id,
                                    sizeId: size.id,
                                    stock: styles[i].sizes[j].stock
                                });
                                if (!itemStyleSize) itemStyleSizeErrors.push({
                                    item: item.name,
                                    style: style.name,
                                    size: size.name
                                });
                            };
                        };
                    } else {
                        itemStyleErrors.push({
                            item: item.name,
                            style: item.styles[i].name
                        });
                    };
                } else {
                    styleErrors.push(name);
                };
            };
            res.send({
                success: true,
                item,
                styleErrors,
                itemStyleErrors,
                itemStyleSizeErrors
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
        let items;
        if (req.user && req.user.isAdmin) {
            items = await getAllItems();
        } else {
            items = await getAllActiveItems();
        };
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
        let items;
        if (req.user && req.user.isAdmin) {
            items = await getItemsByCategoryId(categoryId);
        } else {
            items = await getActiveItemsByCategoryId(categoryId);
        };
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
            await deactivateItemStyle(itemStyles[i].id);
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