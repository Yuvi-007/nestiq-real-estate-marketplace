const mongoose = require('mongoose')
const Property = require('../models/Property')
const User = require('../models/User')

const agentFields = 'name avatar phone email'

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getSortOption = (sort) => {
  switch (sort) {
    case 'priceAsc':
      return { price: 1 }
    case 'priceDesc':
      return { price: -1 }
    case 'oldest':
      return { createdAt: 1 }
    case 'views':
      return { views: -1 }
    case 'latest':
    default:
      return { createdAt: -1 }
  }
}

const addNumberFilter = (filter, field, value, operator) => {
  if (value === undefined || value === '') {
    return null
  }

  const numberValue = Number(value)

  if (Number.isNaN(numberValue)) {
    return `${field} must be a valid number`
  }

  if (operator) {
    filter[field] = {
      ...filter[field],
      [operator]: numberValue,
    }
    return null
  }

  filter[field] = numberValue
  return null
}

const buildPropertyFilter = (query, includeTextSearch = false) => {
  const filter = { status: 'active' }
  const errors = []

  if (query.city) {
    filter['location.city'] = new RegExp(`^${escapeRegex(query.city)}$`, 'i')
  }

  if (query.type) {
    filter.type = query.type
  }

  if (query.bhk !== undefined && query.bhk !== '') {
    const error = addNumberFilter(filter, 'bhk', query.bhk)
    if (error) errors.push(error)
  }

  if (query.minPrice !== undefined && query.minPrice !== '') {
    const error = addNumberFilter(filter, 'price', query.minPrice, '$gte')
    if (error) errors.push('minPrice must be a valid number')
  }

  if (query.maxPrice !== undefined && query.maxPrice !== '') {
    const error = addNumberFilter(filter, 'price', query.maxPrice, '$lte')
    if (error) errors.push('maxPrice must be a valid number')
  }

  if (query.amenities) {
    const amenities = query.amenities
      .split(',')
      .map((amenity) => amenity.trim())
      .filter(Boolean)

    if (amenities.length > 0) {
      filter.amenities = { $all: amenities.map((amenity) => new RegExp(`^${escapeRegex(amenity)}$`, 'i')) }
    }
  }

  if (includeTextSearch && query.q) {
    const searchRegex = new RegExp(escapeRegex(query.q), 'i')
    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { 'location.address': searchRegex },
      { 'location.city': searchRegex },
      { amenities: searchRegex },
    ]
  }

  return { filter, errors }
}

const getPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1)
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50)
  const skip = (page - 1) * limit

  return { page, limit, skip }
}

const hasValue = (value) => value !== undefined && value !== null && value !== ''

const validatePropertyPayload = (body) => {
  const requiredFields = ['title', 'description', 'type', 'price', 'bhk', 'bathrooms', 'area']
  const missingField = requiredFields.find((field) => !hasValue(body[field]))

  if (missingField) {
    return `${missingField} is required`
  }

  if (
    !body.location ||
    !hasValue(body.location.address) ||
    !hasValue(body.location.city) ||
    !hasValue(body.location.lat) ||
    !hasValue(body.location.lng)
  ) {
    return 'location.address, location.city, location.lat, and location.lng are required'
  }

  return null
}

const buildPropertyPayload = (body, agentId) => ({
  title: body.title,
  description: body.description,
  type: body.type,
  price: body.price,
  location: {
    address: body.location?.address,
    city: body.location?.city,
    lat: body.location?.lat,
    lng: body.location?.lng,
  },
  images: body.images || [],
  amenities: body.amenities || [],
  bhk: body.bhk,
  bathrooms: body.bathrooms,
  area: body.area,
  floor: body.floor,
  furnishing: body.furnishing,
  facing: body.facing,
  status: body.status || 'active',
  badge: body.badge,
  agent: agentId,
})

const canManageProperty = (user, property) =>
  user.role === 'admin' || property.agent.toString() === user._id.toString()

