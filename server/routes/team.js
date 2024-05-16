const express = require('express');
const route= express.Router();
const teamController = require('../controller/teamController');

route.get('/all', teamController.allTeam);
route.post('/search', teamController.oneTeam);
route.post('/add', teamController.addTeam);
route.put('/update', teamController.updateTeam);
route.delete('/delete', teamController.deleteTeam);

module.exports = route ;