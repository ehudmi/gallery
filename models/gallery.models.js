const { db } = require("../config/heroku-gallery-local");

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

// const _searchDb = (table, data, criteria1, criteria2) => {
//   return db(table).select(data).where(criteria1).orWhere(criteria2);
// };
const _searchDb = (table, column1, value1, column2) => {
  return db(table).whereILike(column1, value1).orWhereILike(column2, value1);
};

const _searchAuthorsDb = (table, data, criteria1, column1, value1, column2) => {
  return db(table)
    .select(data)
    .where(criteria1)
    .andWhere(function () {
      this.whereILike(column1, value1).orWhereILike(column2, value1);
    });
};

const _insertDb = (table, inputData) => {
  return db(table).insert(inputData).returning("*");
};

const _deleteDb = (table, criteria) => {
  return db(table).where(criteria).del();
};

const _updateDb = (table, updatedData, criteria) => {
  return db(table).update(updatedData).where(criteria).returning("*");
};

const _get2TabJoinData = (table1, table2, column1, column2, criteria1) => {
  return db(table1)
    .join(table2, column1, "=", column2)
    .select("*")
    .where(criteria1);
};

const _get3TabJoinData = (
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
  _searchDb,
  _searchAuthorsDb,
  _insertDb,
  _deleteDb,
  _updateDb,
  _get2TabJoinData,
  _get3TabJoinData,
};
