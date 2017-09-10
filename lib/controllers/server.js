const passport = require('passport')
const DropboxOAuth2Strategy = require('passport-dropbox-oauth2').Strategy
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const environment = process.env.NODE_ENV || "development"
const configuration = require("../../knexfile")[environment]
const database = require('knex')(configuration)
const cors = require('cors')

const baseAPI = '/api/v1';

const Admin = require('../models/admin')

require('./routes.js')(app, passport);
require('../../config/passport')(passport);

app.set('port', process.env.PORT || 3000)

app.locals.title = '3DQueue'
app.use(cors())

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({secret: 'our secret string'}));
app.use(cookieParser());

app.use(flash());

// ******************************
//        ADMIN ACCOUNTS
// ******************************
app.get(baseAPI + '/admins', (request, response) => {
  database.raw("SELECT id, username, password, created_at FROM admins")
    .then((data) => {
      if (data.rows.length < 1) {
        return response.sendStatus(404)
      } else {
        response.json(data.rows)
      }
    })
});

// THE FOLLOWING POST PATH WAS WORKING TO CREATE A NEW ADMIN
// COMMENTING IT OUT TO PURSUE PASSPORT AND BCRYPT TUTORIAL IN ROUTES.JS
app.post(baseAPI + '/admins', passport.authenticate('local-signup', {
  successRedirect : 'https://charliecorrigan.github.io/3dqueue/admin/dashboard', // redirect to the secure profile section
  failureRedirect : 'https://charliecorrigan.github.io/3dqueue/signup.html'
  // if (!foodParams || !foodParams.name || !foodParams.calories){
  //   return response.sendStatus(422)
  // } else {
  //   Food.create(foodParams)
    // .then((data) =>{
    //   console.log(data)
    //   response.status(201)
    // })
  // }
}))


// ******************************
//      DROPBOX OAUTH
// ******************************

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.use(new DropboxOAuth2Strategy({
  apiVersion: '2',
  clientID: 'SECRET',
  clientSecret: 'SECRET',
  callbackURL: "http://localhost:3000/auth/dropbox/callback"
},

function(accessToken, refreshToken, profile, done) {
  console.log("Here is the token:")
  console.log(accessToken)
  return done(null, profile)
  // User.findOrCreate({ providerId: profile.id }, function (err, user) {
  //   return done(err, user);
  // });
  // done();
}
));

app.get('/auth/dropbox',
  passport.authenticate('dropbox-oauth2'));

app.get('/auth/dropbox/callback', passport.authenticate('dropbox-oauth2', { failureRedirect: '/login' }),
function(req, res) {
  console.log("Seriously. WTF")
  // Successful authentication, redirect home.
  res.redirect('/');
});
// I commented this route out because I moved it to routes.js
// app.get('/', function(request, response) {
//   console.log("we made it to the redirect!")
//   response.redirect('https://charliecorrigan.github.io/3dqueue')
//   response.send('Backend is up and running!')
// })

// ******************************
//      RUN SERVER
// ******************************

if (!module.parent) {
  app.listen(app.get('port'), function() {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}