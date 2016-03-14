var express = require('express')
var ejs = require('ejs')
var expressLayouts = require('express-ejs-layouts')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var passport = require('passport')
var routes = require('./routes/main_routes.js')

var app = express()

// ejs configuration
app.set('view engine', 'ejs')
app.use(expressLayouts)



app.use('/', routes)

app.get('/map', function(req, res){
  res.render('index')
})

app.listen(3000, function(){
  console.log('express server connected and listening on port 3000!')
})
