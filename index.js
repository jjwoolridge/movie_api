//import express module locally and declares variable to use express for web configuration
const express = require("express"),
  morgan = require('morgan'),
  bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

let users = [
  {
    username: 'jwoolridge',
    useremail: 'jyoti.pferd@gmail.com',
    favorites: []
  },
  {
    username: 'anewman',
    useremail: 'alex123@gmail.com',
    favorites: []
  }
];

let topMovies = [
    {
      title: 'Mission Impossible',
      description: 'action',
      director: {
        name: '',
        bio: '',
        birth_year: '',
        death_year:''
      }
    },
    {
      title: 'Die Hard',
      description: 'action',
      director: {
        name: '',
        bio: '',
        birth_year: '',
        death_year:''
      }
    },
    {
      title: 'Hocus Pocus',
      description: 'action',
      director: {
        name: '',
        bio: '',
        birth_year: '',
        death_year:''
      }
    },
    {
      title: 'Mickey Blue Eyes',
      description: 'action',
      director: {
        name: '',
        bio: '',
        birth_year: '',
        death_year:''
      }
    },
    {
      title: 'Newsies',
      description: 'action',
      director: {
        name: '',
        bio: '',
        birth_year: '',
        death_year:''
      }
    },
    {
      title: 'Star Wars: A New Hope',
      description: 'action',
      director: {
        name: '',
        bio: '',
        birth_year: '',
        death_year:''
      }
    },
    {
      title: 'Thor Ragnarock',
      description: 'action',
      director: {
        name: '',
        bio: '',
        birth_year: '',
        death_year:''
      }
    },
    {
      title: 'Shakespeare in Love',
      description: 'action',
      director: {
        name: '',
        bio: '',
        birth_year: '',
        death_year:''
      }
    },
    {
      title: 'Kingsman',
      description: 'action',
      director: {
        name: '',
        bio: '',
        birth_year: '',
        death_year:''
      }
    },
    {
      title: 'The King\'s Speech',
      description: 'action',
      director: {
        name: '',
        bio: '',
        birth_year: '',
        death_year:''
      }
    },
    {
      title: '12 Strong',
      description: 'action',
      director: {
        name: '',
        bio: '',
        birth_year: '',
        death_year:''
      }
    }
];

app.use(morgan('common'));
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
  res.json(topMovies);
});

// gets details for a movie
app.get('/movies/:title', (req,res) => {
  res.json(topMovies.find((movie) =>
    { return movie.title === req.params.title }));
});

// gets all movies matching a genre
app.get('/movies/:title/description', (req,res) => {
  res.send('will return description of a movie');
});

// gets details of a director of a movie
app.get('/movies/director/:name', (req,res) => {
  res.send('Returns a JSON object with Key:Object pairs of Director\'s info');
});

// adds a new user
app.post('/users', (req,res) => {
  let newUser = req.body;
  console.log(newUser);
// fix this to find a way if a user already exists
  let userExists = false;
  //figure out how to see if username exists ... forEach users.username?
  if (userExists) {
    const message1 = 'User already exists';
    res.status(400).send(message1);
//  makes sure name is included
  } else if(!newUser.username) {
     const message2 = 'No username specified';
     res.status(400).send(message2);
  } else {
    users.push(newUser);
    console.log(newUser);
    res.status(201).send(newUser);
  }
});

// changes username
app.put('/users/:useremail/:username', (req,res) => {

  let userExists = users.find((userExists) => {return userExists.useremail === req.params.useremail})

  if (userExists) {
    userExists.username = req.params.username;
    res.status(201).send('Username for ' + req.params.useremail + ' updated to ' + req.params.username);
  } else {
    res.status(404).send('Email ' + req.params.useremail + ' not found.');
  }
});

// deletes a user by username
app.delete('/users/:username', (req, res) => {
  let user = users.find((user) => { return user.username === req.params.username});
  if (user) {
    users = users.filter((obj) => { return obj.username !== req.params.username});
    res.status(201).send('User ' + req.params.username + ' was deleted.');
  }
});

// adds favorite movie to user's list
app.put('/users/:username/favorites/:movie', (req, res) => {
  let user = users.find((user) => {return user.username === req.params.username});
  if (user) {
    user.favorites.push(req.params.movie);
    res.status(201).send('Added movie ' + req.params.movie + ' to favorites list for ' + req.params.username);
  } else {
    res.status(404).send('User was not found.');
  }
});

// deletes movie from a user's favorite list
app.delete('/users/:username/favorites/:movie', (req, res) => {
  res.send('deletes movie from user\'s favorites and sends confirm or deny');
  // let user = users.find((user) => { return user.username === req.params.username});
  // if (user) {
  //   users = user.filter((obj) => { return obj.username !== req.params.username});
  //   res.status(201).send('User ' + req.params.username + ' was deleted.');
  // }
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});
