var express = require('express')
var app = express()
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

userRouter.delete('/users/:id', isLoggedIn, function(req,res){
    User.remove({_id: req.params.id}, function(err, user){
      console.log(err)
      res.json(user)
    })
  })

userRouter.get('/spots', function(req, res){
  Spot.find({}).populate('spot_events').exec(function(err, results){
    if (err) throw err
      // console.log(results)
      res.json(results)
  })
})


userRouter.post('/spots', function(req, res){
  Spot.create(req.body, function(err, spot){
    if (err) throw err
    // console.log(spot, 'this is spot')
    // console.log(req.body.spot_location, 'this is spot loc')
    res.json({success: true, spot: spot})
  })
})

userRouter.get('/spots/:id', function(req, res){
  Spot.findOne({spot_location: req.params.id}).populate('spot_events').exec(function(err, spot){
    if (err) throw err
    if (req.user.local.email) {
      res.json({spot: spot, photo: req.user.local.email})
    } else if (req.user.facebook.email) {
      res.json({spot: spot, photo: req.user.facebook.email})
    }
  })
})

userRouter.get('/events', function(req, res){
  Event.find({}, function(err, events){
    res.json(events)
  })
})

userRouter.patch('/events/:id', function(req, res){
  Event.findOne({_id: req.params.id}).exec(function(err, event){
    if (err) throw err
    // console.log(event, 'this is the event')
    // console.log(req.body, 'this is body')
    // console.log(req.body.going, 'going val con')
    // console.log(req.body.maybe, 'maybe val con')
    // console.log(event.going_buds, 'going buds count yo')
    // console.log(Number(event.how_many_buds), 'this is how many poeple limit')
    if (req.user.local.name === event.spot_author || req.user.facebook.name === event.spot_author) {
      console.log('loading rsvp profiles.....')
      if (req.body.going) {
        Event.findOne({_id: event._id}).populate('going_buds_users').exec(function(err, users){
          res.json({users: users, message: 'show-users-going'})
        })
      } else if (req.body.maybe) {
        Event.findOne({_id: event._id}).populate('maybe_buds_users').exec(function(err, users){
          //console.log('all maybe rsvps')
          users.maybe_buds_users.forEach(function(user){
            if (user.local.name) {
              console.log('local:', user.local.name)
            } else if (user.facebook.name) {
              console.log('facebook:', user.facebook.name)
            }
          })
          res.json({users: users, message: 'show-maybe-users'})
        })
      } else {
        console.log('something went wrong')
        res.json({message: 'no go, user cannot rsvp to their own event.'})
      }
    } else {

    if (req.body.going === true) {
      if (event.how_many_buds !== '6+' && (event.going_buds < Number(event.how_many_buds))) {
        // console.log(event.going_buds_users, 'this is the length')
        if (event.going_buds_users.indexOf(req.user._id) === -1 && event.maybe_buds_users.indexOf(req.user._id) === -1) {
          event.going_buds_users.push(req.user._id)
          event.going_buds += 1
          event.save(function(err, data){
            if (err) throw err
            res.json({message: 'going went up 1', data: data})
          })
        } else if (event.going_buds_users.indexOf(req.user._id) !== -1 && event.maybe_buds_users.indexOf(req.user._id) === -1){
          event.going_buds = event.going_buds
          event.save(function(err, data){
            if (err) throw err
            res.json({message: 'going equal going stays the same', data: data})
          })
        }
        else if (event.going_buds_users.indexOf(req.user._id) === -1 && event.maybe_buds_users.indexOf(req.user._id) !== -1) {
          event.maybe_buds_users.splice(event.maybe_buds_users.indexOf(req.user._id), 1)
          event.going_buds_users.push(req.user._id)
          event.maybe_buds -= 1
          event.going_buds += 1
          event.save(function(err, data){
            if (err) throw err
            res.json({message: 'maybe went down 1 and going went up one', data: data})
          })
        }
        else if (event.maybe_buds_users.indexOf(req.user._id) !== -1 && event.going_buds_users.indexOf(req.user._id) !== -1) {
          event.maybe_buds_users.splice(event.maybe_buds_users.indexOf(req.user._id), 1)
          event.maybe_buds -= 1
          event.save(function(err, data){
            if (err) throw err
            res.json({message: 'maybe went down 1 and going went up one', data: data})
          })
        } else {
          res.json({message: 'nope on going add', event_ob: event})
        }
      } else if (event.how_many_buds !== '6+' && (event.going_buds >= Number(event.how_many_buds))) {
        res.json({message: 'limit maxed out no more rsvp for going.', event_ob: event})
      } else if (event.how_many_buds === '6+') {
        if (event.going_buds_users.indexOf(req.user._id) === -1 && event.maybe_buds_users.indexOf(req.user._id) === -1) {
          event.going_buds_users.push(req.user._id)
          event.going_buds += 1
          event.save(function(err, data){
            if (err) throw err
            res.json({message: 'going went up 1', data: data})
          })
        } else if (event.going_buds_users.indexOf(req.user._id) !== -1 && event.maybe_buds_users.indexOf(req.user._id) === -1){
          event.going_buds = event.going_buds
          // event.going_buds_users.splice(event.going_buds_users.indexOf(req.user._id), 1)
          // event.maybe_buds_users.push(req.user._id)
          // event.maybe_buds += 1
          // event.going_buds -= 1
          event.save(function(err, data){
            if (err) throw err
            res.json({message: 'going equal going stays the same', data: data})
          })
        }
        else if (event.going_buds_users.indexOf(req.user._id) === -1 && event.maybe_buds_users.indexOf(req.user._id) !== -1) {
          event.maybe_buds_users.splice(event.maybe_buds_users.indexOf(req.user._id), 1)
          event.going_buds_users.push(req.user._id)
          event.maybe_buds -= 1
          event.going_buds += 1
          event.save(function(err, data){
            if (err) throw err
            res.json({message: 'maybe went down 1 and going went up one', data: data})
          })
        }
        else if (event.maybe_buds_users.indexOf(req.user._id) !== -1 && event.going_buds_users.indexOf(req.user._id) !== -1) {
          event.maybe_buds_users.splice(event.maybe_buds_users.indexOf(req.user._id), 1)
          event.maybe_buds -= 1
          event.save(function(err, data){
            if (err) throw err
            res.json({message: 'maybe went down 1 and going went up one', data: data})
          })
        } else {
          res.json({message: 'nope on going add', event_ob: event})
        }

      }


    } else if (req.body.maybe === true) {
      if (event.going_buds_users.indexOf(req.user._id) === -1 && event.maybe_buds_users.indexOf(req.user._id) === -1) {
        event.maybe_buds_users.push(req.user._id)
        event.maybe_buds += 1
        event.save(function(err, data){
          if (err) throw err
          res.json({message: 'maybe went up 1', data: data})
        })
      }
      else if (event.maybe_buds_users.indexOf(req.user._id) === -1 && event.going_buds_users.indexOf(req.user._id) !== -1){
        // console.log(req.user._id, '<<<< this is what req user _id is')
        // console.log(req.user, '<<< this is what req user is')
        // console.log(req.params.id, '<<< this is the params id that what given from ajax call')
        // event.going_buds_users.forEach(function(el, i){
        //   console.log(el, '<<<< element', i, '<< index in array', 'this is the user and its id right next to each other')
        // })
        // console.log(event.going_buds_users.indexOf(req.user._id), ' <<<<<<<<<====== this is the index of user in going buds array maybe array is 0 and going arr is not 0')
        // console.log(event.going_buds_users, ' <<<< this is all the users in the going buds users array')
        // console.log(event.maybe_buds_users, ' <<<< this is all the users in the maybe buds users array')
        event.going_buds_users.splice(event.going_buds_users.indexOf(req.user._id), 1)
        event.maybe_buds_users.push(req.user._id)
        event.maybe_buds += 1
        event.going_buds -= 1
        event.save(function(err, data){
          if (err) throw err
          res.json({message: 'maybe went up 1 and going went down one', data: data})
        })
      }
      else if (event.maybe_buds_users.indexOf(req.user._id) !== -1 && event.going_buds_users.indexOf(req.user._id) === -1) {
        event.maybe_buds = event.maybe_buds
        event.save(function(err, data){
          if (err) throw err
          res.json({message: 'maybe stays the same', data: data})
        })
      }
      else if (event.maybe_buds_users.indexOf(req.user._id) !== -1 && event.going_buds_users.indexOf(req.user._id) !== -1) {
        // console.log(event.going_buds_users.indexOf(req.user._id), ' <<<<<<<<<====== this is the index of user in going buds array')
        // console.log(event.going_buds_users, ' <<<< this is all the users in the going buds users array')
        event.going_buds_users.splice(event.going_buds_users.indexOf(req.user._id), 1)
        event.going_buds -= 1
        event.save(function(err, data){
          if (err) throw err
          res.json({message: 'maybe went up 1 and going went down one', data: data})
        })
      } else {
        res.json({message: 'nope on maybe add', event_ob: event})

      }

    }
  }
  })
})


