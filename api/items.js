const express = require("express");
const router = express.Router();
const { getStyleByName, createStyle } = require("../db/styles");
const { getSizeByName } = require("../db/sizes");
const { getItemStyleSizesByItemStyleId, createItemStyleSize } = require("../db/itemStyleSizes");
const { getCartItemStyleSizesByItemStyleSizeId, destroyCartItemStyleSize } = require("../db/cartItemStyleSizes");
const { getItemStylesByItemId, createItemStyle } = require("../db/itemStyles");
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
    const { name, categoryId, description, price, styles } = req.body;
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
                        for (let j = 0; j < styles[i].sizes.length; j++) {
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
    // Something to think on when filling this method out:
    // Can functions be optimized or reduced by completely seperating blocks based on weather or not something already exists,
    // or is it better to just keep checking for lower level/ chilod stuff exists, even if the parent was just created and so children would obviously not exist yet
    const { id } = req.params;
    const { name, categoryId, description, price, styles } = req.body;
    try {
        const item = await updateItem(id, { name, categoryId, description, price });
        if (item) {
            const styleErrors = [];
            const itemStyleErrors = [];
            const itemStyleSizeErrors = [];
            for (let i = 0; i < styles.length; i++) {
                //check if style exists
                // if it does
                    //check if itemStyle exists with item id and found styleid
                        //if it does, compare imageURLs, and send update if needed
                        // if it doesnt, create it
                        // get a list of existing ISS using itemStyleId from itemStyle you just updated or created
                        // loop thoough the styles[i].sizes array and for each one
                            //check if iss already exists
                                // if it does, compare stock and update if needed
                                // if it doesn't, create it
                // if it doesn't
                    //create the new style and follow steps to add in all the new itemStyles and iss as well
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