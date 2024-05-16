// routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../model/users');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Handle registration request
router.post('/register', async (req, res) => {
  try {
    const { username, password, firstName, lastName, email, dateOfBirth, gender } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      dateOfBirth,
      gender,
    });

    // Save the new user to the database
    await newUser.save();

    // Authenticate the user after registration
    passport.authenticate('local', (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      // If authentication is successful, send a success response
      res.json({ success: true, user });
    })(req, res);
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Handle login request
router.post('/login', authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
