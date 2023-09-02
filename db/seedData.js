const client = require("./client");
const { createUser } = require("./users");
const { createCategory } = require("./categories");
const { createItem } = require("./items");
const { createColor } = require("./colors");
const { createItemColor } = require("./itemColors");
const { createSize } = require("./sizes");
const { createItemColorSize } = require("./itemColorSizes");
const { createCart, purchaseCart } = require("./carts");
const { createCartItemColorSize } = require("./cartItemColorSizes");

const dropTables = async () => {
    try {
        console.log("Dropping tables...");
        await client.query(`
            DROP TABLE IF EXISTS cart_item_color_sizes;
            DROP TABLE IF EXISTS cart_item_colors;
            DROP TABLE IF EXISTS carts;
            DROP TABLE IF EXISTS item_color_sizes;
            DROP TABLE IF EXISTS sizes;
            DROP TABLE IF EXISTS item_colors;
            DROP TABLE IF EXISTS colors;
            DROP TABLE IF EXISTS items;
            DROP TABLE IF EXISTS categories;
            DROP TABLE IF EXISTS users;
        `);
        console.log("Finished dropping tables.");
    } catch (error) {
        console.log("Error dropping tables!");
        console.error(error);
    };
};

const createTables = async () => {
    try {
        console.log("Creating tables...");
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                "firstName" VARCHAR(64) NOT NULL,
                "lastName" VARCHAR(64),
                email VARCHAR(128) NOT NULL,
                "isAdmin" BOOLEAN DEFAULT FALSE
            );

            CREATE TABLE categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL
            );

            CREATE TABLE items (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                "categoryId" INTEGER REFERENCES categories(id),
                description TEXT NOT NULL,
                price INTEGER NOT NULL,
                "isActive" BOOLEAN DEFAULT true
            );

            CREATE TABLE colors (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL
            );

            CREATE TABLE item_colors (
                id SERIAL PRIMARY KEY,
                "itemId" INTEGER REFERENCES items(id),
                "colorId" INTEGER REFERENCES colors(id),
                "imageURL" TEXT NOT NULL,
                UNIQUE ("itemId", "colorId")
            );

            CREATE TABLE sizes (
                id SERIAL PRIMARY KEY,
                name VARCHAR(32) UNIQUE NOT NULL,
                symbol VARCHAR(4)
            );

            CREATE TABLE item_color_sizes (
                id SERIAL PRIMARY KEY,
                "itemColorId" INTEGER REFERENCES item_colors(id),
                "sizeId" INTEGER REFERENCES sizes(id),
                stock INTEGER DEFAULT 0,
                UNIQUE ("itemColorId", "sizeId")
            );

            CREATE TABLE carts (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id),
                "isPurchased" BOOLEAN DEFAULT false,
                "purchaseTime" TIMESTAMPTZ
            );

            CREATE TABLE cart_item_color_sizes (
                id SERIAL PRIMARY KEY,
                "cartId" INTEGER REFERENCES carts(id),
                "itemColorSizeId" INTEGER REFERENCES item_color_sizes(id),
                quantity INTEGER DEFAULT 0,
                UNIQUE ("cartId", "itemColorSizeId")
            );
        `);
        console.log("Finished creating tables!");
    } catch (error) {
        console.log("Error creating tables!");
        console.error(error);
    };
};

const createInitialUsers = async () => {
    try {
        console.log("Creating initial users...");
        const users = [];

        users.push(await createUser({
            username: "tredding",
            password: "slushies89",
            firstName: "Tate",
            lastName: "Redding",
            email: "tateredding@gmail.com"
        }));

        users.push(await createUser({
            username: "cdoussan",
            password: "apples45",
            firstName: "Cass",
            lastName: "Doussan",
            email: "cdfakeemail@gmail.com",
            isAdmin: true
        }));

        users.push(await createUser({
            username: "saxelson",
            password: "saxman33",
            firstName: "Soren",
            lastName: "Sxelson",
            email: "safakeemail@gmail.com"
        }));

        users.push(await createUser({
            username: "cpruna",
            password: "shirtsarethefuture",
            firstName: "Cara",
            email: "cpfakeemail@gmail.com",
            isAdmin: true
        }));

        console.log(users);
        console.log("Finished creating users!");
    } catch (error) {
        console.log("Error creating users!");
        console.error(error);
    };
};

const createInitialCategories = async () => {
    try {
        console.log("Creating initial categoreis...");
        const categories = [];

        categories.push(await createCategory("tee-shirt"));
        categories.push(await createCategory("tank-top"));
        categories.push(await createCategory("long-sleeve"));

        console.log(categories);
        console.log("Finsihed creating categories!");
    } catch (error) {
        console.log("Error creating initial categories!");
        console.error(error);
    };
};

const createInitialItems = async () => {
    try {
        console.log("Creating initial items...");
        const items = [];

        items.push(await createItem({
            name: "SoCaTaCa Tee",
            price: 500,
            categoryId: 1,
            description: "Cotton blend tee-shirt with the SoCaTaCa team logo"
        }));

        items.push(await createItem({
            name: "Plain Tank",
            price: 300,
            categoryId: 2,
            description: "Cotton blend tank-top"
        }));

        items.push(await createItem({
            name: "Rainbow Long-sleeve",
            price: 500,
            categoryId: 3,
            description: "Cotton blend long-sleeve shirt, perfect for cool weather!",
        }));

        console.log(items);
        console.log("Finished creating items!");
    } catch (error) {
        console.log("Error creating initial items!");
        console.error(error);
    };
};

const createInitialColors = async () => {
    try {
        console.log("Creating initial colors...");
        const colors = [];

        colors.push(await createColor("red"));
        colors.push(await createColor("blue"));
        colors.push(await createColor("green"));
        colors.push(await createColor("rainbow"));

        console.log(colors);
        console.log("Finished creating colors!");
    } catch (error) {
        console.log("Error creating initial colors!");
        console.error(error);
    };
};

const createInitialItemColors = async () => {
    try {
        console.log("Creating initial item_colors...");
        const itemColors = [];

        itemColors.push(await createItemColor({
            itemId: 1,
            colorId: 1,
            imageURL: "./images/red_socataca_tee.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 1,
            colorId: 2,
            imageURL: "./images/blue_socataca_tee.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 2,
            colorId: 1,
            imageURL: "./images/default_shirt.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 2,
            colorId: 3,
            imageURL: "./images/default_shirt.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 3,
            colorId: 4,
            imageURL: "./images/default_shirt.png"
        }));

        console.log(itemColors);
        console.log("Finished creating item_colors!");
    } catch (error) {
        console.log("Error creating initail item_colors!")
        console.error(error);
    };
};

const createInitialSizes = async () => {
    try {
        console.log("Creating initial sizes...");
        const sizes = [];

        sizes.push(await createSize("extraSmall", "xs"));
        sizes.push(await createSize("small", "s"));
        sizes.push(await createSize("medium", "m"));
        sizes.push(await createSize("large", "l"));
        sizes.push(await createSize("extraLarge", "xl"));
        sizes.push(await createSize("doubleExtraLarge", "xxl"));

        console.log(sizes);
        console.log("Finished creating sizes!");
    } catch (error) {
        console.log("Error creating initial sizes!");
        console.error(error);
    };
};

const createInitialItemColorSizes = async () => {
    try {
        console.log("Creating initial item_color_sizes...");
        const itemColorSizes = [];

        itemColorSizes.push(await createItemColorSize({
            itemColorId: 1,
            sizeId: 3,
            stock: 4
        }));

        itemColorSizes.push(await createItemColorSize({
            itemColorId: 1,
            sizeId: 4,
            stock: 3
        }));

        itemColorSizes.push(await createItemColorSize({
            itemColorId: 2,
            sizeId: 1,
            stock: 6
        }));

        itemColorSizes.push(await createItemColorSize({
            itemColorId: 2,
            sizeId: 2,
            stock: 5
        }));

        itemColorSizes.push(await createItemColorSize({
            itemColorId: 3,
            sizeId: 3,
            stock: 8
        }));

        itemColorSizes.push(await createItemColorSize({
            itemColorId: 3,
            sizeId: 6,
            stock: 2
        }));

        itemColorSizes.push(await createItemColorSize({
            itemColorId: 4,
            sizeId: 4,
            stock: 9
        }));

        itemColorSizes.push(await createItemColorSize({
            itemColorId: 4,
            sizeId: 5,
            stock: 1
        }));

        itemColorSizes.push(await createItemColorSize({
            itemColorId: 5,
            sizeId: 2,
            stock: 8
        }));

        itemColorSizes.push(await createItemColorSize({
            itemColorId: 5,
            sizeId: 4,
            stock: 3
        }));
        
        console.log(itemColorSizes);
        console.log("Finished creating item_color_sizes!");
    } catch (error) {
        console.log("Error creating initial item_color_sizes!");
        console.error(error);
    };
};

const createInitialCarts = async () => {
    try {
        console.log("Creating initial carts...");
        const carts = [];

        await createCart(1);
        carts.push(await purchaseCart(1));
        carts.push(await createCart(2));
        await createCart(3);
        carts.push(await purchaseCart(3));
        carts.push(await createCart(4));

        console.log(carts);
        console.log("Finsihed creating carts!");
    } catch (error) {
        console.log("Error creating initial carts!");
        console.error(error);
    };
};

const createInitialCartItemColorSizes = async () => {
    try {
        console.log("Creating intial cart_item_color_sizes...");
        const cartItemColorSizes = [];

        cartItemColorSizes.push(await createCartItemColorSize({
            cartId: 1,
            itemColorSizeId: 1,
            quantity: 5
        }));

        cartItemColorSizes.push(await createCartItemColorSize({
            cartId: 1,
            itemColorSizeId: 4,
            quantity: 3
        }));

        cartItemColorSizes.push(await createCartItemColorSize({
            cartId: 2,
            itemColorSizeId: 8,
            quantity: 1
        }));

        cartItemColorSizes.push(await createCartItemColorSize({
            cartId: 2,
            itemColorSizeId: 9,
            quantity: 4
        }));

        cartItemColorSizes.push(await createCartItemColorSize({
            cartId: 3,
            itemColorSizeId: 5,
            quantity: 1
        }));

        cartItemColorSizes.push(await createCartItemColorSize({
            cartId: 3,
            itemColorSizeId: 7,
            quantity: 3
        }));

        cartItemColorSizes.push(await createCartItemColorSize({
            cartId: 4,
            itemColorSizeId: 2,
            quantity: 3
        }));

        cartItemColorSizes.push(await createCartItemColorSize({
            cartId: 4,
            itemColorSizeId: 6,
            quantity: 2
        }));

        console.log(cartItemColorSizes);
        console.log("Finished creating initail cart_item_color_sizes!");
    } catch (error) {
        console.log("Error creating initial cart_item_color_sizes");
        console.error(error);
    };
};

const rebuildDB = async () => {
    try {
        client.connect();
        await dropTables();
        await createTables();
    } catch (error) {
        console.error(error);
    };
};

const seedDB = async () => {
    try {
        console.log("Seeding databse...");
        await createInitialUsers();
        await createInitialCategories();
        await createInitialItems();
        await createInitialColors();
        await createInitialItemColors();
        await createInitialSizes();
        await createInitialItemColorSizes();
        await createInitialCarts();
        await createInitialCartItemColorSizes();
        console.log("Finished seeding database!");
    } catch (error) {
        console.log("Error seeding databse!");
        console.error(error);
    };
};

module.exports = {
    rebuildDB,
    seedDB
};