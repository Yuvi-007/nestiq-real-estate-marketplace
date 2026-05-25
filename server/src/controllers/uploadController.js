const streamifier = require('streamifier')

const { cloudinary, configureCloudinary } = require('../config/cloudinary')

const uploadBufferToCloudinary = (fileBuffer, options = {}) =>
  new Promise((resolve, reject) => {
    configureCloudinary()

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'nestiq/properties',
        resource_type: options.resourceType || 'image',
      },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        })
      },
    )

    streamifier.createReadStream(fileBuffer).pipe(uploadStream)
  })

const uploadPropertyImages = async (req, res) => {
  try {
    const files = req.files || []

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image',
      })
    }

    const images = await Promise.all(files.map((file) => uploadBufferToCloudinary(file.buffer)))

    res.status(201).json({
      success: true,
      images,
    })
  } catch (error) {
    console.error('Cloudinary upload error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to upload images',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
}

const uploadVerificationDocuments = async (req, res) => {
  try {
    const files = req.files || []

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one verification document',
      })
    }

    const documents = await Promise.all(
      files.map((file) =>
        uploadBufferToCloudinary(file.buffer, {
          folder: 'nestiq/verification-documents',
          resourceType: 'auto',
        }),
      ),
    )

    res.status(201).json({
      success: true,
      documents,
    })
  } catch (error) {
    console.error('Cloudinary verification upload error:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to upload verification documents',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
}

module.exports = {
  uploadPropertyImages,
  uploadVerificationDocuments,
}
