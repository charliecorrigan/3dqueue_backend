exports.up = function(knex, Promise) {
  return knex.schema.table('admins', (tbl) => {
    tbl.string('password', 128);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('admins', (tbl) => {
    tbl.dropColumn('password');
  });
};

