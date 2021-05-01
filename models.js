//import express module locally and declares variable to use express for web configuration
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());


let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String
  },
  ImagePath: String,
  Year: String,
  Featured: Boolean
});

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Name: {type: String, required: true},
  Birthday: Date,
  FavoriteMovies: [{type:mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  if (bcrypt.compareSync(password, this.Password)) {
    console.log('Password is Correct');
    return true;
  } else {
    console.log('Password is incorrect. Password is ' + this.password);
    return false;
  }
};


let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
