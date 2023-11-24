const User = require('../models/user')
const Auth = require('../models/auth')
const Post = require('../models/post')



const getUser = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findOne({ userInfo: userId }).populate('userInfo')
        const connections = await Promise.all(
            user.connections.map((con) => User.findById(con._id).populate('userInfo'))
        )

        const posts = await Post.find({ user: userId }).populate("userInfo")
        let numOfConnectios = connections.length
        let numOfPosts = posts.length

        res.status(200).json({
            posts,
            numOfPosts,
            numOfConnectios,
            connections,
            user
        })
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const getUserConnectios = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findOne({ userInfo: userId }).populate('userInfo')
        const connectionsUser = user.connections.map((email) => email)
        res.status(200).json(connectionsUser)
    } catch (error) {
        res.status(500).json(error);
    }
}


const addRemoveConnection = async (req, res) => {
    try {
        const { userId, connectionId } = req.body
        if (userId === connectionId) {
            throw new Error("You can't follow yourself")
        }

        const user = await User.findOne({ userInfo: userId }).populate('userInfo')
        const connection = await User.findOne({ userInfo: connectionId }).populate('userInfo')

        if (user.connections.some((con) => con == connection.email)) {

            user.connections = user.connections.filter((con) => con !== connection.email)
            await user.save()
        } else {

            user.connections.push(connection.email)
            await user.save()
        }
        const newUser = await User.findOne({ userInfo: userId }).populate('userInfo')

        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json(error.message);
    }
}


const updateUser = async (req, res) => {
    try {
        const { id } = req.user.id
        const updatedUser = await User.findByIdAndUpdate({ userinfo: id }, req.body, { new: true })
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json(error)
    }
}

// قارن بين find $nin و filter المصفوفة بالتابع السابق

const getSuggestedConnections = async (req, res) => {
    try {
        const user = await User.findOne({ userInfo: req.user.id }).populate('userInfo')
        const connectedUsers = user.connections.map((conn) => conn)
        console.log(connectedUsers);
        const suggestedUsers = await User.find({
            email: { $nin: connectedUsers, $ne: user.email }
        }).populate('userInfo')
        res.status(200).json({ suggestedUsers });

    } catch (error) {
        res.status(500).json(error);
    }
}


const getAllUsers = async (req, res) => {
    try {
        const authors = await Auth.find({})
        res.json(authors)
    } catch (error) {
        res.status(500).json(error)
    }
}


module.exports = { getUser, getSuggestedConnections, updateUser, addRemoveConnection, getUserConnectios, getAllUsers }