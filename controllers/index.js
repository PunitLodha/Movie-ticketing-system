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

export const movies = async(res,req,next) => {
 try{
 const[movie_results] = await getDB.query(' SELECT name FROM (SELECT name,SUM(No_seats) FROM Movie JOIN Event USING (EventID) JOIN SHOWS USING (EventID) JOIN Ticket USING (ShowID) GROUP BY EventID ORDER BY 2 DESC LIMIT 5 )q;}');
 const[play_results] =  await getDB.query(' SELECT name FROM (SELECT name,SUM(No_seats) FROM Play JOIN Event USING (EventID) JOIN SHOWS USING (EventID) JOIN Ticket USING (ShowID) GROUP BY EventID ORDER BY 2 DESC LIMIT 5 )q;}');
 const[talk_show_results] = await getDB.query(' SELECT name FROM (SELECT name,SUM(No_seats) FROM Talk_show JOIN Event USING (EventID) JOIN SHOWS USING (EventID) JOIN Ticket USING (ShowID) GROUP BY EventID ORDER BY 2 DESC LIMIT 5 )q;}');
 return res.status(200).json({
  success : true,
  data : {movie: movie_results , play : play_results ,talk_show : talk_show_results},
  error : {},
 })
} catch (err) {
  return handleError(err,res);
} 

};