const express=require('express');
const router=express.Router();
const zod =require("zod")
const jwt=require("jsonwebtoken")
const {User} =require("../models/db")
const {JWT_SECRET}=require("../config")
const signupbody=zod.object({
    username:zod.string().email(),
    firstName:zod.string(),
    lastName:zod.string(),
    password:zod.string()
});
router.post('/signup',async(req,res)=>{
    const {success}=signupbody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Incorrect inputs"
        })
    }
    const existinguser=await User.findOne({
        username:req.body.username
    })
    if(existinguser){
        return res.status(411).json({
            message:"Email already exists"
        })
    }
    const user=await User.create({
        username:req.body.username,
        password:req.body.password,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
    })
    const userId=user._id;
    const token =jwt.sign({
        userId,
    },JWT_SECRET);
    res.json({
        message:"user created succesfully",
        token:token
    })
})
module.exports=router;
