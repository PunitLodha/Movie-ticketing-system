/* eslint-disable no-multi-str */
import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config({ path: 'config/config.env' });

const state = {
  db: null,
};

async function setupDb() {
  try {
    // create the connection to database
    const db = await mysql.createConnection({
      host: 'localhost',
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'movie_ticketing_system',
    });

    // connect to database

    console.log('Connected to Mysql');
    state.db = db;

    // TODO Add all table create queries here

    await db.query(
      'CREATE TABLE IF NOT EXISTS user(userID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(20), \
      mobile VARCHAR(20), email VARCHAR(50), password CHAR(60))',
    );
    await db.query(
      'CREATE TABLE IF NOT EXISTS theatre(theatreID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, \
      name VARCHAR(20),location VARCHAR(20), phone VARCHAR(20), no_of_screens INT)',
    );

    await db.query(
      'CREATE TABLE IF NOT EXISTS card(card_number VARCHAR(20) NOT NULL PRIMARY KEY, name VARCHAR(20), \
      userID INT, CONSTRAINT fk_user FOREIGN KEY (userID) REFERENCES user(userID))',
    );

    await db.query(
      'CREATE TABLE IF NOT EXISTS event(eventID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, duration VARCHAR(20),\
              lang VARCHAR(20), genre VARCHAR(20), name VARCHAR(20))',
    );

    await db.query(
      'CREATE TABLE IF NOT EXISTS play(director VARCHAR(20), cast VARCHAR(20), eventID INT,  \
                  CONSTRAINT fk_event FOREIGN KEY (eventID) REFERENCES event(eventID))',
    );

    await db.query(
      'CREATE TABLE IF NOT EXISTS talk_show(speaker VARCHAR(20), eventID INT, \
                  CONSTRAINT fk2_event FOREIGN KEY (eventID) REFERENCES event(eventID))',
    );

    await db.query(
      'CREATE TABLE IF NOT EXISTS movie(director VARCHAR(20), cast VARCHAR(20), rating INT, eventID INT, \
                  CONSTRAINT fk1_event FOREIGN KEY (eventID) REFERENCES event(eventID))',
    );

    await db.query(
      'CREATE TABLE IF NOT EXISTS screen(screenID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, capacity INT, theatreID INT,\
                    CONSTRAINT fk_theatre FOREIGN KEY (theatreID) REFERENCES theatre(theatreID))',
    );

    await db.query(
      'CREATE TABLE IF NOT EXISTS seat(seat_no INT NOT NULL PRIMARY KEY, type VARCHAR(20), price INT, \
  ro VARCHAR(20), screenID INT, CONSTRAINT fk_screen FOREIGN KEY (screenID) REFERENCES screen(screenID))',
    );

    await db.query(
      'CREATE TABLE IF NOT EXISTS shows(showID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, time datetime, date date, \
      seats_avail INT, eventID INT, screenID INT, CONSTRAINT fk3_event FOREIGN KEY (eventID) REFERENCES event(eventID), \
      CONSTRAINT fk1_screen FOREIGN KEY (screenID) REFERENCES screen(screenID))',
    );

    await db.query(
      'CREATE TABLE IF NOT EXISTS ticket(ticketID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, no_seats INT, userID INT, showID INT,\
      CONSTRAINT fk1_user FOREIGN KEY (userID) REFERENCES user(userID), \
      CONSTRAINT fk_show FOREIGN KEY (showID) REFERENCES shows(showID))',
    );

    /* db.query('SELECT * FROM `user`', (err, results, fields) => {
      console.log(results); // results contains rows returned by server
    }); */
  } catch (error) {
    console.log(error);
  }
}

export const getDB = () => state.db;
export default setupDb;
