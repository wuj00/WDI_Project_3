var express = require('express')
var ejs = require('ejs')
var expressLayouts = require('express-ejs-layouts')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var passport = require('passport')

var app = express()

// ejs configuration
app.set('view engine', 'ejs')
app.use(expressLayouts)

app.get('/', function(req, res){
  res.render('profile')
})

app.get('/login', function(req, res){
  res.render('landing_page')
})

app.listen(3000, function(){
  console.log('express server connected and listening on port 3000!')
})
