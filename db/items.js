const client = require("./client");

const createItem = async ({
  name,
  price,
  categoryId,
  description,
  imageURL
}) => {
  const query = {
    text: 'INSERT INTO items(name, price, "categoryId", description, "imageURL") VALUES($1, $2, $3, $4, $5) RETURNING *',
    values: [name, price, categoryId, description, imageURL],
  };

  const { rows } = await client.query(query);
  return rows[0];
};

const getAllItems = async () => {
  const query = {
    text: "SELECT * FROM items",
  };

  const { rows } = await client.query(query);
  return rows;
};

const getItemById = async (id) => {
  const query = {
    text: "SELECT * FROM items WHERE id = $1",
    values: [id],
  };

  const { rows } = await client.query(query);
  return rows[0];
};

const getItemsByCategory = async (categoryId) => {
  const query = {
    text: 'SELECT * FROM items WHERE "categoryId" = $1',
    values: [categoryId],
  };

  const { rows } = await client.query(query);
  return rows;
};

const getItemsByName = async (name) => {
  const query = {
    text: "SELECT * FROM items WHERE name ILIKE $1",
    values: [`%${name}%`],
  };

  const { rows } = await client.query(query);
  return rows;
};

const updateItem = async ({
  id,
  name,
  price,
  size,
  categoryId,
  description,
  imageURL
}) => {
  const query = {
    text: 'UPDATE items SET name = $2, price = $3, size = $4, "categoryId" = $5, description = $6, "imageURL" = $7 WHERE id = $1 RETURNING *',
    values: [id, name, price, size, categoryId, description, imageURL],
  };

  const { rows } = await client.query(query);
  return rows[0];
};

const destroyItem = async (id) => {
  const query = {
    text: "DELETE FROM items WHERE id = $1 RETURNING *",
    values: [id],
  };

  const { rows } = await client.query(query);
  return rows[0];
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  getItemsByCategory,
  getItemsByName,
  updateItem,
  destroyItem,
};