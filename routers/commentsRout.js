const express = require('express')
const router = express.Router()
const { createComment } = require('../controllers/comments')


router.route('/:postId').post(createComment)





module.exports = router