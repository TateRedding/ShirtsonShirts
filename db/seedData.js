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

const itemColors = [];
const sizes = [];
const itemColorSizes = [];
const carts = [];

const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

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
            name: "Plain Tee",
            price: 25,
            categoryId: 1,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }));

        items.push(await createItem({
            name: "SoCaTaCa Tee",
            price: 35,
            categoryId: 1,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }));

        items.push(await createItem({
            name: "React Tee",
            price: 30,
            categoryId: 1,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }));

        items.push(await createItem({
            name: "Plain Tank",
            price: 20,
            categoryId: 2,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }));

        items.push(await createItem({
            name: "SoCaTaCa Tank",
            price: 25,
            categoryId: 2,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }));

        items.push(await createItem({
            name: "Pride Tank",
            price: 25,
            categoryId: 2,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }));

        items.push(await createItem({
            name: "Plain Long-Sleeve",
            price: 35,
            categoryId: 3,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }));

        items.push(await createItem({
            name: "Aperture Long Sleeve",
            price: 45,
            categoryId: 3,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }));

        items.push(await createItem({
            name: "Pride Long-sleeve",
            price: 45,
            categoryId: 3,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
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

        colors.push(await createColor("white"))
        colors.push(await createColor("red"));
        colors.push(await createColor("green"));
        colors.push(await createColor("blue"));
        colors.push(await createColor("yellow"));
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

        itemColors.push(await createItemColor({
            itemId: 1,
            colorId: 2,
            imageURL: "./images/plain_tee/red.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 1,
            colorId: 3,
            imageURL: "./images/plain_tee/green.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 1,
            colorId: 4,
            imageURL: "./images/plain_tee/blue.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 1,
            colorId: 5,
            imageURL: "./images/plain_tee/yellow.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 2,
            colorId: 2,
            imageURL: "./images/socataca_tee/red.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 2,
            colorId: 3,
            imageURL: "./images/socataca_tee/green.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 2,
            colorId: 4,
            imageURL: "./images/socataca_tee/blue.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 3,
            colorId: 2,
            imageURL: "./images/react_tee/red.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 3,
            colorId: 3,
            imageURL: "./images/react_tee/green.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 3,
            colorId: 4,
            imageURL: "./images/react_tee/blue.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 3,
            colorId: 5,
            imageURL: "./images/react_tee/yellow.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 4,
            colorId: 1,
            imageURL: "./images/plain_tank/white.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 4,
            colorId: 3,
            imageURL: "./images/plain_tank/green.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 4,
            colorId: 5,
            imageURL: "./images/plain_tank/yellow.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 5,
            colorId: 2,
            imageURL: "./images/socataca_tank/red.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 5,
            colorId: 4,
            imageURL: "./images/socataca_tank/blue.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 6,
            colorId: 6,
            imageURL: "./images/rainbow_tank.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 7,
            colorId: 1,
            imageURL: "./images/plain_long_sleeve/white.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 7,
            colorId: 2,
            imageURL: "./images/plain_long_sleeve/red.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 7,
            colorId: 3,
            imageURL: "./images/plain_long_sleeve/green.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 8,
            colorId: 1,
            imageURL: "./images/aperture_long_sleeve/white.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 8,
            colorId: 2,
            imageURL: "./images/aperture_long_sleeve/red.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 8,
            colorId: 3,
            imageURL: "./images/aperture_long_sleeve/green.png"
        }));

        itemColors.push(await createItemColor({
            itemId: 9,
            colorId: 6,
            imageURL: "./images/rainbow_long_sleeve.png"
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

        const sizeIds = [...sizes.map(size => size.id)];

        for (let i = 0; i < itemColors.length; i++) {
            const numSizes = randomInt(2, 6);
            const possibleSizeIds = [...sizeIds];
            for (let s = 0; s < numSizes; s++) {
                const sizeIndex = randomInt(0, possibleSizeIds.length - 1);
                itemColorSizes.push(await createItemColorSize({
                    itemColorId: itemColors[i].id,
                    sizeId: possibleSizeIds[sizeIndex],
                    stock: randomInt(1, 20)
                }));
                possibleSizeIds.splice(sizeIndex, 1);
            };
        };

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

        const itemColorSizeIds = [...itemColorSizes.map(ics => ics.id)];

        for (let i = 0; i < carts.length; i++) {
            const numCartItems = randomInt(2, 4);
            const possibleItemColorSizeIds = [...itemColorSizeIds];
            for (let j = 0; j < numCartItems; j++) {
                const itemColorSizeIndex = randomInt(0, possibleItemColorSizeIds.length - 1);
                cartItemColorSizes.push(await createCartItemColorSize({
                    cartId: carts[i].id,
                    itemColorSizeId: possibleItemColorSizeIds[itemColorSizeIndex],
                    quantity: randomInt(1, 10)
                }));
                possibleItemColorSizeIds.splice(itemColorSizeIndex, 1);
            };
        };

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