userRouter.post('/events', isLoggedIn, function(req, res){
  //console.log(req.body.spot_location)
  User.findOne({_id: req.user._id}, function(err, user){
    Spot.findOne({spot_location: req.body.spot_location}).populate('spot_events').exec(function(err, spot){
      //console.log(spot, 'this is spot')
      if (user.local.email) {
        var newEvent = new Event({_created_by: user._id, _location: spot._id, title: req.body.title, description: req.body.description, time: req.body.time, how_many_buds: req.body.how_many_buds, specific_location: req.body.specific_location, photo: req.user.local.email, spot_author: req.user.local.name})

      } else if (user.facebook.email) {
        var newEvent = new Event({_created_by: user._id, _location: spot._id, title: req.body.title, description: req.body.description, time: req.body.time, how_many_buds: req.body.how_many_buds, specific_location: req.body.specific_location, photo: req.user.facebook.email, spot_author: req.user.facebook.name})

      }
      newEvent.save(function(err, new_event){
        //console.log(new_event, '<<<<<<< this is what the new event is')
        req.user.user_events.push(new_event)
        req.user.save(function(){
          spot.spot_events.push(new_event)
          spot.save(function(err, spotSave){
            if (user.local.email) {
              res.json({message: 'it worked', success: true, the_event: new_event, the_spot: spotSave, photo: req.user.local.email})

            } else if (user.facebook.email) {
              res.json({message: 'it worked', success: true, the_event: new_event, the_spot: spotSave, photo: req.user.facebook.email})

            }
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
    failureRedirect: '/login',
    failureFlash: true
  }))

userRouter.route('/signup')
  .get(function(req, res){
    res.render('signup', {message: req.flash('loginMessage')})
  })
  .post(passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
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
