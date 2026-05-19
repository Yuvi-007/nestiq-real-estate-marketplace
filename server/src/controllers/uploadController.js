const streamifier = require('streamifier')

const { cloudinary, configureCloudinary } = require('../config/cloudinary')

const uploadBufferToCloudinary = (fileBuffer) =>
  new Promise((resolve, reject) => {
    configureCloudinary()

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'nestiq/properties',
        resource_type: 'image',
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

module.exports = {
  uploadPropertyImages,
}
