const mongoose = require('mongoose')

const Property = require('../models/Property')
const User = require('../models/User')
const { attachTrustScore } = require('../utils/propertyScoring')

const agentFields = 'name email phone avatar role isVerified'
const allowedRoles = ['buyer', 'seller', 'agent', 'admin']
const allowedStatuses = ['pending', 'active', 'sold', 'rejected']

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

const cleanUser = (user) => {
  const userObject = user.toObject ? user.toObject() : { ...user }
  delete userObject.password
  return userObject
}

const formatBreakdown = (items) =>
  items.map((item) => ({
    name: item._id || 'Unknown',
    value: item.count,
  }))

const buildRiskOverview = (properties) => {
  const scoredProperties = properties.map(attachTrustScore)

  return scoredProperties.reduce(
    (overview, property) => {
      const trustScore = property.trustScore
      const descriptionLength = (property.description || '').trim().length
      const hasCoordinates =
        property.location?.lat !== undefined &&
        property.location?.lat !== null &&
        property.location?.lat !== '' &&
        property.location?.lng !== undefined &&
        property.location?.lng !== null &&
        property.location?.lng !== ''

      if (trustScore.riskLevel === 'HIGH') overview.highRiskListings += 1
      if (trustScore.riskLevel === 'MEDIUM') overview.mediumRiskListings += 1
      if (trustScore.riskLevel === 'LOW') overview.lowRiskListings += 1
      if (!property.images?.length) overview.listingsMissingImages += 1
      if (!hasCoordinates) overview.listingsMissingCoordinates += 1
      if (descriptionLength < 80) overview.listingsWithWeakDescriptions += 1

      return overview
    },
    {
      highRiskListings: 0,
      mediumRiskListings: 0,
      lowRiskListings: 0,
      listingsMissingImages: 0,
      listingsMissingCoordinates: 0,
      listingsWithWeakDescriptions: 0,
    },
  )
}

const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProperties,
      activeProperties,
      pendingProperties,
      soldProperties,
      totalAgents,
      totalBuyers,
      totalSellers,
      viewsResult,
      recentProperties,
      allPropertiesForRisk,
      propertyTypeCounts,
      userRoleCounts,
      listingStatusCounts,
      verificationPending,
      verificationVerified,
      verificationRejected,
      propertiesMissingDocuments,
    ] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Property.countDocuments({ status: 'active' }),
      Property.countDocuments({ status: 'pending' }),
      Property.countDocuments({ status: 'sold' }),
      User.countDocuments({ role: 'agent' }),
      User.countDocuments({ role: 'buyer' }),
      User.countDocuments({ role: 'seller' }),
      Property.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      Property.find()
        .populate('agent', agentFields)
        .sort({ createdAt: -1 })
        .limit(5),
      Property.find().populate('agent', agentFields),
      Property.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Property.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Property.countDocuments({ 'verification.status': { $in: ['submitted', 'underReview'] } }),
      Property.countDocuments({ 'verification.status': 'verified' }),
      Property.countDocuments({ 'verification.status': 'rejected' }),
      Property.countDocuments({
        $or: [
          { 'verification.documents': { $exists: false } },
          { 'verification.documents': { $size: 0 } },
          { 'verification.status': { $in: [null, 'notSubmitted'] } },
        ],
      }),
    ])

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProperties,
        activeProperties,
        pendingProperties,
        soldProperties,
        totalAgents,
        totalBuyers,
        totalSellers,
        totalViews: viewsResult[0]?.total || 0,
        verificationPending,
        verificationVerified,
        verificationRejected,
        propertiesMissingDocuments,
        recentProperties: recentProperties.map(attachTrustScore),
        ...buildRiskOverview(allPropertiesForRisk),
        propertyTypeBreakdown: formatBreakdown(propertyTypeCounts),
        userRoleBreakdown: formatBreakdown(userRoleCounts),
        listingStatusBreakdown: formatBreakdown(listingStatusCounts),
      },
    })
  } catch (error) {
    console.error('Admin stats error:', error.message)
    res.status(500).json({ message: 'Unable to load admin stats' })
  }
}

const getAdminUsers = async (req, res) => {
  try {
    const filter = {}

    if (req.query.role) {
      if (!allowedRoles.includes(req.query.role)) {
        return res.status(400).json({ message: 'Invalid role filter' })
      }

      filter.role = req.query.role
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 })

    res.json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch (error) {
    console.error('Admin users error:', error.message)
    res.status(500).json({ message: 'Unable to load users' })
  }
}

