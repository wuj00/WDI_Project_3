var mongoose = require('mongoose')

var spotSchema = new mongoose.Schema({
  spot_location: {type: String, required: true, unique: true},
  spot_events: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}]
})

var Spot = mongoose.model('Spot', spotSchema)

module.exports = Spot
