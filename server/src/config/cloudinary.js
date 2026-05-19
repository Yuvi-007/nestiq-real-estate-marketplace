const { v2: cloudinary } = require('cloudinary')

const configureCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
  const hasCloudName = Boolean(CLOUDINARY_CLOUD_NAME)
  const hasApiKey = Boolean(CLOUDINARY_API_KEY)
  const hasApiSecret = Boolean(CLOUDINARY_API_SECRET)

  console.log(`Cloudinary cloud name loaded: ${hasCloudName}`)
  console.log(`Cloudinary api key loaded: ${hasApiKey}`)
  console.log(`Cloudinary api secret loaded: ${hasApiSecret}`)

  if (!hasCloudName || !hasApiKey || !hasApiSecret) {
    throw new Error('Cloudinary environment variables are missing')
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  })
}

module.exports = {
  cloudinary,
  configureCloudinary,
}