const getProperties = async (req, res) => {
  try {
    const { filter, errors } = buildPropertyFilter(req.query)

    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0] })
    }

    const { page, limit, skip } = getPagination(req.query)
    const sortOption = getSortOption(req.query.sort)

    const [properties, total] = await Promise.all([
      Property.find(filter).populate('agent', agentFields).sort(sortOption).skip(skip).limit(limit),
      Property.countDocuments(filter),
    ])

    res.json({
      success: true,
      count: properties.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: properties,
    })
  } catch (error) {
    console.error('Get properties error:', error)
    res.status(500).json({ message: 'Unable to fetch properties' })
  }
}

const searchProperties = async (req, res) => {
  try {
    const { filter, errors } = buildPropertyFilter(req.query, true)

    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0] })
    }

    const sortOption = getSortOption(req.query.sort)
    const properties = await Property.find(filter).populate('agent', agentFields).sort(sortOption)

    res.json({
      success: true,
      count: properties.length,
      data: properties,
    })
  } catch (error) {
    console.error('Search properties error:', error)
    res.status(500).json({ message: 'Unable to search properties' })
  }
}

const getPropertyById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid property ID' })
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true },
    ).populate('agent', agentFields)

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    res.json({
      success: true,
      data: property,
    })
  } catch (error) {
    console.error('Get property by ID error:', error)
    res.status(500).json({ message: 'Unable to fetch property' })
  }
}

const createProperty = async (req, res) => {
  try {
    const validationError = validatePropertyPayload(req.body)

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const property = await Property.create(buildPropertyPayload(req.body, req.user._id))
    const populatedProperty = await property.populate('agent', agentFields)

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: populatedProperty,
    })
  } catch (error) {
    console.error('Create property error:', error)
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0]
      return res.status(400).json({ message: firstError.message })
    }

    res.status(500).json({ message: 'Unable to create property' })
  }
}

const updateProperty = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid property ID' })
    }

    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    if (!canManageProperty(req.user, property)) {
      return res.status(403).json({ message: 'You can only update your own listings' })
    }

    const updatePayload = buildPropertyPayload(
      {
        ...property.toObject(),
        ...req.body,
        location: {
          ...property.location?.toObject?.(),
          ...req.body.location,
        },
      },
      property.agent,
    )

    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true,
    }).populate('agent', agentFields)

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: updatedProperty,
    })
  } catch (error) {
    console.error('Update property error:', error)
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0]
      return res.status(400).json({ message: firstError.message })
    }

    res.status(500).json({ message: 'Unable to update property' })
  }
}

const deleteProperty = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid property ID' })
    }

    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    if (!canManageProperty(req.user, property)) {
      return res.status(403).json({ message: 'You can only delete your own listings' })
    }

    await property.deleteOne()

    res.json({
      success: true,
      message: 'Property deleted successfully',
    })
  } catch (error) {
    console.error('Delete property error:', error)
    res.status(500).json({ message: 'Unable to delete property' })
  }
}

const saveProperty = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid property ID' })
    }

    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    const propertyId = property._id.toString()
    const savedIds = req.user.savedProperties.map((id) => id.toString())
    const alreadySaved = savedIds.includes(propertyId)

    req.user.savedProperties = alreadySaved
      ? savedIds.filter((id) => id !== propertyId)
      : [...new Set([...savedIds, propertyId])]

    await req.user.save()

    const updatedUser = await User.findById(req.user._id)
      .select('savedProperties')
      .populate({
        path: 'savedProperties',
        populate: {
          path: 'agent',
          select: agentFields,
        },
      })

    res.json({
      success: true,
      saved: !alreadySaved,
      message: alreadySaved ? 'Property removed from saved list' : 'Property saved successfully',
      savedProperties: updatedUser.savedProperties,
    })
  } catch (error) {
    console.error('Save property error:', error.message)
    res.status(500).json({ message: 'Unable to update saved property' })
  }
}

module.exports = {
  getProperties,
  searchProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  saveProperty,
}
