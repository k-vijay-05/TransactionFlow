const express = require("express");
const cors=require("cors");
const mongoose = require("mongoose");
const rootRoute = require("./routes/index");
require('dotenv').config();
app.use(cors());

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
app.use('/api/vi',rootRoute);

connectDb();
app.listen(3000, () => {
    console.log("server is running");
})