const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const app=express()
app.use(express.json())
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("mongodb connected succesfully");
    }
    catch (err) {
        console.log(err);
    }

};
connectDb();
app.listen(3001, () => {
    console.log("server is running");
})