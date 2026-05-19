const express = require('express')
const {
  register,
  login,
  logout,
  refresh,
  me,
} = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh', refresh)
router.get('/me', authMiddleware, me)

module.exports = router
