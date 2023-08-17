const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        requried:true
    },
    createdEvents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Event'
    }],
    eventInvitations: [{
        eventId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Event'
        },
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        status:{
          type:Boolean,
          default:false
        }
       
      }]
})

const User = mongoose.model("User",userSchema);

module.exports = User; 