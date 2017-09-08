
exports.up = function(knex, Promise) {
  let createQuery = `CREATE TABLE admins(
    id SERIAL PRIMARY KEY NOT NULL,
    username TEXT,
    created_at TIMESTAMP
  )`
  return knex.raw(createQuery)
}

exports.down = function(knex, Promise) {
  let dropQuery = `DROP TABLE admin`
  return knex.raw(dropQuery)
}
