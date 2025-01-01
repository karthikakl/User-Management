const express = require('express');
const user_router = express.Router(); 
const userController = require('../controller/userController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
       const uploadPath = path.join(__dirname,'../public/images');
       require('fs').mkdirSync(uploadPath,{recursive:true});
       cb(null,uploadPath)
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname
        cb(null,name)
    }
});

const upload = multer({storage:storage})

user_router.post('/register', userController.signupUser);
user_router.post('/login', userController.loginUser);
user_router.get('/profile', protect, userController.profile);
user_router.post('/uploadProfilePicture', protect, upload.single('file'), userController.uploadProfilePicture);
user_router.post('/uploadResume', protect, upload.single('file'), userController.uploadResume);

module.exports = user_router;
