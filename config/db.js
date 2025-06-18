const fs = require('fs');
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  multipleStatements: true
});

const schema = fs.readFileSync('./database/schema.sql', 'utf8');

db.connect((err) => {
  if (err) throw err;
  console.log(' Connected to MySQL');

  db.query(schema, (err, result) => {
    if (err) throw err;
    console.log(' Database & tables created successfully');

  });
});
module.exports = db;