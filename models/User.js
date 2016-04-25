// this file should be uppercase
var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
var Schema = mongoose.Schema

var user_schema = new Schema({
  local: {
    name: String,
    email: String,
    password: String
  },
  facebook: {
    id: String,
    name: String,
    token: String,
    email: String
  },
  user_events: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
  description: String,
})

// user_schema.pre('save', function(next) {
//     var user = this;
//     // only hash the password if it has been modified (or is new)
//     if (!user.isModified('password')) return next();
//     // generate a salt
//     bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//         if (err) return next(err);
//         // hash the password using our new salt
//         bcrypt.hash(user.password, salt, function(err, hash) {
//             if (err) return next(err);
//             // override the cleartext password with the hashed one
//             user.password = hash;
//             next();
//         });
//     });
// });
//
// user_schema.methods.comparePassword = function(password, callBack) {
//     bcrypt.compare(password, this.password, function(err, isMatch) {
//         if (err) return cb(err);
//         callBack(null, isMatch);
//     });
// };

user_schema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

user_schema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password)
}


var User = mongoose.model("User", user_schema)

module.exports = User
