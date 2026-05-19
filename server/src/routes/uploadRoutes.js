const express = require('express')

const { uploadPropertyImages } = require('../controllers/uploadController')
const authMiddleware = require('../middleware/authMiddleware')
const roleGuard = require('../middleware/roleGuard')
const handleUploadErrors = require('../middleware/upload')

const router = express.Router()

router.post(
  '/property-images',
  authMiddleware,
  roleGuard('seller', 'agent', 'admin'),
  handleUploadErrors,
  uploadPropertyImages,
)

module.exports = router
