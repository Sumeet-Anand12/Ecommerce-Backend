const mongoose = require('mongoose')

const connectdb = (con) =>{
    return mongoose.connect(`${con}/${process.env.DB_NAME}`).then(() =>{
        console.log("connection successfull");
    }).catch((err) =>{
        console.log("database error :",err);
    })
}

module.exports = connectdb