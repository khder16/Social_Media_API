const httpStatus = require('http-status')
const mongoose = require('mongoose')
const { addMinutes, getUnixTime, addYears } = require('date-fns')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Auth = require('../models/auth')
const User = require('../models/user')
const nodemailer = require('nodemailer')
const crypto = require("crypto")
const cloudinary = require("cloudinary").v2
const generateRefreshToken = require('../config/refreshToken')
const { log } = require('console')
// const { options } = require('../routers/authRout')


const register = async (req, res) => {
    try {

        const isExisting = await Auth.findOne({ email: req.body.email })
        if (isExisting) {
            throw new Error("Email already existing")
        }

        const token = jwt.sign(
            req.body.email,
            process.env.TOKEN_KEY,
        );

        // Configuration 


        // cloudinary.config({
        //     cloud_name: process.env.CLOUD_NAME,
        //     api_key: process.env.API_CLOUD_KEY,
        //     api_secret: process.env.API_CLOUD_SECR
        // });

        // let file = req.files.media
        // const result = await cloudinary.uploader.upload(file.path, {
        //     folder: "users"
        // })
        let password = await bcrypt.hash(req.body.password, 10)
        const newAuth = await Auth.create({ ...req.body, password, token })
        const newUser = await (await User.create({ userInfo: newAuth._id, email: newAuth.email })).populate("userInfo")

        let email = "khdrhabeb16@hotmail.com"
        emailVerification(email, token, newAuth._id)
        res.json({
            status: true,
            message: "success",
            user: newUser
        })
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            res.json({ msg: "Please provide email and password to login" })
        }
        let user = await Auth.findOne({ email })
        if (!user) {
            return res.status(500).json("Password or email may be incorrect")
        }
        if (user && (await bcrypt.compare(password, user.password))) {
            if (user.emailVerified == false) {
                return res.status(500).json("Please verify your Email and try again")
            }
            console.log(`${user.firstName} Loged-in`)
            // const refreshToken = await generateRefreshToken(user._id)
            // res.cookie("refreshToken", refreshToken, { maxAge: 240 * 60 * 60 * 100 })
            const token = jwt.sign({
                userId: user._id
            },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '10d'
                }
            )
            user.token = token
            res.cookie('token', token, { maxAge: 240 * 60 * 60 * 1000 })

            return res.status(200).json("Loged in successfully")
        } else {
            return res.status(500).json("Password or email may be incorrect")
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
}



const logout = async (req, res) => {
    try {
        res.cookie('token', '')
        res.status(200).json({ message: "logout success" })
    } catch (error) {
        throw new Error(error)
    }
}

const forgotPasswordToken = async (req, res) => {
    try {
        const { email } = req.body

        const user = await Auth.findOne({ email: email })
        if (!user) {
            return res.status(500).json("User not found.");
        }

        const token = jwt.sign({
            email: user.email
        },
            process.env.TOKEN_KEY
        )

        const url = `localhost:3000/auth/resetpass/${token}`
        const message = `Copy paste this link in your Url and hit enter \n\n ${url}`

        const data = {
            to: email,
            subject: "Password reset",
            html: message
        }
        sendEmail(data.email, data.subject, data.html)
        user.token = token
        user.save()
        res.json("email has sent")
    } catch (error) {
        res.json(error)
    }
}



const resetPassword = async (req, res) => {
    try {
        const { password } = req.body
        const { token } = req.params



        const user = await Auth.findOne({
            token: token,
        })
        if (!user) {
            throw new Error("Token expired or invalid. Please try again.")
        }

        user.password = await bcrypt.hash(req.body.password, 10)
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined
        await user.save()
        res.json({ newPass: user.password })
    } catch (error) {
        res.status(500).json({ error: "There was an error while processing your request." })
    }
}


const emailVerification = async (email, token, id) => {
    try {
        const message = `localhost:3000/auth/verify/${id}/${token}`
        await sendEmail(email, "Verify Email", message)
    } catch (error) {
        throw new Error(error)
    }
}

const checkVerifyEmail = async (req, res) => {
    try {
        const user = await Auth.findOne({ _id: req.params.id })
        if (!user) return res.status(400).send("Invalid link")
        const token = await Auth.findOne({
            _id: user._id,
            token: req.params.token
        })
        if (!token) return res.status(400).send("Invalid link")
        const newUser = await Auth.findByIdAndUpdate({ _id: user._id }, { emailVerified: true }, { new: true })
        res.status(200).json(newUser);
    } catch (error) {
        throw new Error(error)
    }
}




const createPasswordResetToken = async function (user) {
    const resetToken = crypto.randomBytes(32).toString("hex")
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    // 10 minutes
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000
    return resetToken
}





const sendEmail = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.UG,
                pass: process.env.PG
            }
        })
        await transporter.sendMail({
            from: process.env.UG,
            to: email,
            subject: subject,
            html: html

        })
        console.log("Email sent successfully");

    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
}


module.exports = { register, login, checkVerifyEmail, logout, forgotPasswordToken, resetPassword, emailVerification }