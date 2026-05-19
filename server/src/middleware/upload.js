const multer = require('multer')

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const maxFileSize = 5 * 1024 * 1024

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Unsupported file type. Only jpg, jpeg, png, and webp images are allowed'))
  }

  cb(null, true)
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize,
    files: 15,
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

module.exports = handleUploadErrors
