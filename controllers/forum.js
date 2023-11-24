const ForumPost = require('../models/forum')
const User = require('../models/user');
const Auth = require('../models/auth')

const UserActivity = require('../models/userActivity');



const createForumPost = async (req, res) => {
    try {
        const { title, description, category } = req.body
        const userCreator = req.user.id
        const user = await User.findOne({ userInfo: req.user.id })
        const userInfo = user.userInfo
        const forumPost = await ForumPost.create({ title, userInfo, creator: userInfo, description, category })
        console.log(forumPost);
        const forumPosts = await ForumPost.find({ category }).sort({ createdAt: -1 }).populate('userInfo')
        res.status(200).json(forumPosts)
    } catch (error) {
        res.status(400).json(error);
    }
}


const editForumPost = async (req, res) => {
    const { forumPostId } = req.params
    const { title, description } = req.body
    try {
        const forumPost = await ForumPost.findByIdAndUpdate(forumPostId, { title, description }, { new: true })

        res.json(forumPost)
    } catch (err) {
        res.status(400).json(error)
    }
}

const likeForumPost = async (req, res) => {
    try {
        const { forumPostId } = req.params
        const userId = req.user.id
        const forumPost = await ForumPost.findById(forumPostId)
        if (!forumPost) {
            return res.status(404).json({ error: 'Forum post not found.' })
        }
        const alreadyLiked = forumPost.likes.includes(userId)
        let updatedForumPost

        if (alreadyLiked) {
            await UserActivity.findOneAndDelete({
                user_id: userId
            })
            updatedForumPost = await ForumPost.findByIdAndUpdate(forumPostId, { $pull: { likes: userId } }, { new: true })
        } else {
            const userActivity = await UserActivity.create({
                user_id: req.user.id,
                post_id: forumPost._id,
                action: 'like',
                timestamp: new Date()
            })
            updatedForumPost = await ForumPost.findByIdAndUpdate(forumPostId, { $push: { likes: userId } }, { new: true })
        }
        res.json(updatedForumPost)
    } catch (error) {
        res.status(400).json(error)
    }
}

const getForumPostsByCategory = async (req, res) => {
    const { category } = req.params
    try {
        const forumPosts = await ForumPost.find({ category })
            .populate("userInfo")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        res.json(forumPosts)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}
const getForumPostById = async (req, res) => {
    try {
        const {forumPostId} = req.params
        console.log(forumPostId);
        const forumPost = await ForumPost.findById(forumPostId).populate('userInfo')
        if (!forumPost) {
            return res.status(404).json({ error: 'Forum post not found.' })
        }
        res.json(forumPost)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}


const getFilteredForumPosts = async (req, res) => {
    try {
        const { filter } = req.body
        if (filter === 'trending') {
            // Last 3h
            const pastFewHours = new Date(Date.now() - 1000 * 60 * 60 * 3)
            const filteredPosts = await ForumPost.find({ createdAt: { $gte: pastFewHours } }).populate("userInfo").sort({ likes: -1, createdAt: -1 })
            res.status(200).json(filteredPosts)
        }
        if (filter === 'latest') {
            const filteredPosts = await ForumPost.find({ category })
                .populate("userInfo")
                .sort({ createdAt: -1 })
            res.status(200).json(filteredPosts)
        }
        if (filter === 'mostLiked') {
            const filteredPosts = await ForumPost.find({}).populate("userInfo").sort({ likes: -1, createdAt: -1 })
            res.status(200).json(filteredPosts)
        }
    } catch (error) {

    }
}

module.exports = { getFilteredForumPosts, getForumPostById, getForumPostsByCategory, likeForumPost, editForumPost, createForumPost }