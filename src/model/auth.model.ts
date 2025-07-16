import {Schema, model} from "mongoose";

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true, 
        trim: true,
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date
},{timestamps: true})

export const User = model('User', userSchema)