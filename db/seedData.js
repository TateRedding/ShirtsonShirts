const client = require("./client");
const { createUser } = require("./users");
const { createCategory } = require("./categories");
const { createStyle } = require("./styles");
const { createItem } = require("./items");
const { createItemStyle } = require("./itemStyles");
const { createCart, purchaseCart } = require("./carts");
const { createCartItem } = require("./cartItems");

const dropTables = async () => {
    try {
        console.log("Dropping tables...");
        await client.query(`
            DROP TABLE IF EXISTS cart_item_styles;
            DROP TABLE IF EXISTS item_styles;
            DROP TABLE IF EXISTS carts;
            DROP TABLE IF EXISTS items;
            DROP TABLE IF EXISTS styles;
            DROP TABLE IF EXISTS categories;
            DROP TABLE IF EXISTS users;
            DROP TYPE IF EXISTS size;
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
            CREATE TYPE size AS ENUM (
                'extraSmall',
                'small',
                'medium',
                'large',
                'extraLarge',
                'doubleExtraLarge'
            );

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
                "imageURL" TEXT NOT NULL,
                price INTEGER NOT NULL
            );

            CREATE TABLE carts (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id),
                "isPurchased" BOOLEAN DEFAULT false,
                "purchaseTime" TIMESTAMPTZ
            );

            CREATE TABLE styles (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL
            );
            
            CREATE OR REPLACE FUNCTION create_item_styles_table() RETURNS VOID AS $$
                DECLARE
                    size_values TEXT[];
                    size TEXT;
                    create_table_sql TEXT :='
                        CREATE TABLE item_styles (
                            id SERIAL PRIMARY KEY,
                            "itemId" INTEGER REFERENCES items(id),
                            "styleId" INTEGER REFERENCES styles(id), 
                    ';
                BEGIN
                    SELECT enum_range(NULL::size) INTO size_values;
                    FOREACH size IN ARRAY size_values LOOP
                        create_table_sql := create_table_sql || '"' || size || '"' || ' INTEGER DEFAULT 0, ';
                    END LOOP;
                    create_table_sql := create_table_sql || ' UNIQUE ("itemId", "styleId"));';
                    EXECUTE create_table_sql;
                END;
            $$ LANGUAGE plpgsql;

            SELECT create_item_styles_table();

            CREATE TABLE cart_item_styles (
                id SERIAL PRIMARY KEY,
                "cartId" INTEGER REFERENCES carts(id),
                "itemStyleId" INTEGER REFERENCES item_styles(id),
                quantity INTEGER DEFAULT 0,
                size size NOT NULL
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
            isAdmin: false
        }));

        users.push(await createUser({
            username: "cdoussan",
            password: "apples45",
            isAdmin: true
        }));

        users.push(await createUser({
            username: "saxelson",
            password: "saxman33",
            isAdmin: false
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

const createInitialStyles = async () => {
    try {
        console.log("Creating initial styles...");
        const styles = [];

        styles.push(await createStyle("red"));
        styles.push(await createStyle("blue"));
        styles.push(await createStyle("green"));

        console.log(styles);
        console.log("Finished creating styles!");
    } catch (error) {
        console.log("Error creating initial styles!");
        console.error(error);
    };
};

const createInitialItems = async () => {
    try {
        console.log("Creating initial items...");
        const items = [];

        items.push(await createItem({
            name: "SoCaTaCa Tee",
            price: "500",
            categoryId: 1,
            description: "Cotton blend tee-shirt with the SoCaTaCa team logo",
            imageURL: "./images/red_socataca_tee.png"
        }));

        items.push(await createItem({
            name: "Plain Tank",
            price: "300",
            categoryId: 2,
            description: "Cotton blend tank-top",
            imageURL: "./images/default_shirt.png"
        }));

        items.push(await createItem({
            name: "Plain Long-sleeve",
            price: "500",
            categoryId: 3,
            description: "Cotton blend long-sleeve shirt, perfect for cool weather!",
            imageURL: "./images/default_shirt.png"
        }));

        console.log(items);
        console.log("Finished creating items!");
    } catch (error) {
        console.log("Error creating initial items!");
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
            small: 5,
            medium: 15,
            large: 10
        }));

        itemStyles.push(await createItemStyle({
            itemId: 1,
            styleId: 2,
            extraSmall: 3,
            small: 6,
            medium: 10,
            large: 12
        }));

        itemStyles.push(await createItemStyle({
            itemId: 2,
            styleId: 1,
            extraSmall: 2,
            small: 3,
            medium: 13,
            large: 6,
            extraLarge: 7,
            doubleExtraLarge: 2
        }));

        itemStyles.push(await createItemStyle({
            itemId: 2,
            styleId: 3,
            extraSmall: 4,
            small: 1,
            medium: 9,
            large: 5,
            extraLarge: 8
        }));

        itemStyles.push(await createItemStyle({
            itemId: 3,
            styleId: 2,
            medium: 16,
            large: 16,
            extraLarge: 11
        }));

        itemStyles.push(await createItemStyle({
            itemId: 3,
            styleId: 3
        }));

        console.log(itemStyles);
        console.log("Finished creating item_styles!");
    } catch (error) {
        console.log("Error creating initail item_styles!")
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
        await createInitialStyles();
        await createInitialItems();
        await createInitialItemStyles();
        await createInitialCarts();
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