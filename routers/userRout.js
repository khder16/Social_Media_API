const express = require('express')
const router = express.Router()
const { getUser, getSuggestedConnections, updateUser, addRemoveConnection, getAllUsers, getUserConnectios } = require('../controllers/user')
const { verifyToken } = require('../middleware/verifyToken')



router.route('/:userId').get(verifyToken, getUser)
router.route('/getall').get(verifyToken, getAllUsers)
router.route('/addremoveconnsctions').patch(verifyToken, addRemoveConnection)
router.route('/getuserConn/:userId').get(verifyToken, getUserConnectios)
router.route('/getSugges').post(verifyToken, getSuggestedConnections)
router.route('/updateUser').put(verifyToken, updateUser)



module.exports = router
