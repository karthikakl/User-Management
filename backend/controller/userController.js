const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const User=require('../model/userModel')


const loginUser=async(req,res)=>{
    try {
       const {email,password}=req.body
       console.log('user logged in',req.body)
       
       if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
        const user=await User.findOne({email})

        if(user && (await bcrypt.compare(password,user.password))){
            res.json({
                _id:user.id,
                name:user.name,
                email:user.email,
                number:user.number,
                token:generateToken(user._id)
            })
        }else{
            res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
} 


const signupUser=async(req,res)=>{
    try {
        const {name,email,number,password}=req.body;
        if(!name||!email||!number||!password){
            res.status(400)
            throw new Error('please add all fields')
        }
        const userExists=await User.findOne({email})
        if(userExists){
            res.status(400)
            throw new Error('user already exists')
        }

        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        const user=new User({
            name,
            email,
            number,
            password:hashedPassword
        })

        const userData=await user.save();
        console.log(userData)

        if(user){
            res.status(201).json({
                _id:user.id,
                name:user.name,
                email:user.email,
                number:user.number,
                token:generateToken(user._id)
            })
        }else{
            res.status(400)
            throw new Error('invalid user')
        }

    } catch (error) {
        console.error('Error during verification', error);
        res.status(500).send("Internal Server Error")  
    }
}


const profile=async(req,res)=>{
    try {
        const {_id,name,email,number}=await User.findById(req.user.id)
        res.status(200).json({
            id:_id,
            name,
            email,
            number
        })
    } catch (error) {
        
    }
}
//generate token 

const generateToken=(id)=>{
   return jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn:'30d',
   }) 
}

const uploadProfile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.profilePicture = req.file.filename; // This should work as expected
        console.log('Uploaded file:', req.file);
        
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile picture uploaded successfully',
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



module.exports={
   
    loginUser,
    signupUser,
    profile,
    uploadProfile
}