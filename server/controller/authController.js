// server/controllers/authController.js
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.loginUser = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
};

exports.logoutUser = (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username is already taken.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).send('User registered successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
