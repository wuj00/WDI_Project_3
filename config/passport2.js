var express         = require('express'),
    app             = express(),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    bodyParser      = require('body-parser'),
    session         = require('express-session'),
    User = require('../models/User.js'),
    configAuth = require('./auth.js');

// hardcoded users, ideally the users should be stored in a database
var users = [{"id":1234, "email":"downtownpup@yahoo.com", "password":"1234"}];

// passport needs ability to serialize and unserialize users out of session
passport.serializeUser(function (user, done) {
    done(null, users[0].id);
});
passport.deserializeUser(function (id, done) {
    done(null, users[0]);
});

// passport local strategy for local-login, local refers to this app
passport.use('local-login', new LocalStrategy(
    function (username, password, done) {
        if (username === users[0].username && password === users[0].password) {
            return done(null, users[0]);
        } else {
            return done(null, false, {"message": "User not found."});
        }
    })
);

// our strategy for creating users:
passport.use('local-signup', new LocalStrategy({
  // map email and password to passport's default keys
  emailField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done){
  console.log(req)
  console.log(email)
  // check if there's already a matching user:
  User.findOne({'local.email': email}, function(err, user){
    if (err) return done(err)
    // there's a user so don't let them use that email:
    if (user) return done(null, false, req.flash('loginMessage', 'That email is taken.'))
    // create the user, and continue to the corresponding redirect
    var newUser = new User()
    newUser.local.name = req.body.name
    newUser.local.email = email
    newUser.local.password = newUser.generateHash(password)
    newUser.save(function(err){
      if (err) return console.log(err)
      return done(null, newUser, null)
    })
  })
}))

passport.use(new FacebookStrategy({
  clientID: configAuth.facebook.clientID,
  clientSecret: configAuth.facebook.clientSecret,
  callbackURL: configAuth.facebook.callbackURL,
  profileFields: configAuth.facebook.profileFields
}, function(token, refreshToken, profile, done){
    User.findOne({'facebook.id': profile.id}, function(err, user){
      if (err) return done(err)
      if (user) return done(null, user)
      var newUser = new User()
      newUser.facebook.id = profile.id
      newUser.facebook.token = token
      newUser.facebook.name = profile.displayName
      newUser.facebook.email = profile.emails[0].value
      newUser.save(function(err){
        if (err) return console.log(err)
        return done(null, newUser)
      })
    })
}))
module.exports = passport
