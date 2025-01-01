const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    number: {
        type: Number,
    },
    password: {
        type: String,
    },
    profilePicture: {
        type: String,
        default:''  
    },
    resume: {
        type: String,
        default:''  
    },
    is_admin: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('user', userSchema);
