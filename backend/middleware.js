const { JWT_SECRET } = require("./config")
const jwt=require("jsonwebtoken");

const authmiddleware=(req,res,next)=>{
    // console.log("Authorization header:", req.headers.authorization);
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({
            message:"invalid token"
        });
    }
    const token=authHeader.split(' ')[1];
    try{
        const decoded=jwt.verify(token,JWT_SECRET);
        if(decoded.userId){
            req.userId=decoded.userId;
            next();
        }
    }
    catch(err){
        return res.status(403).json({
            message:"not a valid user "
        });
    }
}

module.exports={
    authmiddleware
}