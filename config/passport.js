// load all the things we need
const environment = process.env.NODE_ENV || "development"
const configuration = require("../knexfile")[environment]
const database = require('knex')(configuration)
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var Admin            = require('../lib/models/admin');

// expose this function to our app using module.exports
module.exports = function(passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
        console.log("HOLY SHIT WE ARE FINALLY TROUBLESHOOTING PASSPORT")
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        database.raw("SELECT * FROM admins WHERE username=(?)", [username])
        .then((data) => {
          if (data.rows < 1) {
            console.log("This user wasn't in the database")
            database.raw(`INSERT INTO admins (username, password, created_at)
            VALUES  (?, ?, ?) RETURNING *`,
            [username, password, new Date])
          } else {
            console.log("This username is taken")
          }
        })
        // Admin.findOne({ 'local.username' :  username }, function(err, user) {
        //     // if there are any errors, return the error
        //     if (err)
        //         return done(err);

        //     // check to see if theres already a user with that email
        //     if (user) {
        //         return done(null, false);
        //     } else {

        //         // if there is no user with that email
        //         // create the user
        //         var newUser            = new Admin();

        //         // set the user's local credentials
        //         newUser.local.username    = username;
        //         newUser.local.password = newUser.generateHash(password);

        //         // save the user
        //         newUser.save(function(err) {
        //             if (err)
        //                 throw err;
        //             return done(null, newUser);
        //         });
        //     }

        // });    

        });

    }));

};