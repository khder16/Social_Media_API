const jwt = require('jsonwebtoken')
const config = process.env
const cookieParser = require('cookie-parser')
const Auth = require('../models/auth')
const User = require('../models/user')
const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.body.token || req.query.token || req.headers["x-access-token"]

        if (!token) {
            return res.status(403).send("A token is required for authentication")
        }

        const decoded = jwt.verify(token, config.TOKEN_KEY)


        const user = await Auth.findById(decoded.userId)
        
        req.user = user


    } catch (error) {
        res.status(401).json(error)
    }
    return next()

}



module.exports = { verifyToken }