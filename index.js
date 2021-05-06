//import express module locally and declares variable to use express for web configuration
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  app = express();

const { check, validationResult } = require('express-validator');

cors = require('cors');
app.use('*',cors());

// let allowedOrigins = ['http://localhost:8080','http://localhost:1234','http://testsite.com'];

// app.use(cors({
//   origin: (origin, callback) => {
//     if(!origin) return callback(null,true);
//     if(allowedOrigins.indexOf(origin) === -1) {
//       let message = 'The CORS policy for this app does not allow access from this origin: ' + origin ;
//       return callback(new Error(message), false);
//       }
//       return callback(null,true);
//   }
// }));

//mongoose.connect('mongodb://localhost:27017/myFlixDB',{useNewUrlParser:true, useUnifiedTopology:true});
mongoose.connect(process.env.CONNECTION_URI,{useNewUrlParser:true, useUnifiedTopology:true});
//mongoose.connect('mongodb+srv://JJWoolridge:Bananapip22j@jw-cf-movie-api.otomx.mongodb.net/myFlixDB?retryWrites=true&w=majority', {useNewUrlParser:true, useUnifiedTopology:true});
mongoose.set('useFindAndModify', false);

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('public'));

const passport = require('passport');
require('./passport');
let auth = require('./auth')(app);

const Models = require('./models.js');
const Movies=Models.Movie;
const Users=Models.User;

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('didn\'t work');
});

//GET requests
app.get('/', (req, res) => {
  res.send('you found the landing page');
});

// return list of movies
app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
//app.get('/movies', function (req, res) {
  Movies.find()
  .then(movies => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// gets details for a movie by title
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
//  console.log(req.params.Title); used for debugging
    Movies.findOne({Title: req.params.Title})
    .then(movie => {
        res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: '+ err);
    });
});

// gets all movies matching a genre
app.get('/movies/:Title/description', passport.authenticate('jwt', {session: false}), (req,res) => {
  Movies.findOne({Title: req.params.Title})
  .then(movie => {
      res.status(201).json(movie.Description);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: '+ err);
  });
});

// gets details of a director of a movie
app.get('/movies/:Title/director/', passport.authenticate('jwt', {session: false}), (req,res) => {
  Movies.findOne({Title: req.params.Title})
  .then(movie => {
      res.status(201).json(movie.Director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: '+ err);
  });
});

// gets details of a genre
app.get('/movies/genre/:Genre/', passport.authenticate('jwt', {session: false}), (req,res) => {
  Movies.findOne({'Genre.Name': req.params.Genre})
  .then(movie => {
      res.status(201).json(movie.Genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: '+ err);
  });
});

// gets details of a director by name
app.get('/movies/director/:Director/', passport.authenticate('jwt', {session: false}), (req,res) => {
  Movies.findOne({'Director.Name': req.params.Director})
  .then(movie => {
      res.status(201).json(movie.Director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: '+ err);
  });
});

//USER SECTION 
//CRUD options below relate to user collection

// return list of users
app.get('/users', function (req, res) {
//app.get('/users', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.find()
  .then(users => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// adds a new user
app.post('/users', [
  //validation logic
  check('Username', 'Username is required.').not().isEmpty(),
  check('Username', 'Username must be at least 6 characters').isLength({min:6}),
  check('Username', 'Username must be less than 12 characters.').isLength({max:12}),
  check('Username', 'Username must be alphanumeric.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Password', 'Password must be at least 8 characters').isLength({min:8}),
  check('Email', 'Please enter valid email.').isEmail(),
], (req,res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  console.log(req.body.Password);  //debugging
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({Username: req.body.Username})
  .then ((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + ' already exists.');
    } else {
      Users
        .create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Name: req.body.Name,
          Birthday: req.body.Birthday
        })
        .then ((user) => {res.status(201).json(user); })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
     }
   })
   .catch((err) => {
     console.error(err);
     res.status(500).send('Error: ' + err);
   });
});

// gets info for user by username
app.get('/users/:Username', passport.authenticate('jwt', {session: false}), (req,res) => {
  Users.findOne({Username: req.params.Username})
  .then((user) => {
    if (user) {
      res.status(201).json(user);
    } else {
      return res.status(400).send(req.params.Username + ' does not exist.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: '+ err);
  });
});


// changes username by email
app.put('/users/:Username', passport.authenticate('jwt', {session: false}), (req,res) => {
  Users.findOneAndUpdate({Username:req.params.Username}, {$set: {
    Username: req.body.Username,
    Password: req.body.Password,
    Email: req.body.Email
  }},
  {new: true},
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.status(201).json(updatedUser);
    }
  });
});

// deletes a user by username
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username})
    .then((user) => {
      if (user) {
        res.status(201).send('User ' + req.params.Username + ' was deleted.');
      } else {
        res.status(400).send(req.params.Username + ' was not found.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// adds favorite movie to user's list
app.post('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, {
    $addToSet: {FavoriteMovies: req.params.MovieID}
  },
  {new: true},
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// deletes movie from a user's favorite list
app.delete('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, {
    $pull: {FavoriteMovies: req.params.MovieID}
  },
  {new: true},
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
// app.listen('8080', () => {
//    console.log('Listening on Port 8080');
//  });
