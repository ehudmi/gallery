const { db } = require("config/heroku-gallery-local");

const _readDb = (table, data, criteria) => {
  return db(table).select(data).where(criteria);
};

const _readDbNotNull = (table, data, criteria) => {
  return db(table).select(data).whereNotNull(criteria);
};

const _readDb_Limited = (table, data, criteria, limit, offset) => {
  return db(table).select(data).where(criteria).limit(limit).offset(offset);
};

const _insertDb = (table, inputData) => {
  return db(table).insert(inputData).returning("*");
};

const _updateDb = (table, updatedData, criteria) => {
  return db(table).update(updatedData).where(criteria).returning("*");
};

module.exports = {
  _readDb,
  _insertDb,
  _updateDb,
  _readDb_Limited,
  _readDbNotNull,
};
