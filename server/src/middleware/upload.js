const multer = require('multer')

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const allowedVerificationMimeTypes = ['application/pdf', ...allowedMimeTypes]
const maxFileSize = 5 * 1024 * 1024
const maxVerificationFileSize = 10 * 1024 * 1024

const storage = multer.memoryStorage()

const createFileFilter = (mimeTypes, message) => (req, file, cb) => {
  if (!mimeTypes.includes(file.mimetype)) {
    return cb(new Error(message))
  }

  cb(null, true)
}

const upload = multer({
  storage,
  fileFilter: createFileFilter(allowedMimeTypes, 'Unsupported file type. Only jpg, jpeg, png, and webp images are allowed'),
  limits: {
    fileSize: maxFileSize,
    files: 15,
  },
})

const verificationUpload = multer({
  storage,
  fileFilter: createFileFilter(
    allowedVerificationMimeTypes,
    'Unsupported file type. Only pdf, jpg, jpeg, png, and webp documents are allowed',
  ),
  limits: {
    fileSize: maxVerificationFileSize,
    files: 10,
  },
})

const handleUploadErrors = (req, res, next) => {
  upload.array('images', 15)(req, res, (error) => {
    if (!error) {
      return next()
    }

    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Each image must be 5MB or smaller' })
      }

      if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ message: 'You can upload a maximum of 15 images' })
      }

      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          message: error.field === 'images'
            ? 'You can upload a maximum of 15 images'
            : 'Unexpected file field. Use images as the form field name',
        })
      }
    }

    return res.status(400).json({ message: error.message || 'Invalid image upload' })
  })
}

const handleVerificationUploadErrors = (req, res, next) => {
  verificationUpload.array('documents', 10)(req, res, (error) => {
    if (!error) {
      return next()
    }

    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Each verification document must be 10MB or smaller' })
      }

      if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ message: 'You can upload a maximum of 10 verification documents' })
      }

      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          message: error.field === 'documents'
            ? 'You can upload a maximum of 10 verification documents'
            : 'Unexpected file field. Use documents as the form field name',
        })
      }
    }

    return res.status(400).json({ message: error.message || 'Invalid verification document upload' })
  })
}

module.exports = handleUploadErrors
module.exports.handleVerificationUploadErrors = handleVerificationUploadErrors
