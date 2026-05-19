const mongoose = require('mongoose')

const Inquiry = require('../models/Inquiry')
const Property = require('../models/Property')

const userFields = 'name email phone avatar role isVerified'
const propertyPopulate = {
  path: 'property',
  populate: {
    path: 'agent',
    select: userFields,
  },
}
const allowedStatuses = ['new', 'contacted', 'closed']

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

const populateInquiry = (query) => query.populate(propertyPopulate).populate('sender', userFields)

const getOwnedPropertyIds = async (userId) => {
  const properties = await Property.find({ agent: userId }).select('_id')
  return properties.map((property) => property._id)
}

const canManageInquiry = (user, inquiry) => {
  if (user.role === 'admin') {
    return true
  }

  const agentId = inquiry.property?.agent?._id || inquiry.property?.agent
  return ['seller', 'agent'].includes(user.role) && agentId?.toString() === user._id.toString()
}

const createInquiry = async (req, res) => {
  try {
    const { property, message } = req.body

    if (!isValidObjectId(property)) {
      return res.status(400).json({ message: 'Invalid property ID' })
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' })
    }

    const propertyExists = await Property.findById(property)

    if (!propertyExists) {
      return res.status(404).json({ message: 'Property not found' })
    }

    const inquiry = await Inquiry.create({
      property,
      sender: req.user._id,
      message: message.trim(),
    })

    const populatedInquiry = await populateInquiry(Inquiry.findById(inquiry._id))

    res.status(201).json({
      success: true,
      message: 'Inquiry sent successfully',
      data: populatedInquiry,
    })
  } catch (error) {
    console.error('Create inquiry error:', error.message)

    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0]
      return res.status(400).json({ message: firstError.message })
    }

    res.status(500).json({ message: 'Unable to send inquiry' })
  }
}

const getMyInquiries = async (req, res) => {
  try {
    const filter = {}

    if (req.user.role === 'admin') {
      // Admin sees all inquiries.
    } else if (['seller', 'agent'].includes(req.user.role)) {
      filter.property = { $in: await getOwnedPropertyIds(req.user._id) }
    } else {
      filter.sender = req.user._id
    }

    const inquiries = await populateInquiry(Inquiry.find(filter).sort({ createdAt: -1 }))

    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    })
  } catch (error) {
    console.error('Get inquiries error:', error.message)
    res.status(500).json({ message: 'Unable to load inquiries' })
  }
}

const updateInquiryStatus = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid inquiry ID' })
    }

    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: 'Status must be new, contacted, or closed' })
    }

    const inquiry = await Inquiry.findById(req.params.id).populate(propertyPopulate)

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' })
    }

    if (!canManageInquiry(req.user, inquiry)) {
      return res.status(403).json({ message: 'You can only update inquiries for your listings' })
    }

    inquiry.status = req.body.status
    await inquiry.save()

    const updatedInquiry = await populateInquiry(Inquiry.findById(inquiry._id))

    res.json({
      success: true,
      message: 'Inquiry status updated successfully',
      data: updatedInquiry,
    })
  } catch (error) {
    console.error('Update inquiry status error:', error.message)
    res.status(500).json({ message: 'Unable to update inquiry status' })
  }
}

module.exports = {
  createInquiry,
  getMyInquiries,
  updateInquiryStatus,
}
