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

export const ticket = async(req, res, next) =>{
  try{
     const { no_seats, userID, showID, seats, screenID } = req.body;

     //check if no. of seats exceed 15
     if(no_seats>15) {
        const err = new ErrorHandler(401, 'Cannot book more than 15 seats at a time');
        return handleError(err, res);
     }

     const seat_no = seats.map(function (get_seat_detail){
      return get_seat_detail.seat_no 
      });
      const type = seats.map(function (get_seat_detail){
        return get_seat_detail.type
       });
      const price = seats.map(function (get_seat_detail){
        return get_seat_detail.price
       });
      const row = seats.map(function (get_seat_detail){
        return get_seat_detail.ro
       });

     //add new ticket
     await getDB().query('INSERT INTO ticket(no_seats, userID, showID, seat_number) VALUES (?,?,?,?)', [no_seats, userID, showID, String(seat_no)]);

     //add new seat
     var i;
     for (i=0; i< no_seats ; i++) {
        await getDB().query('INSERT INTO seat(seat_no, type, price, ro, screenID) VALUES (?,?,?,?,?)', [seat_no[i], type[i], price[i], row[i], screenID]);
     }
     return res.status(200).json({
        success: true,
        data: {},
        msg: 'Booked ticket successfully',
        error: {},
     });
  }catch (err){
     return handleError(err, res);  
  }
};

export const get_card_details = async(req, res, next) => {
  try{
    const { userID } = req.body;
    let error;

    //find card using userID
    const [results] = await getDB().query('SELECT * FROM card WHERE userID=?', [userID]);

    // card not found in the db
    if (!results[0]) {
      error = new ErrorHandler(403, 'Found no card');
      return handleError(error, res);
    }   
    return res.status(200).json({
      success: true,
      data: {results} ,
      msg: 'Found card',
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
}; 

export const post_card_details = async(req, res, next) =>{
  try{
    const{ card_number, name, userID } = req.body;
    //insert card in db
    await getDB().query('INSERT INTO card(card_number, name, userID) VALUES (?,?,?)', [card_number, name, userID]);
    return res.status(200).json({
      success: true,
      data: {},
      msg: 'Inserted new card successfully',
      error: {},
    });
  }catch (err) {
    return handleError(err, res);
  }
};

export const get_seat_avail = async( req, res, next ) => {
  try{
    const { screenID } = req.body;
    const [results] = await getDB().query('SELECT seat_no FROM seat WHERE screenID=?', [screenID]);
    if (!results[0]) {
      error = new ErrorHandler(401, 'All seats available');
      return handleError(error, res);
    }   
    const seats_booked = results.map(function (get_seat_booked){
      return get_seat_booked.seat_no 
      });
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


export const movies = async(res,req,next) => {
  try{
  const[movie_results] = await getDB().query('SELECT m.*, e.* FROM Movie m JOIN Event e USING (EventID) JOIN SHOWS USING (EventID) JOIN Ticket USING (ShowID) GROUP BY e.EventID ORDER BY SUM(No_seats) DESC LIMIT 5;');
  const[play_results] =  await getDB().query('SELECT p.*, e.* FROM Play p JOIN Event e USING (EventID) JOIN SHOWS USING (EventID) JOIN Ticket USING (ShowID) GROUP BY e.EventID ORDER BY SUM(No_seats) DESC LIMIT 5;');
  const[talk_show_results] = await getDB().query('SELECT t.*, e.* FROM talk_show t JOIN Event e USING (EventID) JOIN SHOWS USING (EventID) JOIN Ticket USING (ShowID) GROUP BY e.EventID ORDER BY SUM(No_seats) DESC LIMIT 5;');
  return res.status(200).json({
   success : true,
   data : {movie: movie_results , play : play_results ,talk_show : talk_show_results},
   error : {},
  });
 } catch (err) {
   return handleError(err,res);
 } 
 };

export const all_movies = async(res,req,next) => {
  try{
  const[movie_results] = await getDB().query('SELECT m.*, e.* FROM Movie m JOIN Event e USING (EventID);');
  const[play_results] =  await getDB().query('SELECT p.*, e.* FROM Play p JOIN Event e USING (EventID);');
  const[talk_show_results] = await getDB().query('SELECT t.*, e.* FROM talk_show t JOIN Event e USING (EventID);');
  return res.status(200).json({
   success : true,
   data : {movie: movie_results , play : play_results ,talk_show : talk_show_results},
   error : {},
  });
 } catch (err) {
   return handleError(err,res);
 } 
 };
