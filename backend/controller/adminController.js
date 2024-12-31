const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const User = require('../model/userModel')

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,
        {expiresIn:'30d'})
}

const adminLogin=async(req,res)=>{
    const{email,password}=req.body

    if(email===process.env.ADMIN_EMAIL&&password===process.env.ADMIN_PASSWORD){
        const token=generateToken(process.env.ADMIN_EMAIL);
        res.json({success:true,token})
    }else{
        res.status(400).json({ success: false, message: 'Invalid admin credentials' }); 
    }
}

const getUsers=async(req,res)=>{
    try {
        const users = await User.find()
   
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
}

const addUser=async(req,res)=>{
    try {
        const {name,email,number,password}=req.body
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser= new User({
         name,
         email,
         number,
         password:hashedPassword
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
}

const getUserById=async(req,res)=>{
    try {
       const {id} = req.params
       const user = await User.findById(id)
       if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
}

const editUser=async(req,res)=>{
    try {
    const{id}=req.params;
    const {name,email,number}=req.body

    const updateUser = await User.findByIdAndUpdate(
        id,
        {name,email,number},{new:true}
    )
    res.status(200).json(updateUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
    
}

const deleteUser=async(req,res)=>{
    try {
        const {id}=req.params
        await User.findByIdAndDelete(id)
        res.status(204).send()
        res.status(500).json({ message: 'Error deleting user' });
    } catch (error) {
        
    }
}

module.exports={
    adminLogin,
    getUsers,
    addUser,
    getUserById,
    editUser,
    deleteUser
}