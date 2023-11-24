const express = require('express')
const router = express.Router()

const { toggleLike, deletePost, getOnePost, updatePost, createPost, getUserPosts } = require('../controllers/post')
const {verifyToken} = require('../middleware/verifyToken')

router.route('/find/user-posts/:id').get(verifyToken, getUserPosts)

router.route('/find/:id').get(verifyToken, getOnePost)

router.route('/').post(verifyToken, createPost)

router.route('/:id').put(verifyToken, updatePost)

router.route('/toggle-like/:id').put(verifyToken, toggleLike)

router.route('/:id').delete(verifyToken, deletePost)





module.exports = router
