const User = require('../model/users');
const bcrypt = require('bcrypt');


const allUser = (req, res, next)=>{
  User.find()
  .then(response => {
    res.json({data:response})
  })
  .catch(error => {
    res.json({message: 'An error Occured!'})
  })
}

const oneUser = (req, res, next) =>{
    let userID= req.body.userId
    User.findOne({id:userID})
    .then(response => {
        res.json({data:response})
      })
      .catch(error => {
        console.log(error)
        res.json({message: 'An error Occured!'})
      })
}

const addUser = async (req, res, next) => {
  const { username, password, firstName, lastName, email, dateOfBirth, gender, role } = req.body;

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
    role
  });

  // Save the new user to the database
  await newUser.save()
    .then(response => {

        res.json({message: 'user added successfully!'})
      })
      .catch(error => {
        console.log(error)
        res.json({message: 'An error Occured!'})
      })   
}

const updateUser = (req, res, next) => {
  let userID = req.body.userId;

  User.findOneAndUpdate({ id: userID }, req.body, { useFindAndModify: false })
    .then(response => {
      res.json({ success: true, message: 'User Updated Successfully!' });
    })
    .catch(error => {
      console.log(error);
      res.json({ success: false, message: 'An error occurred while updating the user!' });
    });
};

const deleteUser = (req, res, next) => {
    let userID= req.body.userId;
    User.deleteOne({id: userID})
    .then(response => {
        res.json({message: 'User deleted Successfully!', data:response})
      })
      .catch(error => {
        console.log(error);
        res.json({message: 'An error Occured!'})
      })
}

module.exports = {allUser, oneUser, addUser, updateUser, deleteUser}