const mongoose = require("mongoose");

const db = async () => {
    try {
         connectionParams = {
            useNewUrlParser:true,
            useUnifiedTopology:true
        }

      await  mongoose.connect("mongodb+srv://anuragmk10:Y89VPuERQBPxB6PM@event-management.gbex6vc.mongodb.net/?retryWrites=true&w=majority",connectionParams)
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Database connection failed".error)
    }
}

module.exports = db