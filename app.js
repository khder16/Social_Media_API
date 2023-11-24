const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const connectDB = require('./db/connectDB')
const cookieParser = require('cookie-parser')
const auth = require('./routers/authRout')
const forum = require('./routers/forumRout')
const post = require('./routers/postRout')
const users = require('./routers/userRout')
const comment = require('./routers/commentsRout')
const morgan = require('morgan')
app.use(morgan('dev'))
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
const PORT = 3000





app.use('/auth', auth)
app.use('/post', post)
app.use('/comment', comment)
app.use('/forum', forum)
app.use('/users', users)
const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}...`))
        await connectDB(process.env.MONGO_URI)
    } catch (error) {
        console.log(error)
    }
}

start()
