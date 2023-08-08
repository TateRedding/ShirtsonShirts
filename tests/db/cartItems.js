const client = require('../../db/client');
const { rebuildDB, seedDB } = require('../../db/seedData');
const { getCartItem, getCartItemById, getCartItemsByCartId, updateCartItem, destroyCartItem, getCartItemsByItemId } = require('../../db/cartItems');

// Write tests inside of this function.
const test = async () => {
    console.log('--- RUNNING db/cartItems TESTS ---');
    try {

        console.log('Testing getCartItem');
        let cartItem = await getCartItem({ cartId: 1, itemId: 3});
        if (cartItem && cartItem.id === 1) {
            console.log('passed');
        } else {
            console.log('FAILED');
        };

        console.log('Tetsing getCartItemById');
        cartItem = await getCartItemById(1);
        if (cartItem && cartItem.id === 1) {
            console.log('passed');
        } else {
            console.log('FAILED');
        };

        console.log('Testing getCartItemsByCartId')
        let cartItems = await getCartItemsByCartId(1);
        if (cartItems && cartItems.length === 2 && cartItems[0].name && cartItems[0].size) {
            console.log('passed');
        } else {
            console.log('FAILED');
        };

        console.log('Testing updateCartItem');
        const updatedCartItem = await updateCartItem(1, 100);
        if (updatedCartItem && updatedCartItem.quantity === 100) {
            console.log('passed');
        } else {
            console.log('FINISHED');
        };

        console.log('Testing destroyCartItem');
        const deletedCartItem = await destroyCartItem(updatedCartItem.id);
        if (deletedCartItem && deletedCartItem.id === updatedCartItem.id) {
            console.log('passed');
        } else {
            console.log('FAILED');
        };

        console.log('Testing getCartItemsByItemId');
        cartItems = await getCartItemsByItemId(2);
        if (cartItems && cartItems.length === 2) {
            console.log('passed');
        } else {
            console.log('FAILED');
        };

    } catch (err) {
        console.log('Error runnning tests!', err);
    };
    console.log('--- TESTS FINISHED! ---');
};

rebuildDB()
    .then(seedDB)
    .then(test)
    .catch(console.error)
    .finally(() => client.end());