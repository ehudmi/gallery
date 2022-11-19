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

const _countRows = (table, data, criteria) => {
  return db(table).count(data).where(criteria);
};

const _insertDb = (table, inputData) => {
  return db(table).insert(inputData).returning("*");
};

const _updateDb = (table, updatedData, criteria) => {
  return db(table).update(updatedData).where(criteria).returning("*");
};

const _getJoinData = (
  table1,
  table2,
  table3,
  column1,
  column2,
  column3,
  column4,
  criteria1
) => {
  return db(table1)
    .join(table2, column1, "=", column2)
    .join(table3, column3, "=", column4)
    .select("*")
    .where(criteria1);
};

module.exports = {
  _readDb,
  _readDbNotNull,
  _readDb_Limited,
  _countRows,
  _insertDb,
  _updateDb,
  _getJoinData,
};
