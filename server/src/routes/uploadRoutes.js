const express = require('express')

const { uploadPropertyImages, uploadVerificationDocuments } = require('../controllers/uploadController')
const authMiddleware = require('../middleware/authMiddleware')
const roleGuard = require('../middleware/roleGuard')
const handleUploadErrors = require('../middleware/upload')
const { handleVerificationUploadErrors } = require('../middleware/upload')

const router = express.Router()

router.post(
  '/property-images',
  authMiddleware,
  roleGuard('seller', 'agent', 'admin'),
  handleUploadErrors,
  uploadPropertyImages,
)

router.post(
  '/verification-documents',
  authMiddleware,
  roleGuard('seller', 'agent', 'admin'),
  handleVerificationUploadErrors,
  uploadVerificationDocuments,
)

module.exports = router
