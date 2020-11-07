/* eslint-disable import/extensions */
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import fs from 'fs';
import { handleError } from './utils/index.js';
import ErrorHandler from './utils/error.js';
import apiRoutes from './routes/index.js';
import setupDb, { getDB } from './utils/db.js';

config({ path: 'config/config.env' });

const app = express();

setupDb();

app.use(cors());
app.use(morgan('common'));
app.use(express.json());

app.get('/populate', async (req, res, next) => {
  try {
    const { event, movie, play, talkShow, screen, shows, theatre } = JSON.parse(
      fs.readFileSync('./data.json', 'utf-8'),
    );

    await getDB().query('INSERT INTO event VALUES ?', [event]);
    await getDB().query('INSERT INTO movie VALUES ?', [movie]);
    await getDB().query('INSERT INTO play VALUES ?', [play]);
    await getDB().query('INSERT INTO talk_show VALUES ?', [talkShow]);
    await getDB().query('INSERT INTO theatre VALUES ?', [theatre]);
    await getDB().query('INSERT INTO screen VALUES ?', [screen]);
    await getDB().query('INSERT INTO shows VALUES ?', [shows]);

    return res.status(200).json({
      success: true,
      data: { event },
      msg: 'Showing the show details',
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
});

app.use('/api', apiRoutes);

app.use((req, res) => {
  const err = new ErrorHandler(500, 'Not Found');
  handleError(err, res);
});

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.info(`Server started listening on http://${HOST}:${PORT}`);
});
