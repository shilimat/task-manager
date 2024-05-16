const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const User = require('./model/users');
const cors = require('cors');
const connectDB = require('./config/DB_Conn');
const mongoose = require('mongoose');
const path = require('path');
const UserRouter = require('./routes/user');
const TaskRouter = require('./routes/task');
const TeamRouter = require('./routes/team');
const { appendFileSync } = require('fs');
const MongoDBStore = require('connect-mongodb-session')(session);

const PORT = process.env.PORT || 3500;
const SESSION_SECRET = 'your-secret-key';
const MONGODB_URI = 'mongodb+srv://shilimat:q2FSVwAUSR3bEmtD@cluster0.ozimlgm.mongodb.net/task_manager?retryWrites=true&w=majority'; // Update with your MongoDB connection URI

const app = express();

connectDB();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware
app.use(express.static(path.join(__dirname, '/public')));

// Create separate session stores based on the request's session cookie
// const sessionStore = (req) =>
//   new MongoDBStore({
//     uri: MONGODB_URI,
//     collection: 'sessions',
//     // Generate unique session store for each user based on their session cookie
//     // The session cookie name is 'connect.sid' by default
//     // You can change it using the 'name' property in the express-session configuration
//     // Here, we append the session cookie's value to the default session store collection name
//     // to create a unique collection for each user's session
//     collectionName: `sessions_${req.cookies['connect.sid']}`,
//   });

// Configure express-session to use the appropriate session store based on the request's session cookie
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    
  })
);
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, HEAD, DELETE');
  next();
});

app.use('/api/user', UserRouter);
app.use('/api/task', TaskRouter);
app.use('/api/team', TeamRouter);

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // If the user is authenticated, create a session and store user data
    req.session.user = {
      id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    };

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Example route to access session data
app.get('/profile', async (req, res) => {
  if (req.session.user) {
    try {
      // Retrieve the user data from the session store
      const user = await User.findById(req.session.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Send user data back to the client
      res.json(req.session.user); // Change res.session.user to req.session.user
    } catch (err) {
      console.error('Error retrieving user from database:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    res.status(200).json({ success: true });
  });
});

mongoose.connection.once('open', () => {
  console.log("Mongoose Connected");
  app.listen(PORT, console.log("Server running on port 3500"));
});