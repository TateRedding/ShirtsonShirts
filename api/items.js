const express = require("express");
const router = express.Router();
const { getColorByName, createColor } = require("../db/colors");
const { getSizeByName } = require("../db/sizes");
const {
    getItemColorSizesByItemColorId,
    createItemColorSize,
    getItemColorSizeByItemColorIdAndSizeId,
    updateItemColorSize
} = require("../db/itemColorSizes");
const { getCartItemColorSizesByItemColorSizeId, destroyCartItemColorSize } = require("../db/cartItemColorSizes");
const {
    getItemColorsByItemId,
    createItemColor,
    getItemColorByItemIdAndColorId,
    updateItemColor
} = require("../db/itemColors");
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
const e = require("express");

// POST/api/items
router.post("/", requireUser, requireAdmin, async (req, res) => {
    const { name, categoryId, description, price, colors } = req.body;
    try {
        const item = await createItem({ name, categoryId, description, price });
        if (item) {
            const colorErrors = [];
            const itemColorErrors = [];
            const itemColorSizeErrors = [];
            for (let i = 0; i < colors.length; i++) {
                let color = await getColorByName(colors[i].name);
                if (!color) color = await createColor(colors[i].name);
                if (color) {
                    let imageURL = colors[i].imageURL;
                    if (!imageURL) imageURL = "./images/default_shirt.png";
                    const itemColor = await createItemColor({
                        itemId: item.id,
                        colorId: color.id,
                        imageURL
                    });
                    if (itemColor) {
                        for (let j = 0; j < colors[i].sizes.length; j++) {
                            const size = await getSizeByName(colors[i].sizes[j].name);
                            if (size) {
                                const itemColorSize = await createItemColorSize({
                                    itemColorId: itemColor.id,
                                    sizeId: size.id,
                                    stock: colors[i].sizes[j].stock
                                });
                                if (!itemColorSize) itemColorSizeErrors.push({
                                    item: item.name,
                                    color: color.name,
                                    size: size.name
                                });
                            } else {
                                itemColorSizeErrors.push({
                                    item: item.name,
                                    color: color.name,
                                    size: colors[i].sizes[j].name
                                });
                            };
                        };
                    } else {
                        itemColorErrors.push({
                            item: item.name,
                            color: item.colors[i].name
                        });
                    };
                } else {
                    colorErrors.push(colors[i].name);
                };
            };
            res.send({
                success: true,
                item,
                colorErrors,
                itemColorErrors,
                itemColorSizeErrors
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
    const { name, categoryId, description, price, colors } = req.body;
    try {
        const item = await updateItem(id, { name, categoryId, description, price });
        if (item) {
            const colorErrors = [];
            const itemColorErrors = [];
            const itemColorSizeErrors = [];
            for (let i = 0; i < colors.length; i++) {
                let color = await getColorByName(colors[i].name);
                if (!color) color = await createColor(colors[i].name);
                if (color) {
                    let itemColor = await getItemColorByItemIdAndColorId(item.id, color.id);
                    if (!itemColor) itemColor = await createItemColor({
                        itemId: item.id,
                        colorId: color.id,
                        imageURL: colors[i].imageURL
                    });
                    if (itemColor) {
                        if (!(colors[i].imageURL === itemColor.imageURL)) {
                            const updatedItemColor = await updateItemColor(itemColor.id, { imageURL: colors[i].imageURL });
                            if (!updatedItemColor) itemColorErrors.push({
                                item: item.name,
                                color: item.colors[i].name
                            });
                        };
                        for (let j = 0; j < colors[i].sizes.length; j++) {
                            const size = await getSizeByName(colors[i].sizes[j].name);
                            if (size) {
                                let itemColorSize = await getItemColorSizeByItemColorIdAndSizeId(itemColor.id, size.id);
                                if (!itemColorSize) itemColorSize = await createItemColorSize({
                                    itemColorId: itemColor.id,
                                    sizeId: size.id,
                                    stock: colors[i].sizes[j].stock
                                });
                                if (!(colors[i].sizes[j].stock === itemColorSize.stock)) {
                                    const updatedItemColorSize = await updateItemColorSize(itemColorSize.id, colors[i].sizes[j].stock);
                                    if (!updatedItemColorSize) itemColorSizeErrors.push({
                                        item: item.name,
                                        color: color.name,
                                        size: colors[i].sizes[j].name
                                    });
                                };
                            } else {
                                itemColorSizeErrors.push({
                                    item: item.name,
                                    color: color.name,
                                    size: colors[i].sizes[j].name
                                });
                            };
                        };
                    } else {
                        itemColorErrors.push({
                            item: item.name,
                            color: item.colors[i].name
                        });
                    };
                } else {
                    colorErrors.push(colors[i].name);
                };
            };
            res.send({
                success: true,
                item,
                colorErrors,
                itemColorErrors,
                itemColorSizeErrors
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
        const itemColors = await getItemColorsByItemId(id);
        for (let i = 0; i < itemColors.length; i++) {
            const itemColorSizes = await getItemColorSizesByItemColorId(itemColors[i].id);
            for (let j = 0; j < itemColorSizes.length; j++) {
                const cartItemColorSizes = await getCartItemColorSizesByItemColorSizeId(itemColorSizes[j].id);
                for (let k = 0; k < cartItemColorSizes.length; k++) {
                    if (!cartItemColorSizes[k].isPurchased) destroyCartItemColorSize(cartItemColorSizes[k].id);
                };
            };
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