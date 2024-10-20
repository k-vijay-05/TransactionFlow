const express=require('express');
const router=express.Router();
const zod =require("zod")
const jwt=require("jsonwebtoken")
const {User} =require("../models/db")
const {JWT_SECRET}=require("../config")
const { authmiddleware } =require('../middleware');
const signupbody=zod.object({
    username:zod.string().email(),
    firstName:zod.string(),
    lastName:zod.string(),
    password:zod.string()
});
const siginbody=zod.object({
    username:zod.string().email(),
    password:zod.string()
});
const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
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
router.post('/signin',async(req,res)=>{
    const {success}=siginbody.safeParse(req.body);
 
    if(!success){
      return  res.status(411).json({
            message:"invalid inputs"
        })
    }
    const existinguser=await User.findOne({
        username:req.body.username,
        password:req.body.password
    })
    if(existinguser){
        const token=jwt.sign({
            userId: existinguser._id
        },JWT_SECRET);
        res.json({
            token:token
        })
        return;
    }
    return res.status(411).json({
        message:"Error while logging in"
    })

})
router.put('/update',authmiddleware,async(req,res)=>{
    const { success } = updateBody.safeParse(req.body)
    console.log(req.userId);
    if (!success) {
       return  res.status(411).json({
            message: "Error while updating information"
        })
    }
    await User.updateOne({ _id: req.userId }, req.body);

    return res.json({
        message: "Updated successfully"
    })
   

})
router.get('/search',async(req,res)=>{
    User.find({
        $or: [
            { firstName: req.firstName},
            { lastName: req.lastName }
        ],
    })
    
    
})
module.exports=router;
