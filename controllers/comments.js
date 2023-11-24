const User = require('../models/user')
const Post = require('../models/post')
const Comment = require('../models/comments')
const UserActivity = require('../models/userActivity')
const { Timestamp } = require('mongodb')


const createComment = async (req, res) => {
    try {
        const user = await User.findOne(req.user.id)
        const createdComment = await Comment.create({ ...req.body, user: req.user._id, post: req.params.postId, userInfo: user.userInfo })
        const post = await Post.findById(req.params.postId)
        console.log(post);
        post.comments.push(createdComment._id)
        post.save()
        const comments = await Comment.find({ post: createdComment.post }).populate("userInfo")
        const userActivity = await UserActivity.create({
            user_id: user._id,
            post_id: post._id,
            action: 'comment',
            timestamp: new Date()
        })
        return res.status(201).json(comments)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}


const getPostComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).sort({ createdAt: -1 }).populate('userInfo')
        return res.status(200).json(comments)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const getOneComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId).populate('userInfo')
        if (!comment) {
            return res.status(500).json({ msg: "No such comment" })
        }
        return res.status(200).json(comments)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}


const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
        if (!comment) {
            return res.status(500).json({ msg: "No such comment" })
        }

        if (comment.user.toString() === req.user.id.toString()) {
            comment.commentText = req.body.commentText
            await comment.save()
            return res.status(200).json(comment)
        } else {
            return res.status(403).json({ msg: "You can update only your own comments" })
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
}



const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
        if (!comment) {
            return res.status(500).json({ msg: "No such comment" })
        }
        if (comment.user.toString() === req.user.id.toString()) {
            const deletedComment = await Comment.findByIdAndDelete(req.params.commentId)
            return res.status(200).json({ msg: "Comment has been successfully deleted" })
        } else {
            return res.status(403).json({ msg: "You can delete only your own comments" })
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
}


const toggleCommentLike = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
        const userId = req.user.id
        if (!comment) {
            return res.status(500).json({ msg: "No such comment" })
        }
        if (comment.user.toString() !== req.user.id.toString()) {
            if (!comment.likes.includes(userId)) {
                comment.likes.push(userId)
                await comment.save()
                return res.status(200).json({ comment, msg: "Comment has been successfully liked!" })
            }
            else {
                comment.likes = comment.likes.filter((id) => id !== userId)
                await comment.save()
                return res.status(200).json({ comment, msg: "Comment has been successfully unliked" })
            }
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
}



module.exports = { createComment }