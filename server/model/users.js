const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "manager", "team member"],
    default: "team member",
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  profileImage: {
    type: Buffer, 
    default: getDefaultImage(),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

function getDefaultImage() {
    const fs = require('fs');
    const path = require('path');
  
    const defaultImagePath = path.join(__dirname,'..', 'public', 'images', 'userLogo.png');
  
    try {
      const defaultImageBuffer = fs.readFileSync(defaultImagePath);
      return defaultImageBuffer;
    } catch (error) {
      console.error(`Error reading default image: ${error.message}`);
      return null; // Return null or handle the error as needed
    }
  }
  
module.exports = User;
