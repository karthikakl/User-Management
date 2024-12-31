const express = require('express');
const admin_router = express.Router(); 
const adminController = require('../controller/adminController');

admin_router.post('/login',adminController.adminLogin)
admin_router.get('/users',adminController.getUsers)
admin_router.post('/addUser',adminController.addUser)
admin_router.get('/getUser/:id',adminController.getUserById)
admin_router.put('/editUser/:id',adminController.editUser)
admin_router.delete('/deleteUser/:id',adminController.deleteUser)

module.exports = admin_router;