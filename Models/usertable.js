const mongoose = require("mongoose");
const moment = require("moment-timezone");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken")

// const indianTimestampPlugin = require("../middlewares/indianTimestampPlugin");
const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true,"email is Required"],
      unique: [true,"already in database"],
    },
    mobile: {
      type: String,
      required: [true,"mobile is Required"],
      unique: [true,"already in database"],
    },
    dob: {
      type: Date, // Assuming the date of birth is a Date type
      required: true,
    },
    status: {
      type: String,
      default:"Active"
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String
  },
    isAdmin: {
      type: String,
      default: "Inactive",
    },
  },
  {
    timestamps: true,
  }
);


// userSchema.pre('save', function (next) {
//   this.createdAt = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
//   this.updatedAt = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
//   next();
// });
// userSchema.plugin(indianTimestampPlugin);


userSchema.pre('save', function(next) {
  this.createdAt = moment().format('YYYY-MM-DD');
  this.updatedAt = moment().format('YYYY-MM-DD');
  next();
});


userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = function(){
  console.log("Model")
  return jwt.sign(
      {
          _id: this._id,
          email: this.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
  )
}


userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
  )
}

const Usertable = mongoose.model("Usertable", userSchema);
module.exports = Usertable;
