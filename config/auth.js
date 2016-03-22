//this is where the facebook OAuth Information goes
var dotenv = require('dotenv').config({silent: true})
module.exports = {
  'facebook':{
    'clientID': process.env.FACEBOOK_CLIENT_ID,
    'clientSecret': process.env.FACEBOOK_CLIENT_SECRET,
    'callbackURL': 'http://localhost:3000/auth/facebook/callback' || 'https://fathomless-tundra-33285.herokuapp.com/auth/facebook/callback',
    'profileFields': ['emails', 'displayName']
  }
}

// https://spot-buds.herokuapp.com/auth/facebook/callback
// http://localhost:3000/auth/facebook/callback
