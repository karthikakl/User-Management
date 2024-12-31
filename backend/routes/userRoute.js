const express = require('express');
const user_router = express.Router(); 
const userController = require('../controller/userController');
const {protect}=require('../middleware/authMiddleware')
const multer=require('multer')
const path=require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images')); 
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });



user_router.post('/register',userController.signupUser);
user_router.post('/login',userController.loginUser);
user_router.get('/profile',protect,userController.profile)
user_router.post('/uploadProfilePicture', protect, upload.single('file'),userController.uploadProfile)


module.exports=user_router;