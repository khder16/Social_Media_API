const express = require('express')
const router = express.Router()

const { getFilteredForumPosts, getForumPostById, getForumPostsByCategory, likeForumPost, editForumPost, createForumPost } = require('../controllers/forum')
const { verifyToken } = require('../middleware/verifyToken')




router.post('/', verifyToken, createForumPost);

router.get('/filter', verifyToken, getFilteredForumPosts);
router.get('/single/:forumPostId', verifyToken, getForumPostById);

router.put('/toggle-like/:forumPostId', verifyToken, likeForumPost);
router.put('/:forumPostId', verifyToken, editForumPost);


module.exports = router




module.exports = router
