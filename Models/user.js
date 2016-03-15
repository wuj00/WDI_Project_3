var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
var Schema = mongoose.Schema

var user_schema = new Schema({
  local: {
    name: String,
    email: String,
    password: String,
    description: String
  },
  facebook: {
    id: String,
    name: String,
    token: String,
    email: String,
    decription: String
  }
})

user_schema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

user_schema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password)
}

var User = mongoose.model("User", user_schema)

module.exports = User
