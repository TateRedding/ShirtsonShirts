const client = require("../../db/client");
const app = require("../../app");
const request = require("supertest");
const { rebuildDB, seedDB } = require("../../db/seedData");

// Write tests inside of this function.
const test = async () => {
  console.log("--- RUNNING api/items TESTS ---");
  try {
    let response = null;
    const adminLoginResponse = await request(app)
      .post('/api/users/login')
      .send({
        username: 'cdoussan',
        password: 'apples45'
      });
    const adminToken = adminLoginResponse.body.token;

    const userLoginResponse = await request(app)
      .post('/api/users/login')
      .send({
        username: 'tredding',
        password: 'slushies89'
      });
    const userToken = userLoginResponse.body.token;

    const testGetApiItems = async () => {
      console.log("testing get /api/items");
      response = await request(app).get("/api/items");
      if (response.body.success === true && response.body.items.length === 5) {
        console.log("passed");
      } else {
        console.log("FAILED");
      }
    };
    const testPostApiItems = async () => {
      console.log("testing post /api/items");
      response = await request(app).post("/api/items").set('Authorization', `Bearer ${adminToken}`).send({
        name: "newitem",
        price: 0,
        size: "XXXXL",
        categoryId: 1,
        description: "shirt",
        imageURL: 'image.png'
      });
      if (
        response.body.success === true &&
        response.body.item.name === "newitem"
      ) {
        console.log("passed");
      } else {
        console.log("FAILED");
      }
    };
    const testPatchApiItems = async () => {
      console.log("testing patch /api/items");
      response = await request(app).patch("/api/items/1").set('Authorization', `Bearer ${adminToken}`).send({
        name: "newitem2",
        price: 0,
        size: "XXXXL",
        categoryId: 1,
        description: "shirt",
        imageURL: 'image.png'
      });
      if (
        response.body.success === true &&
        response.body.item.name === "newitem2"
      ) {
        console.log("passed");
      } else {
        console.log("FAILED");
      }
    };
    const testGetApiItemsItemid = async () => {
      console.log("testing get /api/items/:itemid");
      response = await request(app).get("/api/items/1");
      if (response.body.success === true && response.body.item.id === 1) {
        console.log("passed");
      } else {
        console.log("FAILED");
      }
    };
    const testDeleteApiItemsItemid = async () => {
      console.log("testing delete /api/items/:itemid");
      response = await request(app).delete("/api/items/1").set('Authorization', `Bearer ${adminToken}`);
      if (response.body.success === true && response.body.item.id === 1) {
        console.log("passed");
      } else {
        console.log("FAILED");
      }
    };
    const testGetApiItemsCategory = async () => {
      response = await request(app).get("/api/items/category/1");
      if (response.body.success === true && response.body.items.length === 3) {
        console.log("passed");
      } else {
        console.log("FAILED");
      }
    };
    const testGetApiItemsName = async () => {
      console.log("testing get /api/items/name/:itemname");
      response = await request(app).get("/api/items/name/Red%20SoCaTaCa%20Tee");
      if (response.body.success === true && response.body.items.length === 2) {
        console.log("passed");
      } else {
        console.log("FAILED");
      }
    };

    await testGetApiItems();
    await testPostApiItems();
    await testPatchApiItems();
    await testGetApiItemsItemid();
    await testGetApiItemsCategory();
    await testDeleteApiItemsItemid();
    await testGetApiItemsName();
  } catch (err) {
    console.log("Error runnning tests!", err);
  }
  console.log("--- TESTS FINISHED! ---");
};

rebuildDB()
  .then(seedDB)
  .then(test)
  .catch(console.error)
  .finally(() => client.end());
