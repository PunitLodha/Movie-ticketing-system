/* eslint-disable import/extensions */
import { Router } from 'express';
import { login, register } from '../controllers/index.js';
import {movies} from '../controllers/index.js';
import { ticket } from '../controllers/index.js';
import { get_card_details} from '../controllers/index.js';
import { post_card_details} from '../controllers/index.js';

const router = Router();

router.route('/auth/users/login').post(login);

router.route('/auth/users/register').post(register);
router.route('/topmovies').get(movies);

router.route('/shows/ticket').post(ticket);

router.route('/shows/ticket/payment').get(get_card_details);
router.route('/shows/ticket/payment').post(post_card_details);

export default router;
