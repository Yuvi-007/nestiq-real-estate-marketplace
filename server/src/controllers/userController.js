const User = require('../models/User')
const Property = require('../models/Property')

const agentFields = 'name avatar phone email'
const savedPropertiesPopulate = {
  path: 'savedProperties',
  populate: {
    path: 'agent',
    select: agentFields,
  },
}

const cleanUser = (user) => {
  const userObject = user.toObject ? user.toObject() : { ...user }
  delete userObject.password
  return userObject
}

const sanitizeSavedProperty = (property) => {
  const propertyObject = property?.toObject ? property.toObject() : { ...property }
  const verification = propertyObject.verification || {}

  return {
    ...propertyObject,
    verification: {
      status: verification.status || 'notSubmitted',
      verifiedAt: verification.verifiedAt,
      rejectionReason: verification.status === 'rejected' ? verification.rejectionReason : '',
      documentsCount: verification.documents?.length || 0,
    },
  }
}

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate(savedPropertiesPopulate)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const userObject = cleanUser(user)
    userObject.savedProperties = (userObject.savedProperties || []).map(sanitizeSavedProperty)

    res.json({
      success: true,
      data: userObject,
    })
  } catch (error) {
    console.error('Get profile error:', error.message)
    res.status(500).json({ message: 'Unable to fetch profile' })
  }
}

const getSavedProperties = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('savedProperties').populate(savedPropertiesPopulate)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      success: true,
      count: user.savedProperties.length,
      data: user.savedProperties.map(sanitizeSavedProperty),
    })
  } catch (error) {
    console.error('Get saved properties error:', error.message)
    res.status(500).json({ message: 'Unable to fetch saved properties' })
  }
}

const getMyListings = async (req, res) => {
  try {
    const listings = await Property.find({ agent: req.user._id })
      .populate('agent', agentFields)
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: listings.length,
      data: listings,
    })
  } catch (error) {
    console.error('Get my listings error:', error.message)
    res.status(500).json({ message: 'Unable to fetch your listings' })
  }
}

module.exports = {
  getProfile,
  getSavedProperties,
  getMyListings,
}
