var express = require ('express')
var passport = require('passport')
var router = express.Router()

//*********************map route************************************************
router.get('/map', function(req, res){
  res.render('index')
})
//********************login route AND signup************************************
router.get('/login', function(req, res){
  res.render('landing_page', {message: req.flash('loginMessage')})
})
//*****************create session using passport********************************
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/map', //if success go to the map
  failureRedirect: '/login' //if failure, redirect to login
}))
//********************create new user*******************************************
router.post('/signup', passport.authenticate('local-signup', { //submission is being sent to a unique route, where you end up doesn't matter
  successRedirect: '/profile',
  failureRedirect: '/login'
}))
//************************profile route*****************************************
// router.get('/profile', function(req, res){
//   res.render('profile')
// })
//this is the authentication version of the profile route, add that later
router.get('/profile', isLoggedIn, function(req, res){
  res.render('profile', {user: req.user})
})
//this is the authentication version of the map route
//****************************authorized map view*******************************
router.get('/map', isLoggedIn, function(req, res){
  res.render('map', {user: req.user})
})
//****************************logout route**************************************
router.get('/logout', function(req, res){
  req.logout()
  res.redirect('/login')
})
//***********************Part 1 signup route for Facebook Users*****************
router.get('auth/facebook', passport.authenticate('facebook',{
  scope: ['email']
}))
//************************Part 2signup route for Facebook Users*****************
router.get('/auth/facebook/callback', passport.authenticate('facebook',{
    successRedirect: '/profile',
    failureRedirect: '/login'
}))

//**middleware that checks to see if user is logged in and is that user**
//uncomment this when ready to test!
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next()
  res.redirect('/login')
}

module.exports = router
