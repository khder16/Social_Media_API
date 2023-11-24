const express = require('express')
const router = express.Router()

const { register, login, checkVerifyEmail, logout, forgotPasswordToken, resetPassword } = require('../controllers/auth')


router.route('/register').post(register)
router.route('/login').post(login)
router.route('/verify/:id/:token').patch(checkVerifyEmail)
router.route('/logout').get(logout)
router.route('/forgotpass').post(forgotPasswordToken)
router.route('/resetpass/:token').post(resetPassword)


module.exports = router