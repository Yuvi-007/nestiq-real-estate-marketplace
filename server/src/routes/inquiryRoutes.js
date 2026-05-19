const express = require('express')

const {
  createInquiry,
  getMyInquiries,
  updateInquiryStatus,
} = require('../controllers/inquiryController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', authMiddleware, createInquiry)
router.get('/mine', authMiddleware, getMyInquiries)
router.patch('/:id/status', authMiddleware, updateInquiryStatus)

module.exports = router
