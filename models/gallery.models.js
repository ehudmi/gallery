const { db } = require("../config/heroku-gallery-local");

const _readDbSingleAuthor = (table1, column1, criteria) => {
  return db
    .select("*")
    .from(`${table1} as t1`)
    .join(
      db
        .select(column1)
        .from(`${table1} as t3`)
        .count(`${column1} as count`)
        .groupBy(column1)
        .having("t3.count", "=", 1)
        .as("t2"),
      `t2.${column1}`,
      "=",
      `t1.${column1}`
    )
    .where(criteria);
};

const _readDb = (table, data, column1, operator, value, column2, type) => {
  return db(table)
    .select(data)
    .where(column1, operator, value)
    .orderBy(column2, type);
};

const _readDbList = (table, data, column, array) => {
  return db(table).select(data).whereIn(column, array);
};

const _readDbWhereNot = (table, data, criteria1, criteria2) => {
  return db(table).select(data).whereNot(criteria1).andWhere(criteria2);
};

const _readDb_LimitedWhere = (
  table,
  data,
  column1,
  operator,
  value,
  limit,
  offset,
  column2,
  type
) => {
  return db(table)
    .select(data)
    .where(column1, operator, value)
    .limit(limit)
    .offset(offset)
    .orderBy(column2, type);
};

const _countRows = (table, data, column, operator, value) => {
  return db(table).count(data).where(column, operator, value);
};

const _insertDb = (table, inputData) => {
  return db(table).insert(inputData).returning("*");
};

const _deleteDb = (table, criteria) => {
  return db(table).where(criteria).del();
};

const _get2TabJoinData = (
  table1,
  table2,
  column1,
  column2,
  criteria1,
  column3,
  type
) => {
  return db(table1)
    .join(table2, column1, "=", column2)
    .select("*")
    .where(criteria1)
    .orderBy(column3, type);
};

const _get3TabJoinData = (
  table1,
  table2,
  table3,
  column1,
  column2,
  column3,
  column4,
  criteria1,
  limit,
  offset,
  column5,
  type
) => {
  return db(table1)
    .join(table2, column1, "=", column2)
    .join(table3, column3, "=", column4)
    .select("*")
    .where(criteria1)
    .limit(limit)
    .offset(offset)
    .orderBy(column5, type);
};

module.exports = {
  _readDbSingleAuthor,
  _readDb,
  _readDbList,
  _readDbWhereNot,
  _readDb_LimitedWhere,
  _countRows,
  _insertDb,
  _deleteDb,
  _get2TabJoinData,
  _get3TabJoinData,
};
