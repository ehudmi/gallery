const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  },
  //   connection: {

  //     host: process.env.DB_HOST,
  //     port: process.env.DB_PORT,
  //     user: process.env.DB_USER,
  //     password: process.env.DB_PASS,
  //     database: process.env.DB_NAME,
  //     ssl: { rejectUnauthorized: false },
  //   },
});

module.exports = db;
