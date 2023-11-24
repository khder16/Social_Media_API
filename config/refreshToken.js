const jwt = require('jsonwebtoken')

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_KEY, {
        expiresIn: "30d"
    })
}

module.exports = generateRefreshToken