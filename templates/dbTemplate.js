var mysql = require('mysql');
var pool;
module.exports = {
    getPool: function () {
      if (pool) return pool;
      pool = mysql.createPool({
        host     : '{dbHost}',
        user     : '{dbUser}',
        password : '{dbPassword}',
        database : '{dbName}'
      });
      return pool;
    }
};

