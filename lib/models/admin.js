const bookshelf = require('../bookshelf');
const Admin = bookshelf.Model.extend({
  tableName: 'admins',
});
module.exports = Admin;