const express = require('express')

const {
  getProfile,
  getSavedProperties,
  getMyListings,
} = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/profile', authMiddleware, getProfile)
router.get('/saved-properties', authMiddleware, getSavedProperties)
router.get('/me/listings', authMiddleware, getMyListings)

module.exports = router
