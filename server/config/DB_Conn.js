const mongoose= require('mongoose');
const db='mongodb+srv://shilimat:q2FSVwAUSR3bEmtD@cluster0.ozimlgm.mongodb.net/task_manager?retryWrites=true&w=majority';

const connectDB = async () => {
    try{
   await mongoose.connect(db);
    }catch(err){
        console.error(err);
    }
}

module.exports= connectDB