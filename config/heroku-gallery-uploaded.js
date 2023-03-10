const knex = require("knex");

const db = knex({
  client: "pg",
  connection: "postgresql://postgres:h1Q8pFvY1uRokM7f@db.nghssamptdjccacinnuy.supabase.co:5432/postgres?ssl=false"
});
console.log("my connection",db.connection)

module.exports = db;
