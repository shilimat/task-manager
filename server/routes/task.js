const express = require('express');
const route= express.Router();
const taskController = require('../controller/taskController');

route.get('/all', taskController.allTask);
route.post('/search', taskController.oneTask);
route.post('/assigneetask', taskController.fetchTasksByAssignee);
route.post('/add', taskController.addTask);
route.put('/update', taskController.updateTask);
route.delete('/delete', taskController.deleteTask);

module.exports = route ;