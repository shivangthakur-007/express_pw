const usermodel=require('../models/userschema.js')
const crypto=require('crypto')
const bcrypt=require('bcrypt')
const emailvalidator=require('email-validator')

const signup= async(req, res, next)=>{
    const {name, email, password, confirmpassword} = req.body
    console.log(name, email, password, confirmpassword);

    if(!name || !email || !password || !confirmpassword){
       return res.status(400).json({
                success: false,
                message: 'Every field is required'
            }) 
    }
    const validEmail= emailvalidator.validate(email);
    if(!validEmail){
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address",
        })
    }
    
    try {
        
        if(password !== confirmpassword){
            return res.status(400).json({
                success: false,
                message: "password and confirm password doesn't match. "
             } )
        }

        const userinfo=new usermodel(req.body)

        const result = await userinfo.save();
        return res.status(200).json({
            success:true,
            data: result
        });
        
    } catch (error) {
        if(error.code === 11000){
            return res.status(400).json({
                success: false,
                message: `Account alreay existed with provided email ${email}`
            })
        }
        return res.status(400).json({
            message: error.message
        })
    }
}
// Sign in
const signin= async(req, res, next)=>{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: 'Every field are required'
        })
    }
    try {
    const user = await usermodel.findOne({
        email
    }).select('+password')

    if(!user || !(await bcrypt.compare(password, user.password))){
        return res.status(400).json({
            success: false,
            message: 'invalid credentials'
        })
    }

    const token = user.jwttoken();
    user.password = undefined;

    const cookieoption ={
        maxage: 24 * 60 * 60 * 1000,
        httpOnly: true
    };
    
    res.cookie("token", token, cookieoption);
    res.status(200).json({
        success: true,
        data: user
    })
} catch (error) {
     return res.status(400).json({ 
        success: false,
        message: error.message
     })   
    }
}
//  logout
const logout=(req, res, next)=>{
    try {
        const cookieoption={
            exprires: new Date(),
            httpOnly: true
        }
        // return response cookie without token
        res.cookie("token", null, cookieoption );
        res.status(200).json({
            success:true,
            message: "logged out"
        })
    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message
        })
    }
}
 
const user= async (req, res, next)=>{
    const userid=req.user.id;
    try {
        const user = await usermodel.findById(userid)
        return res.status(200).json({
            success: true,
            data: user
        })
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }
}

module.exports={
    signup,
    signin,
    logout,
    user
}