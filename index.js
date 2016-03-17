var express = require('express')
var app = express()
var ejs = require('ejs')
var ejsLayouts = require('express-ejs-layouts')
var flash = require('connect-flash')
var path = require('path')
var bodyParser = require('body-parser')
var logger = require('morgan')
var mongoose = require('mongoose')
var passport = require('passport')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var routes = require('./routes/main_routes.js')
var passportConfig = require('./config/passport.js')
var multer = require('multer')
var Spot = require('./models/Spot.js')
var Event = require('./models/Event.js')
var User = require('./models/User.js')

// App Constants
var PORT = process.env.PORT || 3000
// var DB_URL = 'mongodb://spotbuds:generalassembly@ds015869.mlab.com:15869/spotbuds'
var LOCAL_DB_URL = 'mongodb://localhost/spot_buds'

// Connect to Mongo DB Via Remote Heroku
mongoose.connect(LOCAL_DB_URL, function(err){
  if(err) return console.log('Cannot connect, weep')
  console.log('Connected to MongoDb, woot!')
})

app.use(express.static(path.join(__dirname, "/public")))

//middleware
app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(session({
  secret: "user secret",
  cookie: {_expires: 6000000},
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize()) //initializes the session duh
app.use(passport.session()) //tells passport to be in charge of the session
app.use(flash()) //there could be flash messages here, use them in the view please!
// app.use(multer({dest:'./uploads/'}))
// ejs configuration
app.set('view engine', 'ejs')
app.use(ejsLayouts)

//root route
app.get('/', function(req, res){
  res.redirect('/login')
})
//app has access to /login, /profile, and /logout because of this
app.use('/', routes)

app.listen(PORT, function(){
  console.log('express server connected and listening on port!', PORT)
})
