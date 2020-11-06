/* eslint-disable import/extensions */
import { Router } from 'express';
import {
  login,
  register,
  movies,
  ticket,
  get_card_details,
  post_card_details,
  get_seat_avail,
  get_event_details,
  get_shows,
  all_movies,
} from '../controllers/index.js';

const router = Router();

router.route('/auth/users/login').post(login);

router.route('/auth/users/register').post(register);
router.route('/topmovies').get(movies);

router.route('/shows/ticket').post(ticket);

router.route('/shows/ticket/payment').post(get_card_details);
router.route('/shows/ticket/payment/save').post(post_card_details);

router.route('/shows/screen/tickets/booked').post(get_seat_avail);

router.route('/shows/event').post(get_event_details);

router.route('/showlist').post(get_shows);

router.route('/all_movies').get(all_movies);

export default router;
