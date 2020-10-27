/* eslint-disable import/extensions */
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import { handleError } from './utils/index.js';
import ErrorHandler from './utils/error.js';
import setupDb from './utils/db.js';

config({ path: 'config/config.env' });

const app = express();

setupDb();

app.use(cors());
app.use(morgan('common'));

app.use((req, res) => {
  const err = new ErrorHandler(500, 'Not Found');
  handleError(err, res);
});

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.info(`Server started listening on http://${HOST}:${PORT}`);
});
