var express = require('express')
var app = express()
var dotenv = require('dotenv').config({silent: true})
var path = require('path')
var ejs = require('ejs')
var ejsLayouts = require('express-ejs-layouts')
var flash = require('connect-flash')
var bodyParser = require('body-parser')
var logger = require('morgan')
var mongoose = require('mongoose')
var passport = require('passport')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var papercut = require('papercut')
// var Alleup = require('alleup')
// var alleup = new Alleup({storage : "aws", config_file: "uploads.json"})
var routes = require('./routes/main_routes.js')
var passportConfig = require('./config/passport.js')
var Spot = require('./models/Spot.js')

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




PAPERCUT CONFIG:
papercut.configure(function(){
  papercut.set('storage', 'file')
  papercut.set('directory', path.join(__dirname, '/tmp'))
  papercut.set('url', '/tmp')
});

papercut.configure('production', function(){
  papercut.set('storage', 's3')
  papercut.set('S3_KEY', process.env.S3_KEY)
  papercut.set('S3_SECRET', process.env.S3_SECRET)
  papercut.set('bucket', 'spotbuds')
});

AvatarUploader = papercut.Schema(function(schema){
  schema.version({
    name: 'avatar',
    size: '200x200',
    process: 'crop'
  });

  schema.version({
    name: 'small',
    size: '50x50',
    process: 'crop'
  });
});

app.get('/test/photoupload', function(req,res){
  res.render('avatar')
})

app.post('/test/photoupload', function(req,res){
  // posting route (use papercut upload method here)
  
})


//app has access to /login, /profile, and /logout because of this
app.use('/', routes)







app.listen(3000, function(){
  console.log('express server connected and listening on port 3000!')
})
