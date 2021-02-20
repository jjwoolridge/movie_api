//import express module locally and declares variable to use express for web configuration
const express = require("express"),
  morgan = require('morgan');
const app = express();

let topMovies = [
    {
      title: 'Mission Impossible'
    },
    {
      title: 'Die Hard'
    },
    {
      title: 'Hocus Pocus'
    },
    {
      title: 'Mickey Blue Eyes'
    },
    {
      title: 'Newsies'
    },
    {
      title: 'Star Wars: A New Hope'
    },
    {
      title: 'Thor Ragnarock'
    },
    {
      title: 'Shakespeare in Love'
    },
    {
      title: 'Kingsman'
    },
    {
      title: 'The King\'s Speech'
    },
    {
      title: '12 Strong'
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

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

//listen for requests
app.listen(8080, () => {
  console.log('your app is listening on port 8080');
});
