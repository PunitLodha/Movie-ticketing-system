import mysql from 'mysql2';
import { config } from 'dotenv';

config({ path: 'config/config.env' });

function setupDb() {
  // create the connection to database
  const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'movie_ticketing_system',
  });

  // connect to database
  db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Connected to Mysql');

    // TODO Add all table create queries here

    /* db.query('SELECT * FROM `customer`', (err, results, fields) => {
      console.log(results); // results contains rows returned by server
    }); */
  });
  global.db = db;
}

export default setupDb;
