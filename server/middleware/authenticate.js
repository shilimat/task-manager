// middleware/authenticate.js
const passport = require('passport');

module.exports = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // If authentication is successful, attach the user to the request object
    console.log('sucessful auth');
    req.user = user;

    next();
  })(req, res, next);
};
