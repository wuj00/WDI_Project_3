//this is the authentication file that contains the meat of the authentication
//and validation code

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy
var User = require('../models/user.js')
// var configAuth = require('../models/auth.js')

passport.serializeUser(function(user, done){
  done(null, user.id)
})

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user)
  })
})

//**************************local sign up***************************************
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done){
    User.findOne({'local.email': email}, function(err, user){
      if(err) return done(err)
      if(user) return done(null, false, req.flash('signupMessage', 'That email is taken'))
      var newUser = new User()
      // newUser.local.username = req.body.username
      newUser.local.email = email
      newUser.local.password = newUser.generateHash(password)
      newUser.save(function(err){
        if(err) return console.log(err)
        return done(null, newUser, null)
    })
  })
}))
//**********************local login strategy************************************
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done){
  User.findOne({'local.email': email}, function(err, user){
    if(err) return done(err)
    if(!user) return done(null, false, req.flash('loginMessage'), "No user found...")
    if(!user.validPassword(password)) return done(null, calse, req.flash('loginMessage', "Incorrect Password"))
    return done(null, user)
 })
}))

module.exports = passport
