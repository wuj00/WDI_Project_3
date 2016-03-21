//this is where the facebook OAuth Information goes
var dotenv = require('dotenv').config({silent: true})
module.exports = {
  'facebook':{
    'clientID':'966966436690708', //taken from my developer dashboard for the app
    'clientSecret': '833b8dd984224a9d4fb06f0aa460411f',
    'callbackURL': 'http://localhost:3000/auth/facebook/callback' || 'https://spot-buds.herokuapp.com/auth/facebook/callback',
    'profileFields': ['emails', 'displayName']
  }
}

// https://spot-buds.herokuapp.com/auth/facebook/callback
// http://localhost:3000/auth/facebook/callback
