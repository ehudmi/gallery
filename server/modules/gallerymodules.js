const { db } = require("../connections/heroku-gallery-local");

const readDb = (table, data, criteria, limit, offset) => {
  return db(table).select(data).where(criteria).limit(limit).offset(offset);
};

const insertDb = (table, inputData) => {
  return db(table).insert(inputData).returning("*");
};

const updateDb = (table, updatedData, criteria) => {
  return db(table).update(updatedData).where(criteria).returning("*");
};

module.exports = { readDb, insertDb, updateDb };
