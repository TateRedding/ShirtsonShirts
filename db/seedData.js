const client = require("./client");
const { createUser } = require("./users");
const { createCategory } = require("./categories");
const { createItem } = require("./items");
const { createStyle } = require("./styles");
const { createItemStyle } = require("./itemStyles");
const { createSize } = require("./sizes");
const { createCart, purchaseCart } = require("./carts");
const { createCartItemStyle } = require("./cartItemStyles");

const dropTables = async () => {
    try {
        console.log("Dropping tables...");
        await client.query(`
            DROP TABLE IF EXISTS cart_item_style_sizes;
            DROP TABLE IF EXISTS cart_item_styles;
            DROP TABLE IF EXISTS carts;
            DROP TABLE IF EXISTS item_style_sizes;
            DROP TABLE IF EXISTS sizes;
            DROP TABLE IF EXISTS item_styles;
            DROP TABLE IF EXISTS styles;
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

            CREATE TABLE styles (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL
            );

            CREATE TABLE item_styles (
                id SERIAL PRIMARY KEY,
                "itemId" INTEGER REFERENCES items(id),
                "styleId" INTEGER REFERENCES styles(id),
                "imageURL" TEXT NOT NULL,
                "isActive" BOOLEAN DEFAULT true,
                UNIQUE ("itemId", "styleId")
            );

            CREATE TABLE sizes (
                id SERIAL PRIMARY KEY,
                name VARCHAR(32) UNIQUE NOT NULL,
                symbol VARCHAR(4)
            );

            CREATE TABLE item_style_sizes (
                id SERIAL PRIMARY KEY,
                "itemStyleId" INTEGER REFERENCES item_styles(id),
                "sizeId" INTEGER REFERENCES sizes(id),
                stock INTEGER DEFAULT 0,
                UNIQUE ("itemStyleId", "sizeId")
            );

            CREATE TABLE carts (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id),
                "isPurchased" BOOLEAN DEFAULT false,
                "purchaseTime" TIMESTAMPTZ
            );

            CREATE TABLE cart_item_style_sizes (
                id SERIAL PRIMARY KEY,
                "cartId" INTEGER REFERENCES carts(id),
                "itemStyleSizeId" INTEGER REFERENCES item_style_sizes(id),
                quantity INTEGER DEFAULT 0,
                UNIQUE ("cartId", "itemStyleSizeId")
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
            password: "slushies89"
        }));

        users.push(await createUser({
            username: "cdoussan",
            password: "apples45",
            isAdmin: true
        }));

        users.push(await createUser({
            username: "saxelson",
            password: "saxman33"
        }));

        users.push(await createUser({
            username: "cpruna",
            password: "shirtsarethefuture",
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

const createInitialStyles = async () => {
    try {
        console.log("Creating initial styles...");
        const styles = [];

        styles.push(await createStyle("red"));
        styles.push(await createStyle("blue"));
        styles.push(await createStyle("green"));
        styles.push(await createStyle("rainbow"));

        console.log(styles);
        console.log("Finished creating styles!");
    } catch (error) {
        console.log("Error creating initial styles!");
        console.error(error);
    };
};

const createInitialItemStyles = async () => {
    try {
        console.log("Creating initial item_styles...");
        const itemStyles = [];

        itemStyles.push(await createItemStyle({
            itemId: 1,
            styleId: 1,
            imageURL: "./images/red_socataca_tee.png"
        }));

        itemStyles.push(await createItemStyle({
            itemId: 1,
            styleId: 2,
            imageURL: "./images/blue_socataca_tee.png"
        }));

        itemStyles.push(await createItemStyle({
            itemId: 2,
            styleId: 1,
            imageURL: "./images/default_shirt.png"
        }));

        itemStyles.push(await createItemStyle({
            itemId: 2,
            styleId: 3,
            imageURL: "./images/default_shirt.png"
        }));

        itemStyles.push(await createItemStyle({
            itemId: 3,
            styleId: 4,
            imageURL: "./images/default_shirt.png"
        }));

        console.log(itemStyles);
        console.log("Finished creating item_styles!");
    } catch (error) {
        console.log("Error creating initail item_styles!")
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

const createInitialItemStyleSizes = async () => {
    try {
        console.log("Creating initial item_style_sizes...");
        const itemStyleSizes = [];

        itemStyleSizes.push({
            itemStyleId: 1,
            sizeId: 3,
            stock: 4
        });

        itemStyleSizes.push({
            itemStyleId: 1,
            sizeId: 4,
            stock: 3
        });

        itemStyleSizes.push({
            itemStyleId: 2,
            sizeId: 1,
            stock: 6
        });

        itemStyleSizes.push({
            itemStyleId: 2,
            sizeId: 2,
            stock: 5
        });

        itemStyleSizes.push({
            itemStyleId: 3,
            sizeId: 3,
            stock: 8
        });

        itemStyleSizes.push({
            itemStyleId: 3,
            sizeId: 6,
            stock: 2
        });

        itemStyleSizes.push({
            itemStyleId: 4,
            sizeId: 4,
            stock: 9
        });

        itemStyleSizes.push({
            itemStyleId: 4,
            sizeId: 5,
            stock: 1
        });

        itemStyleSizes.push({
            itemStyleId: 5,
            sizeId: 2,
            stock: 8
        });

        itemStyleSizes.push({
            itemStyleId: 5,
            sizeId: 4,
            stock: 3
        });
        
        console.log(itemStyleSizes);
        console.log("Finished creating item_style_sizes!");
    } catch (error) {
        console.log("Error creating initial item_style_sizes!");
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

const createInitialCartItemStyles = async () => {
    try {
        console.log("creating intial cart_item_styles...");
        const cartItemStyles = [];

        cartItemStyles.push(await createCartItemStyle({
            cartId: 1,
            itemStyleId: 1,
            quantity: 5,
            size: "medium"
        }));

        cartItemStyles.push(await createCartItemStyle({
            cartId: 1,
            itemStyleId: 4,
            quantity: 3,
            size: "large"
        }));

        cartItemStyles.push(await createCartItemStyle({
            cartId: 2,
            itemStyleId: 2,
            quantity: 2,
            size: "small"
        }));

        cartItemStyles.push(await createCartItemStyle({
            cartId: 2,
            itemStyleId: 3,
            quantity: 1,
            size: "doubleExtraLarge"
        }));

        cartItemStyles.push(await createCartItemStyle({
            cartId: 3,
            itemStyleId: 5,
            quantity: 1,
            size: "extraLarge"
        }));

        cartItemStyles.push(await createCartItemStyle({
            cartId: 3,
            itemStyleId: 5,
            quantity: 3,
            size: "large"
        }));

        cartItemStyles.push(await createCartItemStyle({
            cartId: 4,
            itemStyleId: 2,
            quantity: 4,
            size: "extraSmall"
        }));

        cartItemStyles.push(await createCartItemStyle({
            cartId: 4,
            itemStyleId: 1,
            quantity: 7,
            size: "small"
        }));

        console.log(cartItemStyles);
        console.log("Finished creating initail cart_item_styles!");
    } catch (error) {
        console.log("Error creating initial cart_item_styles");
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
        await createInitialStyles();
        await createInitialItemStyles();
        await createInitialSizes();
        await createInitialItemStyleSizes();
        // await createInitialCarts();
        // await createInitialCartItemStyles();
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