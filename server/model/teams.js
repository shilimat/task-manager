const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
