const express = require("express");
const app = express()
const PORT = 8080;
const userRouter = require("./routes/userRouter");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./config/connection");
const eventRouter = require("./routes/eventRouter");

db(()=>{
    try {
       console.log("Database connected successfully"); 
    } catch (error) {
        console.log("Database connection failed",error);
    }    
});    

app.use(bodyParser.json());
app.use(cors());

app.use("/api",userRouter);
app.use("/api/event",eventRouter)
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
  });
