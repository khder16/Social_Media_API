const mongoose = require("mongoose");

const connectDB = (url) => {
    return mongoose.connect(url).then(() => {
        console.log('Connected To DB Successfully')
    })
}

module.exports = connectDB