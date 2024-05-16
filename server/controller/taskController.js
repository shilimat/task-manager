const Task = require('../model/tasks');

const allTask = (req, res, next)=>{
  Task.find()
  .then(response => {
    res.json({data:response})
  })
  .catch(error => {
    res.json({message: 'An error Occured!'})
  })
}

const oneTask = (req, res, next) =>{
    let taskID= req.body.taskId
    Task.findOne({id:taskID})
    .then(response => {
        res.json({data:response})
      })
      .catch(error => {
        console.log(error)
        res.json({message: 'An error Occured!'})
      })
}

const fetchTasksByAssignee = (req, res, next) => {
  let assigneeID= req.body.assigneeId
  
    Task.find({ 'assignees.user': assigneeID }).then(response => {
      res.json({data:response})
    })
    .catch(error => {
      console.log(error)
      res.json({message: 'An error Occured!'})
    })
};

const addTask = async (req, res, next) => {
    let task = new Task({
          title: req.body.title,
          description: req.body.description,
          assignees: req.body.assignees,
          dueDate: new Date(req.body.dueDate),
          assignedBy:req.body.assignedBy,
          priority: req.body.priority,  
          status: req.body.status,
          lastUpdated: new Date(),            
          createdAt: new Date() 
        })
    task.save()
    .then(response => {

        res.json({message: 'task added successfully!'})
      })
      .catch(error => {
        console.log(error)
        res.json({message: 'An error Occured!'})
      })   
}

const updateTask = (req, res, next) => {
  let taskID = req.body.taskId;
  req.body.lastUpdated = new Date();
  Task.findOneAndUpdate({ id: taskID}, req.body, { useFindAndModify: false })
    .then(response => {
      res.json({ message: 'Task Updated Successfully!' });
    })
    .catch(error => {
      console.log(error);
      res.json({ message: 'An error Occurred!' });
    });
};

const deleteTask = (req, res, next) => {
    let taskID= req.body.taskId;
    Task.deleteOne({id: taskID})
    .then(response => {
        res.json({message: 'Task deleted Successfully!', data:response})
      })
      .catch(error => {
        console.log(error);
        res.json({message: 'An error Occured!'})
      })
}

module.exports = {allTask, oneTask, addTask, updateTask, deleteTask, fetchTasksByAssignee}