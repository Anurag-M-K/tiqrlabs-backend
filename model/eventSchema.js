const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  place:{
    type :String ,
    required:true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  image: {
    type: String, // You can change this to ObjectId if storing reference to image in another collection
    
},
  // Add other event fields as needed
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