const updateAdminUser = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID' })
    }

    const updatePayload = {}
    const allowedFields = ['role', 'isVerified', 'phone', 'name']

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updatePayload[field] = req.body[field]
      }
    })

    if (req.body.password !== undefined) {
      return res.status(400).json({ message: 'Password cannot be updated from admin user settings' })
    }

    if (updatePayload.role && !allowedRoles.includes(updatePayload.role)) {
      return res.status(400).json({ message: 'Role must be buyer, seller, agent, or admin' })
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true,
    }).select('-password')

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: cleanUser(updatedUser),
    })
  } catch (error) {
    console.error('Admin update user error:', error.message)

    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0]
      return res.status(400).json({ message: firstError.message })
    }

    res.status(500).json({ message: 'Unable to update user' })
  }
}

const deleteAdminUser = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID' })
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Admins cannot delete their own account' })
    }

    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    await user.deleteOne()

    res.json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error) {
    console.error('Admin delete user error:', error.message)
    res.status(500).json({ message: 'Unable to delete user' })
  }
}

const getAdminProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('agent', agentFields)
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: properties.length,
      data: properties.map(attachTrustScore),
    })
  } catch (error) {
    console.error('Admin properties error:', error.message)
    res.status(500).json({ message: 'Unable to load properties' })
  }
}

const updatePropertyStatus = async (propertyId, status, rejectionReason) => {
  const updatePayload = { status }

  if (status === 'rejected') {
    updatePayload.rejectionReason = rejectionReason || ''
  }

  if (status !== 'rejected') {
    updatePayload.rejectionReason = ''
  }

  const property = await Property.findByIdAndUpdate(propertyId, updatePayload, {
    new: true,
    runValidators: true,
  }).populate('agent', agentFields)

  return property ? attachTrustScore(property) : null
}

const setAdminPropertyApproved = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid property ID' })
    }

    const property = await updatePropertyStatus(req.params.id, 'active')

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    res.json({
      success: true,
      message: 'Property approved successfully',
      data: property,
    })
  } catch (error) {
    console.error('Admin approve property error:', error.message)
    res.status(500).json({ message: 'Unable to approve property' })
  }
}

const setAdminPropertyRejected = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid property ID' })
    }

    const property = await updatePropertyStatus(req.params.id, 'rejected', req.body.rejectionReason)

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    res.json({
      success: true,
      message: 'Property rejected successfully',
      data: property,
    })
  } catch (error) {
    console.error('Admin reject property error:', error.message)
    res.status(500).json({ message: 'Unable to reject property' })
  }
}

const setAdminPropertyStatus = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid property ID' })
    }

    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: 'Status must be pending, active, sold, or rejected' })
    }

    const property = await updatePropertyStatus(req.params.id, req.body.status, req.body.rejectionReason)

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    res.json({
      success: true,
      message: 'Property status updated successfully',
      data: property,
    })
  } catch (error) {
    console.error('Admin update property status error:', error.message)
    res.status(500).json({ message: 'Unable to update property status' })
  }
}

const setAdminPropertyVerificationApproved = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid property ID' })
    }

    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    property.verification = property.verification || {}
    property.verification.status = 'verified'
    property.verification.verifiedAt = new Date()
    property.verification.verifiedBy = req.user._id
    property.verification.rejectionReason = ''
    property.verification.documents = (property.verification.documents || []).map((document) => {
      if (document.status === 'submitted') document.status = 'approved'
      return document
    })

    await property.save()
    const updatedProperty = await property.populate('agent', agentFields)

    res.json({
      success: true,
      message: 'Property verification approved successfully',
      data: attachTrustScore(updatedProperty),
    })
  } catch (error) {
    console.error('Admin approve verification error:', error.message)
    res.status(500).json({ message: 'Unable to approve verification' })
  }
}

const setAdminPropertyVerificationRejected = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid property ID' })
    }

    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    property.verification = property.verification || {}
    property.verification.status = 'rejected'
    property.verification.verifiedAt = undefined
    property.verification.verifiedBy = undefined
    property.verification.rejectionReason = req.body.rejectionReason || 'Verification rejected by admin.'
    property.verification.documents = (property.verification.documents || []).map((document) => {
      if (document.status === 'submitted') document.status = 'rejected'
      return document
    })

    await property.save()
    const updatedProperty = await property.populate('agent', agentFields)

    res.json({
      success: true,
      message: 'Property verification rejected successfully',
      data: attachTrustScore(updatedProperty),
    })
  } catch (error) {
    console.error('Admin reject verification error:', error.message)
    res.status(500).json({ message: 'Unable to reject verification' })
  }
}

module.exports = {
  getAdminStats,
  getAdminUsers,
  updateAdminUser,
  deleteAdminUser,
  getAdminProperties,
  setAdminPropertyApproved,
  setAdminPropertyRejected,
  setAdminPropertyStatus,
  setAdminPropertyVerificationApproved,
  setAdminPropertyVerificationRejected,
}
