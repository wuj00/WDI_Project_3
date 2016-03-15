var mongoose = require('mongoose')
var eventSchema = new mongoose.Schema({
  title: {type: String, required: true},
  time: String,
  how_many_buds: Number,
  specific_location: String,
  going_buds: Number,
  maybe_buds: Number,
  _created_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  _location: {type: mongoose.Schema.Types.ObjectId, ref: 'Spot'}
})

var Event = mongoose.model('Event', eventSchema)

module.exports = Event
