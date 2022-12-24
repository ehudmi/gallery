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

// const _readDbSingleAuthor = (table1, column1, criteria) => {
//   return db(`${table1} as t1`)
//     .select("*")
//     .where(
//       db(`${table1} as t2`)
//         .select("*")
//         .count("*")
//         .where(`t1.${column1}`, "=", `t2.${column1}`),
//       "=",
//       1
//     )
//     .andWhere(criteria);
// .join(
//   db
//     .select(column1)
//     .from(`${table1} as t3`)
//     .count(`${column1} as count`)
//     .groupBy(column1)
//     .having("t3.count", "=", 1)
//     .as("t2"),
//   `t2.${column1}`,
//   "=",
//   `t1.${column1}`
// );
// .where(criteria);

// .andWhere(criteria);
// };

// select * from project_authors t1
// where (select count(*) from project_authors t2
//   where t1.project_id = t2.project_id) = 1
//   AND t1.user_id=2
// order by t1.project_id;

// select * from project_authors t1
// INNER JOIN (SELECT t3.project_id FROM project_authors t3 GROUP BY t3.project_id
// 			HAVING COUNT (t3.project_id)=1) t2
// 			ON t1.project_id=t2.project_id Where t1.user_id=2 ORDER BY t1.project_id;

// select * from project_authors t1
// where NOT exists
//       (select 1 from project_authors t2
//        where t1.project_id = t2.project_id and t1.user_id <> t2.user_id) AND t1.user_id=2
// 	   ORDER by t1.project_id
//  ;

const _readDb = (table, data, criteria) => {
  return db(table).select(data).where(criteria);
};

const _readDbList = (table, data, column, array) => {
  return db(table).select(data).whereIn(column, array);
};

const _readDbWhereNot = (table, data, criteria1, criteria2) => {
  return db(table).select(data).whereNot(criteria1).andWhere(criteria2);
};

const _readDbNotNull = (table, data, criteria) => {
  return db(table).select(data).whereNotNull(criteria);
};

const _readDb_Limited = (table, data, limit, offset) => {
  return db(table).select(data).limit(limit).offset(offset);
};

const _readDb_LimitedWhereNot = (table, data, criteria1, limit, offset) => {
  return db(table).select(data).whereNot(criteria1).limit(limit).offset(offset);
};

const _countRows = (table, data, column, operator, value) => {
  return db(table).count(data).where(column, operator, value);
};

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
  criteria1,
  limit,
  offset
) => {
  return db(table1)
    .join(table2, column1, "=", column2)
    .join(table3, column3, "=", column4)
    .select("*")
    .where(criteria1)
    .limit(limit)
    .offset(offset);
};

module.exports = {
  _readDbSingleAuthor,
  _readDb,
  _readDbList,
  _readDbWhereNot,
  _readDbNotNull,
  _readDb_Limited,
  _readDb_LimitedWhereNot,
  _countRows,
  _searchDb,
  _searchAuthorsDb,
  _insertDb,
  _deleteDb,
  _updateDb,
  _get2TabJoinData,
  _get3TabJoinData,
};
