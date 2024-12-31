const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        
    },
    email:{
        type:String,
        
    },
    number:{
        type:Number,
        
    },
    password:{
        type:String,
        
    },
    profilePicture: {  
        type: String, 
        default: 'defaultProfilePicture.png' 
    },
    is_admin:{
        type:Boolean,
        deafault:false
    }

})

module.exports=mongoose.model('user',userSchema)