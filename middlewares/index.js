import ErrorHandler from '../utils/error';
import { handleError, verifyToken } from '../utils';

/**
 * Middleware for the authentication
 *
 * Returns to the further call backs if the token is valid otherwise throws an error
 */
export const protect = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization;
    let error;

    // Unauthorized access
    if (!bearer || !bearer.startsWith('Bearer ')) {
      error = new ErrorHandler(
        400,
        'Authentication token required. Please provide a authentication token',
      );
      return handleError(error, res);
    }

    const token = bearer.split('Bearer ')[1].trim();
    let payload;

    try {
      // Get the payload after verify the token
      // Payload is the user id
      payload = await verifyToken(token);
    } catch (err) {
      error = new ErrorHandler(
        400,
        'Authentication token invalid. Please provide a valid authentication token',
      );
      return handleError(error, res);
    }

    // Get the user details using the user id from db
    /* const user = await User.findById(payload.id).select('-password').lean().exec();

    // User not found in the db
    if (!user) {
      error = new ErrorHandler(403, 'User not found');
      return handleError(error, res);
    }

    // making the user object accessible in the request object for further use
    req.user = user;
    req.isAdmin = user.admin !== undefined;
 */
    next();
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Middleware for the checking if admin
 *
 * Returns to the further call backs if admin otherwise throws an error
 */
export const isAdmin = async (req, res, next) => {
  if (!req.isAdmin) {
    const error = new ErrorHandler(401, 'Only Admin access allowed');
    return handleError(error, res);
  }
  next();
};
