var express = require('express')
var passport = require('passport')
var userRouter = express.Router()
var Spot = require('../models/Spot.js')
var Event = require('../models/Event.js')
var User = require('../models/User.js')
var multer = require('multer')


userRouter.get('/users', function(req, res){
  User.find({}).populate('user_events').exec(function(err, results){
    if (err) throw err
    res.json(results)
  })
})

userRouter.patch('/users/:id', function(req, res){
  console.log(req)
  User.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, function(err, user){
    if(err) console.log(err)
    res.json({success: true, user: user})
    console.log(user)
  })
})

userRouter.get('/users/:id', isLoggedIn, function(req, res){
  User.findOne({_id: req.user._id}, function(err, user){
    if(err) throw err
    res.json(user)
  })
})

userRouter.get('/spots', function(req, res){
  Spot.find({}).populate('spot_events').exec(function(err, results){
    if (err) throw err
      console.log(results)
      res.json(results)
  })
})

userRouter.post('/spots', function(req, res){
  Spot.create(req.body, function(err, spot){
    if (err) throw err
    res.json({success: true, spot: spot})
  })
})

userRouter.get('/events', function(req, res){
  Event.find({}, function(err, events){
    res.json(events)
  })
})


userRouter.post('/events', isLoggedIn, function(req, res){
  console.log(req.body.spot_location)
  User.findOne({_id: req.user._id}, function(err, user){
    Spot.findOne({spot_location: req.body.spot_location}, function(err, spot){
      console.log(spot, 'this is spot')

      var newEvent = new Event({_created_by: user._id, _location: spot._id, title: req.body.title, description: req.body.description, time: req.body.time, how_many_buds: req.body.how_many_buds, specific_location: req.body.specific_location})
      newEvent.save(function(err, new_event){
        console.log(new_event, 'this is what user returns')
        req.user.user_events.push(new_event)
        req.user.save(function(){
          spot.spot_events.push(new_event)
          spot.save(function(){
            res.json({message: 'it worked', success: true})
          })
        })
      })
    })
  })
})

// Flow for creating an event
// 1. find the current user with session cookie
// 2. find the spot using the request params spot id
// 3. create the event from form data with the user id and spot id and title
// 4. save the created event
// 5. on save push the new event into the user's user_events
// 6. save the user
// 7. on saving of the user, push the new event into the spot's spot_events
// 8. save the spot
// 9. respond with json or render


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
