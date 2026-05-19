const mongoose = require('mongoose')

const Property = require('../models/Property')
const Visit = require('../models/Visit')

const userFields = 'name email phone avatar role isVerified'
const propertyPopulate = {
  path: 'property',
  populate: {
    path: 'agent',
    select: userFields,
  },
}
const allowedStatuses = ['scheduled', 'completed', 'cancelled']

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

const populateVisit = (query) => query.populate(propertyPopulate).populate('user', userFields)

const getOwnedPropertyIds = async (userId) => {
  const properties = await Property.find({ agent: userId }).select('_id')
  return properties.map((property) => property._id)
}

const canSellerManageVisit = (user, visit) => {
  if (user.role === 'admin') {
    return true
  }

  const agentId = visit.property?.agent?._id || visit.property?.agent
  return ['seller', 'agent'].includes(user.role) && agentId?.toString() === user._id.toString()
}

const createVisit = async (req, res) => {
  try {
    const { property, date, time } = req.body

    if (!isValidObjectId(property)) {
      return res.status(400).json({ message: 'Invalid property ID' })
    }

    if (!date) {
      return res.status(400).json({ message: 'Visit date is required' })
    }

    if (!time || !time.trim()) {
      return res.status(400).json({ message: 'Visit time is required' })
    }

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Visit date must be valid' })
    }

    const propertyExists = await Property.findById(property)

    if (!propertyExists) {
      return res.status(404).json({ message: 'Property not found' })
    }

    const visit = await Visit.create({
      property,
      user: req.user._id,
      date: parsedDate,
      time: time.trim(),
    })

    const populatedVisit = await populateVisit(Visit.findById(visit._id))

    res.status(201).json({
      success: true,
      message: 'Visit scheduled successfully',
      data: populatedVisit,
    })
  } catch (error) {
    console.error('Create visit error:', error.message)

    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0]
      return res.status(400).json({ message: firstError.message })
    }

    res.status(500).json({ message: 'Unable to schedule visit' })
  }
}

const getVisits = async (req, res) => {
  try {
    const filter = {}

    if (req.user.role === 'admin') {
      // Admin sees all visits.
    } else if (['seller', 'agent'].includes(req.user.role)) {
      filter.property = { $in: await getOwnedPropertyIds(req.user._id) }
    } else {
      filter.user = req.user._id
    }

    const visits = await populateVisit(Visit.find(filter).sort({ date: 1, time: 1 }))

    res.json({
      success: true,
      count: visits.length,
      data: visits,
    })
  } catch (error) {
    console.error('Get visits error:', error.message)
    res.status(500).json({ message: 'Unable to load visits' })
  }
}

const updateVisitStatus = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid visit ID' })
    }

    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: 'Status must be scheduled, completed, or cancelled' })
    }

    const visit = await Visit.findById(req.params.id).populate(propertyPopulate)

    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' })
    }

    const buyerCancellingOwnVisit =
      req.body.status === 'cancelled' && visit.user.toString() === req.user._id.toString()

    if (!buyerCancellingOwnVisit && !canSellerManageVisit(req.user, visit)) {
      return res.status(403).json({ message: 'You can only update visits for your listings' })
    }

    visit.status = req.body.status
    await visit.save()

    const updatedVisit = await populateVisit(Visit.findById(visit._id))

    res.json({
      success: true,
      message: 'Visit status updated successfully',
      data: updatedVisit,
    })
  } catch (error) {
    console.error('Update visit status error:', error.message)
    res.status(500).json({ message: 'Unable to update visit status' })
  }
}

module.exports = {
  createVisit,
  getVisits,
  updateVisitStatus,
}
