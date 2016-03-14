//this is the authentication file that contains the meat of the authentication
//and validation code

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy
var User = require('../models/user.js')
var configAuth = require('../models/auth.js')
