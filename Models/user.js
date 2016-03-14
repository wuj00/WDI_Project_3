var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
var Schema = mongoose.Schema

var userSchema = new Schema({
  local: {
    username: String,
    email: String,
    password: String,
    description: String
  },
  facebook: { //facebook stratgey - passwords already exist, we need their fb id
    id: String,
    username: String,
    token: String, //
    email: String,
    description: String
  }
})
userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

userSchema.methods.generateHash = function(password){
  return bcrypt.compareSync(password, this.local.password)
}

var User = mongoose.model('User', userSchema)

module.exports = User
