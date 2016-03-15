var express = require('express')
var passport = require('passport')
var userRouter = express.Router()
var Spot = require('../models/Spot.js')





userRouter.get('/spots', function(req, res){
  Spot.find({}, function(err, spots){
    res.json(spots)
  })
})

userRouter.post('/spots', function(req, res){
  Spot.create(req.body, function(err, spot){
    if (err) throw err
    res.json({success: true, spot: spot})
  })
})






userRouter.get('/map', isLoggedIn, function(req, res){
  res.render('index', {user: req.user})
})

userRouter.route('/login')
  .get(function(req, res){
    res.render('login', {message: req.flash('loginMessage')})
  })
  .post(passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  }))

userRouter.route('/signup')
  .get(function(req, res){
    res.render('signup', {message: req.flash('loginMessage')})
  })
  .post(passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup'
  }))

userRouter.get('/profile', isLoggedIn, function(req, res){
    res.render('profile', {user: req.user})
})

userRouter.get('/logout', function(req, res){
  req.logout()
  res.redirect('/login')
})

userRouter.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['email']
}))

userRouter.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}))

function isLoggedIn(req, res, next){
  if (req.isAuthenticated()) return next()
  res.redirect('/login')
}

module.exports = userRouter
