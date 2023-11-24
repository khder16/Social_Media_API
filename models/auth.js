const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const Type = mongoose.Schema.Types
const authSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
    },
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    photo: {
        type: String,
        default: ''
    },
    emailVerificationToken: {
        type: String
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordExpiry: {
        type: Date
    },
    token: {
        type: String    
    }
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Auth', authSchema)