var mongoose = require('mongoose')
var eventSchema = new mongoose.Schema({
  title: {type: String, required: true},
  spot_author: String,
  photo: String,
  description: String,
  time: String,
  how_many_buds: Number,
  specific_location: String,
  going_buds: {type: Number, default: 0},
  maybe_buds: {type: Number, default: 0},
  _created_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  _location: {type: mongoose.Schema.Types.ObjectId, ref: 'Spot'}
})

var Event = mongoose.model('Event', eventSchema)

module.exports = Event
