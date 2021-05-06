const jwtSecret = 'your_jwt_secret'; // must be same key used in JWTStrategy in passport.js

const jwt = require('jsonwebtoken'),
  passport = require('passport'),
  bodyParser = require('body-parser');

app.use(bodyParser.json());

require('./passport'); //local passport file

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, //username being encoded into JWTStrategy
    expiresIn: '7d', // token will expire in 7 days
    algorithm: 'HS256' // algorithm to "sign" aka encode values of JWT
  });
}

/* POST login */
module.exports = (router) => {
  router.post('/login', (req,res) => {
    passport.authenticate('local', {session: false}, (error, user, info) => {
      console.log(req.body + 'router post ./login');
      console.log(user + 'router post ./login');
      if(error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, {session: false}, (error) => {
        if(error) {
          res.send(error + 'router api error /login');
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({user,token});
      });
    })(req,res);
  });
}
