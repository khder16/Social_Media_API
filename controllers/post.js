const Post = require('../models/post')
const Auth = require('../models/auth')
const User = require('../models/user')

const mongoose = require('mongoose')
const cloudinary = require("cloudinary").v2



const createPost = async (req, res) => {
    try {

        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_CLOUD_KEY,
            api_secret: process.env.API_CLOUD_SECR
        })
        let file = req.files
        let photoUrl = null
        if (file) {
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "posts"
            })
            photoUrl = result.secure_url

        }
        const user = await User.findOne({ userInfo: req.user.id })
        console.log(user);
        const posted = await Post.create({
            user: user._id,
            title: req.body.title,
            userInfo: user.userInfo,
            photo: photoUrl
        })

        const posts = await Post.find().populate('user').sort({ createdAt: -1 })
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}


const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.id }).populate('userInfo')
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const getOnePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('userInfo')
        if (!post) {
            return res.status(500).json({ msg: "No such post with this id!" })
        } else {
            return res.status(200).json(post)
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
}



const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (post.userInfo.toString() === req.user.id.toString()) {
            const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
            return res.status(200).json(updatedPost)
        }
        else {
            res.json("You can not edit this post")
        }
    } catch (error) {
        throw new Error(error)
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(500).json({ msg: "No such post" })
        }
        if (post.userInfo.toString() === req.user.id.toString()) {
            await Post.findByIdAndDelete(req.params.id)
            return res.status(200).json({ msg: "Post is successfully deleted" })
        } else {
            return res.status(403).json({ msg: "You can delete only your own posts" })
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const toggleLike = async (req, res) => {

    try {
        const currentUserId = req.user.id
        const post = await Post.findById(req.params.id)


        const isLiked = post.likes.includes(currentUserId)
        if (isLiked) {
            post.likes.filter((id) => id !== currentUserId)
            post.liked = false
            await post.save()
            return res.status(200).json({ post: post, msg: "Successfully unliked the post" })
        } else {
            post.likes.push(currentUserId)
            post.liked = true
            await post.save()
            return res.status(200).json({ post: post, msg: "Successfully liked the post" })
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }

}



module.exports = { toggleLike, deletePost, getOnePost, updatePost, createPost, getUserPosts }