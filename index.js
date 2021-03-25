//import express module locally and declares variable to use express for web configuration
const express = require("express"),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose');

const app = express();

const Models = require('./models.js');

const Movies=Models.Movie;
const Users=Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB',{useNewUrlParser:true, useUnifiedTopology:true});
mongoose.set('useFindAndModify', false);

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('didn\'t work');
});


//GET requests
app.get('/', (req, res) => {
  res.send('you found the landing page');
});

// return list of movies
app.get('/movies', (req, res) => {
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
app.get('/movies/:Title', (req, res) => {
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
app.get('/movies/:Title/description', (req,res) => {
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
app.get('/movies/:Title/director/', (req,res) => {
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
app.get('/movies/genre/:Genre/', (req,res) => {
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
app.get('/movies/director/:Director/', (req,res) => {
  Movies.findOne({'Director.Name': req.params.Director})
  .then(movie => {
      res.status(201).json(movie.Director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: '+ err);
  });
});

// return list of users
app.get('/users', (req, res) => {
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
app.post('/users', (req,res) => {
  Users.findOne({Username: req.body.Username})
  .then ((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + ' already exists.');
    } else {
      Users
        .create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        .then ((user) => {res.status(201).json(user) })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      })
     }
   })
   .catch((err) => {
     console.error(err);
     res.status(500).send('Error: ' + err);
   });
});

// gets info for user by username
app.get('/users/:Username', (req,res) => {
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
app.put('/users/:Username', (req,res) => {
  Users.findOneAndUpdate({Username:req.params.Username}, {$set: {
    Username: req.body.Username,
    Password: req.body.Password,
    Email: req.body.Password
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
app.delete('/users/:Username', (req, res) => {
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
app.post('/users/:Username/favorites/:MovieID', (req, res) => {
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
app.delete('/users/:Username/favorites/:MovieID', (req, res) => {
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
  })
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});
