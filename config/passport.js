const environment = process.env.NODE_ENV || "development"
const configuration = require("../knexfile")[environment]
const database = require('knex')(configuration)
const LocalStrategy   = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Admin            = require('../lib/models/admin');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {
        process.nextTick(function() {
            Admin.findOne({ 'local.username' :  username }, function(err, user) {
                if (err)
                    console.log("Here at passport.js line 30")
                    return done(err);
                if (user) {
                    console.log("Here at passport.js line 33")
                    return done(null, false);
                } else {
                    console.log("Here at passport.js line 36")
                    const newUser            = new Admin();
                    newUser.username    = username;
                    const hash = bcrypt.hashSync(password, saltRounds);
                    newUser.password = hash;
                    newUser.save(function(err) {
                        if (err)
                            console.log("Here at passport.js line 43")
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
};