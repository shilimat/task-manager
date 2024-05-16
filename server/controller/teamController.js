const Team = require('../model/teams');


const allTeam = (req, res, next)=>{
  Team.find()
  .then(response => {
    res.json({data:response})
  })
  .catch(error => {
    res.json({message: 'An error Occured!'})
  })
}

const oneTeam = (req, res, next) =>{
    let teamID= req.body.teamrId
    Team.findOne({id:teamID})
    .then(response => {
        res.json({data:response})
      })
      .catch(error => {
        console.log(error)
        res.json({message: 'An error Occured!'})
      })
}

const addTeam = async (req, res, next) => {
  const { name, manager, members } = req.body;

  // Check if the email is already registered
  const existingTeam = await Team.findOne({ name });

  if (existingTeam) {
    return res.status(400).json({ message: 'team is already registered.' });
  }

  // Hash the password before saving to the database

  const newTeam= new Team({
    name,
    manager,
    members,
  });

  // Save the new user to the database
  await newTeam.save()
    .then(response => {

      res.json({ success: true, message: 'Team added successfully!' });
      })
      .catch(error => {
        console.log(error)
        res.json({message: 'An error Occured!'})
      })   
}

const updateTeam = (req, res, next) => {
  let TeamID = req.body.teamId;

  Team.findOneAndUpdate({ id: teamID }, req.body, { useFindAndModify: false })
    .then(response => {
      res.json({ message: 'Team Updated Successfully!' });
    })
    .catch(error => {
      console.log(error);
      res.json({ message: 'An error Occurred!' });
    });
};

const deleteTeam = (req, res, next) => {
    let teamID= req.body.teamId;
    Team.deleteOne({id: teamID})
    .then(response => {
        res.json({message: 'Team deleted Successfully!', data:response})
      })
      .catch(error => {
        console.log(error);
        res.json({message: 'An error Occured!'})
      })
}

module.exports = {allTeam, oneTeam, addTeam, updateTeam, deleteTeam}