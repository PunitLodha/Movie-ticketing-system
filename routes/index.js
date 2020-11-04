/* eslint-disable import/extensions */
import { Router } from 'express';
import { login, register } from '../controllers/index.js';
import {movies} from '../controllers/index.js'
const router = Router();

router.route('/auth/users/login').post(login);

router.route('/auth/users/register').post(register);

router.route('/topmovies').get(movies);

export default router;
