const client = require('./client');
const { createCategory } = require('./categories');
const { createUser } = require('./users');
const { createCart, purchaseCart } = require('./carts');
const { createItem } = require('./items');
const { createCartItem } = require('./cartItems');

const dropTables = async () => {
    try {
        console.log('Dropping tables...');
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
        console.log('Finished dropping tables.');
    } catch (error) {
        console.log('Error dropping tables!');
        console.error(error);
    };
};

const createTables = async () => {
    try {
        console.log('Creating tables...');
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
        `)
        console.log('Finished creating tables!');
    } catch (error) {
        console.log('Error creating tables!');
        console.error(error);
    };

};

const createInitialUsers = async () => {
    try {
        console.log('Creating initial users...');

        const tate = await createUser({
            username: 'tredding',
            password: 'slushies89',
            isAdmin: false
        });

        const cass = await createUser({
            username: 'cdoussan',
            password: 'apples45',
            isAdmin: true
        });

        const soren = await createUser({
            username: 'saxelson',
            password: 'saxman33',
            isAdmin: false
        });

        const caro = await createUser({
            username: 'cpruna',
            password: 'shirtsarethefuture',
            isAdmin: true
        });

        console.log([tate, cass, soren, caro])
        console.log('Finished creating users!');
    } catch (err) {
        console.log('Error creating users!');
        console.log(err);
    }
}

const createInitialCategories = async () => {
    try {
        console.log('Creating initial categoreis...');

        const categoryOne = await createCategory('tee-shirt');
        const categoryTwo = await createCategory('tank-top');
        const categoryThree = await createCategory('long-sleeve');

        console.log([categoryOne, categoryTwo, categoryThree]);

        console.log('Finsihed creating categories!');
    } catch (err) {
        console.log('Error creating initial categories!');
        console.log(err);
    };
};

// const createInitialCarts = async () => {
//     try {
//         console.log('Creating initial carts...');

//         const cartOne = await createCart({ userId: 1 });
//         const cartTwo = await createCart({ userId: 2 });
//         const cartThree = await createCart({ userId: 3 });
//         const cartFour = await createCart({ userId: 4 });

//         console.log([cartOne, cartTwo, cartThree, cartFour]);

//         console.log('Finsihed creating carts!');
//     } catch (err) {
//         console.log('Error creating initial carts!');
//         console.log(err);
//     };
// };

// const updateInitialCarts = async () => {
//     try {
//         console.log('Setting some carts to purchased...');

//         const updatedCartOne = await purchaseCart(1);
//         const updatedCartTwo = await purchaseCart(3);

//         console.log([updatedCartOne, updatedCartTwo]);

//         console.log('Finished updating carts!');
//     } catch (err) {
//         console.log('Error updating carts!');
//         console.log(err);
//     };
// };

const createInitialItems = async () => {
    try {
        console.log('Creating initial items...');

        const itemOne = await createItem({
            name: 'Red SoCaTaCa Tee',
            price: '500',
            categoryId: 1,
            description: 'Red dyed cotton blend tee-shirt with the SoCaTaCa team logo',
            imageURL: './images/red_socataca_tee.png'
        });

        const itemTwo = await createItem({
            name: 'Blue Tank',
            price: '300',
            categoryId: 2,
            description: 'Blue dyed cotton blend tank-top',
            imageURL: './images/default_shirt.png'
        });

        const itemThree = await createItem({
            name: 'Rainbow Long-sleeve',
            price: '500',
            categoryId: 3,
            description: 'Multicolored cotton blend long-sleeve shirt, perfect for cool weather!',
            imageURL: './images/default_shirt.png'
        });

        console.log([itemOne, itemTwo, itemThree ]);

        console.log('Finished creating items!');
    } catch (err) {
        console.log('Error creating initial items!');
        console.log(err);
    };
};

// const createInitialCartItems = async () => {
//     try {
//         console.log('Creating initial cart_items...');

//         const cartItemOne = await createCartItem({
//             cartId: 1,
//             itemId: 3,
//             quantity: 4
//         });

//         const cartItemTwo = await createCartItem({
//             cartId: 1,
//             itemId: 4,
//             quantity: 2
//         });

//         const cartItemThree = await createCartItem({
//             cartId: 2,
//             itemId: 2,
//             quantity: 2
//         });

//         const cartItemFour = await createCartItem({
//             cartId: 2,
//             itemId: 5,
//             quantity: 1
//         });

//         const cartItemFive = await createCartItem({
//             cartId: 3,
//             itemId: 4,
//             quantity: 18
//         });

//         const cartItemSix = await createCartItem({
//             cartId: 3,
//             itemId: 1,
//             quantity: 7
//         });

//         const cartItemSeven = await createCartItem({
//             cartId: 4,
//             itemId: 5,
//             quantity: 3
//         });

//         const cartItemEight = await createCartItem({
//             cartId: 4,
//             itemId: 2,
//             quantity: 3
//         });

//         console.log([
//             cartItemOne,
//             cartItemTwo,
//             cartItemThree,
//             cartItemFour,
//             cartItemFive,
//             cartItemSix,
//             cartItemSeven,
//             cartItemEight
//         ]);

//         console.log('Finished creating cart_items!');
//     } catch (err) {
//         console.log('Error creating cart_items!');
//         console.log(err);
//     };
// };

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
        console.log('Seeding databse...');
        await createInitialCategories();
        await createInitialUsers();
        // await createInitialCarts();
        // await updateInitialCarts();
        await createInitialItems();
        // await createInitialCartItems();
        console.log('Finished seeding database!');
    } catch (error) {
        console.log('Error seeding databse!');
        console.error(error);
    };
};

module.exports = {
    rebuildDB,
    seedDB
};