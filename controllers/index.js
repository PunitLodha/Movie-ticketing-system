/* eslint-disable object-curly-newline */
/* eslint-disable import/extensions */
import { getDB } from '../utils/db.js';
import ErrorHandler from '../utils/error.js';
import { cmpPassword, genHashPassword, handleError, newToken } from '../utils/index.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let error;

    // find the user using the email
    const [results] = await getDB().query('SELECT * FROM user WHERE email=?', [email]);

    // User not found in the db
    if (!results[0]) {
      error = new ErrorHandler(403, 'Please provide a valid email');
      return handleError(error, res);
    }

    const user = results[0];
    const match = await cmpPassword(password, user.password);

    // Password provided does not match the password in the db
    if (!match) {
      error = new ErrorHandler(403, 'Please provide a valid password');
      return handleError(error, res);
    }

    const token = newToken(user);

    // check if admin
    let isAdmin = false;
    if (email === 'admin@admin.com') {
      isAdmin = true;
    }

    // Successfully returns the token as a response along with the user details
    res.status(200).json({
      success: true,
      data: {
        token: `Bearer ${token}`,
        user: { ...user, isAdmin, password: undefined },
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

export const register = async (req, res, next) => {
  try {
    const { email, password, name, mobile } = req.body;

    // check if user with same email alreay exists
    const [results] = await getDB().query('SELECT * FROM user WHERE email=?', [email]);
    if (results[0]) {
      const err = new ErrorHandler(403, 'User already exists');
      return handleError(err, res);
    }

    const hashedPassword = await genHashPassword(password);

    // add a new user
    await getDB().query('INSERT INTO user(name,mobile,email,password) VALUES (?,?,?,?)', [
      name,
      mobile,
      email,
      hashedPassword,
    ]);
    return res.status(200).json({
      success: true,
      data: {},
      msg: 'Succesfully added user',
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

export const ticket = async (req, res, next) => {
  try {
    const { no_seats, userID, showID, seats, screenID } = req.body;

    // check if no. of seats exceed 15
    if (no_seats > 15) {
      const err = new ErrorHandler(403, 'Cannot book more than 15 seats at a time');
      return handleError(err, res);
    }

    const seat_no = seats.map((get_seat_detail) => get_seat_detail.seat_no);
    const type = seats.map((get_seat_detail) => get_seat_detail.type);
    const price = seats.map((get_seat_detail) => get_seat_detail.price);
    const row = seats.map((get_seat_detail) => get_seat_detail.ro);

    //Lock seat table
    await getDB().query('LOCK TABLE seat WRITE');

    // add new seat
    let i;
    for (i = 0; i < no_seats; i++) {
      await getDB().query(
        'INSERT INTO seat(seat_no, type, price, ro, screenID) VALUES (?,?,?,?,?)',
        [seat_no[i], type[i], price[i], row[i], screenID],
      );
    }

    // add new ticket
    await getDB().query(
      'INSERT INTO ticket(no_seats, userID, showID, seat_number) VALUES (?,?,?,?)',
      [no_seats, userID, showID, String(seat_no)],
    );

    //Unlock table
    await getDB().query('UNLOCK TABLE');

    return res.status(200).json({
      success: true,
      data: {},
      msg: 'Booked ticket successfully',
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

export const get_card_details = async (req, res, next) => {
  try {
    const { userID } = req.body;
    let error;

    // find card using userID
    const [results] = await getDB().query('SELECT * FROM card WHERE userID=?', [userID]);

    // card not found in the db
    if (!results[0]) {
      error = new ErrorHandler(404, 'Found no card');
      return handleError(error, res);
    }
    return res.status(200).json({
      success: true,
      data: { ...results[0] },
      msg: 'Found card',
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

export const post_card_details = async (req, res, next) => {
  try {
    const { card_number, name, userID } = req.body;
    // insert card in db
    await getDB().query('INSERT INTO card(card_number, name, userID) VALUES (?,?,?)', [
      card_number,
      name,
      userID,
    ]);
    return res.status(200).json({
      success: true,
      data: {},
      msg: 'Inserted new card successfully',
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

export const get_seat_avail = async (req, res, next) => {
  try {
    const { screenID } = req.body;
    const [screen] = await getDB().query('SELECT * FROM screen WHERE screenID = ?', [screenID]);
    if (!screen[0]) {
      const error = new ErrorHandler(404, 'Screen does not exist');
      return handleError(error, res);
    }
    const [results] = await getDB().query('SELECT seat_no,ro FROM seat WHERE screenID=?', [
      screenID,
    ]);
    if (!results[0]) {
      return res.status(200).json({
        success: true,
        data: [],
        msg: '',
        error: {},
      });
    }
    const seats_booked = results.map((seat) => `${seat.ro}${seat.seat_no}`);
    return res.status(200).json({
      success: true,
      data: seats_booked,
      msg: 'Showing booked seats',
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

export const movies = async (req, res, next) => {
  try {
    const [movie_results] = await getDB().query(
      'SELECT m.*, e.* FROM movie m JOIN event e USING (eventID) JOIN shows USING (eventID) JOIN ticket USING (showID) GROUP BY e.eventID ORDER BY SUM(no_seats) DESC LIMIT 5;',
    );
    const [play_results] = await getDB().query(
      'SELECT p.*, e.* FROM play p JOIN event e USING (eventID) JOIN shows USING (eventID) JOIN ticket USING (showID) GROUP BY e.eventID ORDER BY SUM(no_seats) DESC LIMIT 5;',
    );
    const [talk_show_results] = await getDB().query(
      'SELECT t.*, e.* FROM talk_show t JOIN event e USING (eventID) JOIN shows USING (eventID) JOIN ticket USING (showID) GROUP BY e.eventID ORDER BY SUM(no_seats) DESC LIMIT 5;',
    );
    return res.status(200).json({
      success: true,
      data: { movie: movie_results, play: play_results, talk_show: talk_show_results },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

export const get_event_details = async (req, res, next) => {
  try {
    const { eventID } = req.body;
    const [
      play,
    ] = await getDB().query(
      'SELECT * FROM (SELECT event.*, play.director, play.cast FROM event JOIN play ON event.eventID = play.eventID) AS event_play WHERE event_play.eventID = ?',
      [eventID],
    );
    const [
      talk_show,
    ] = await getDB().query(
      'SELECT * FROM (SELECT event.*, talk_show.speaker FROM event JOIN talk_show ON event.eventID = talk_show.eventID) AS event_talkshow WHERE event_talkshow.eventID = ?',
      [eventID],
    );
    const [
      movie,
    ] = await getDB().query(
      'SELECT * FROM (SELECT event.*, movie.director, movie.cast, movie.rating FROM event JOIN movie ON event.eventID = movie.eventID) AS event_movie WHERE event_movie.eventID = ?',
      [eventID],
    );
    // wrong event id
    if (!play[0] && !movie[0] && !talk_show[0]) {
      const error = new ErrorHandler(404, 'No event found');
      return handleError(error, res);
    }
    if (play[0]) {
      return res.status(200).json({
        success: true,
        data: { ...play[0], type: 'play' },
        msg: 'Showing the play event',
        error: {},
      });
    }
    if (movie[0]) {
      return res.status(200).json({
        success: true,
        data: { ...movie[0], type: 'movie' },
        msg: 'Showing the movie event',
        error: {},
      });
    }
    return res.status(200).json({
      success: true,
      data: { ...talk_show[0], type: 'talk_show' },
      msg: 'Showing the talk show event',
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};
export const all_movies = async (req, res, next) => {
  try {
    const [movie_results] = await getDB().query(
      'SELECT m.*, e.* FROM movie m JOIN event e USING (eventID);',
    );
    const [play_results] = await getDB().query(
      'SELECT p.*, e.* FROM play p JOIN event e USING (eventID);',
    );
    const [talk_show_results] = await getDB().query(
      'SELECT t.*, e.* FROM talk_show t JOIN event e USING (eventID);',
    );
    return res.status(200).json({
      success: true,
      data: { movie: movie_results, play: play_results, talk_show: talk_show_results },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

export const get_shows = async (req, res, next) => {
  try {
    const { eventID } = req.body;
    const [
      show_details,
    ] = await getDB().query(
      'SELECT * FROM (SELECT * FROM event JOIN shows USING (eventID) JOIN screen USING (screenID) JOIN theatre USING (theatreID)) AS event_details WHERE event_details.eventID = ?',
      [eventID],
    );

    // wrong event id
    if (!show_details[0]) {
      const error = new ErrorHandler(404, 'No event found');
      return handleError(error, res);
    }

    return res.status(200).json({
      success: true,
      data: { shows: show_details },
      msg: 'Showing the show details',
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};
