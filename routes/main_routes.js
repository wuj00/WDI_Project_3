var express = require ('express')
var router = express.Router()

router.get('/map', function(req, res){
  res.render('index')
})

router.get('/login', function(req, res){
  res.render('landing_page')
})

router.get('/profile', function(req, res){
  res.render('profile')
})

module.exports = router
