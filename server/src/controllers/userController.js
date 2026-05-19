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

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate(savedPropertiesPopulate)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      success: true,
      data: cleanUser(user),
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
      data: user.savedProperties,
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
