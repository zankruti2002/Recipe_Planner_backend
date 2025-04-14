const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const userModel = require('../models/userModel');

const fetchAllUsers = asyncHandler(async (req,res)=>{
    const allusers =await userModel.find();
    res.json({allusers:allusers});
})

const fetchUserById = asyncHandler(async (req,res)=>{
    const id=req.params.id;

    const user =await userModel.findById(id);
    res.json({user:user});
})
//Login 
const Login = asyncHandler(async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const userByEmail =await userModel.findOne({email})
    console.log(userByEmail);
    const comparing =await bcrypt.compare(password, userByEmail.password)
    console.log(comparing);
    if(userByEmail && comparing){
        res.status(200).json({success:true, 
            _id:userByEmail.id,
            name: userByEmail.name,
            email: userByEmail.email,
            token: generateToken(userByEmail._id)})

    }
    else{
        res.status(400).json({success:false})
    }

})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET ,{
        expiresIn: '30d', // Token will expire in 30 days
      })
  }
  
//Register
const createNewUser =asyncHandler(async (req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    
    if(!name){
        res.status(400);
        throw new Error('Please Fill name field')
    }
    else if(!email){
        res.status(400);
        throw new Error('Please Fill email field')
    }
    else if(!password){
        res.status(400);
        throw new Error('Please Fill password field')
    }

    const isUserExist =await userModel.findOne({email})

    if(isUserExist){
        res.status(400);
        throw new Error('User already Exits')
        
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    
    const newUser = await userModel.create({
        name:name,
        email:email,
        password:hashedPassword
    });
    if(newUser){
        res.status(201).json({success:true, 
            _id: newUser.id,
           name: newUser.name,
           email: newUser.email,
           token: generateToken(newUser._id)})
    }
    else{
        res.status(400)
        throw new Error('Invalid user data')
    }

})

//update my profile
const updateUser =asyncHandler(async (req, res)=>{
    const userId = req.params.id;
    const name = req.body.name;
    const email = req.body.email;

    if(!name){
        res.status(400);
        throw new Error('Please Fill name field')
    }
    else if(!email){
        res.status(400);
        throw new Error('Please Fill email field')
    }

    const updatedUser =await userModel.findByIdAndUpdate(userId,{
        name:name,
        email:email,
    })
    const result =await userModel.findById(userId);
    console.log(updatedUser);
    res.json({success: true, updateUser: result});
})

//delete account
const deleteUser =asyncHandler(async (req, res)=>{
    const userId = req.params.id;
    try{
        console.log(userId);
        const deletedUser = await userModel.findByIdAndDelete(userId);
        res.json({success: true});
    }
    catch(e){
        res.json({success: false});

    }
})

module.exports = {
    Login,
    fetchUserById,
    fetchAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}