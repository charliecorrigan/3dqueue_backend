const passport = require('passport')
const DropboxOAuth2Strategy = require('passport-dropbox-oauth2').Strategy
var express = require('express')
var app = express()
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

app.set('port', process.env.PORT || 3000)
app.locals.title = '3DQueue'
app.use(passport.initialize());
app.use(passport.session());
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

app.get('/auth/dropbox/callback', 
passport.authenticate('dropbox-oauth2', { failureRedirect: '/login' }),
function(req, res) {
  console.log("Seriously. WTF")
  // Successful authentication, redirect home.
  res.redirect('/');
});

app.get('/', function(request, response) {
  console.log("we made it to the redirect!")
  response.redirect('https://charliecorrigan.github.io/3dqueue')
  response.send('Backend is up and running!')
})

if (!module.parent) {
  app.listen(app.get('port'), function() {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}