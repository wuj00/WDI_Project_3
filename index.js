var express = require('express')
var app = express()
var ejs = require('ejs')
var ejsLayouts = require('express-ejs-layouts')
var flash = require('connect-flash')
var bodyParser = require('body-parser')
var logger = require('morgan')
var mongoose = require('mongoose')
var passport = require('passport')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var routes = require('./routes/main_routes.js')
var passportConfig = require('./config/passport.js')
var Spot = require('./models/Spot.js')
var Event = require('./models/Event.js')
var User = require('./models/User.js')

mongoose.connect('mongodb://localhost/spot_buds', function(err){
  if(err) return console.log('Cannot connect, weep')
  console.log('Connected to MongoDb, woot!')
})

//middleware
app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(session({
  secret: "user secret",
  cookie: {_expires: 6000000}
}))
app.use(passport.initialize()) //initializes the session duh
app.use(passport.session()) //tells passport to be in charge of the session
app.use(flash()) //there could be flash messages here, use them in the view please!

// ejs configuration
app.set('view engine', 'ejs')
app.use(ejsLayouts)

//app has access to /login, /profile, and /logout because of this
app.use('/', routes)

app.listen(3000, function(){
  console.log('express server connected and listening on port 3000!')
})
