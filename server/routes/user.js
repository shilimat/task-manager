const express = require('express');
const route= express.Router();
const userController = require('../controller/userController');

route.get('/all', userController.allUser);
route.post('/search', userController.oneUser);
route.post('/add', userController.addUser);
route.put('/update', userController.updateUser);
route.delete('/delete', userController.deleteUser);

module.exports = route ;