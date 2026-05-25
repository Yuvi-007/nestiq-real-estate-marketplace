const clamp = (value, min = 0, max = 10) => Math.min(Math.max(value, min), max)

const roundScore = (value) => Number(clamp(value).toFixed(1))

const hasCoordinate = (value) => value !== undefined && value !== null && value !== '' && !Number.isNaN(Number(value))

const getPlainProperty = (property) => (property?.toObject ? property.toObject() : property || {})

const getPricePerSqft = (property) => {
  const price = Number(property.price || 0)
  const area = Number(property.area || 0)

  if (!price || !area) {
    return 0
  }

  return price / area
}

// Rule-based and AI-ready: every signal below is deterministic today, but the
// output shape can later be enriched by ML/LLM services without changing APIs.
const calculatePropertyScore = (propertyInput) => {
  const property = getPlainProperty(propertyInput)
  const agent = property.agent || {}
  const descriptionLength = (property.description || '').trim().length
  const imagesCount = property.images?.length || 0
  const amenitiesCount = property.amenities?.length || 0
  const pricePerSqft = getPricePerSqft(property)
  const hasLatLng = hasCoordinate(property.location?.lat) && hasCoordinate(property.location?.lng)
  const missingFields = []
  const riskReasons = []
  const strengths = []
  const warnings = []
  const verification = property.verification || {}
  const documentsCount = verification.documents?.length || 0

  ;['title', 'description', 'type', 'price', 'area', 'bhk', 'bathrooms'].forEach((field) => {
    if (property[field] === undefined || property[field] === null || property[field] === '') {
      missingFields.push(field)
    }
  })

  if (!property.location?.address) missingFields.push('address')
  if (!property.location?.city) missingFields.push('city')
  if (!hasLatLng) missingFields.push('coordinates')

  let mediaScore = 0
  if (imagesCount >= 8) mediaScore = 10
  else if (imagesCount >= 5) mediaScore = 8.5
  else if (imagesCount >= 3) mediaScore = 7
  else if (imagesCount >= 1) mediaScore = 4.5

  let listingCompletenessScore = 10
  listingCompletenessScore -= missingFields.length * 0.9
  if (descriptionLength < 80) listingCompletenessScore -= 2
  else if (descriptionLength < 180) listingCompletenessScore -= 0.8
  if (amenitiesCount === 0) listingCompletenessScore -= 1.2
  else if (amenitiesCount >= 5) listingCompletenessScore += 0.4
  listingCompletenessScore = roundScore(listingCompletenessScore)

  let locationScore = hasLatLng ? 9 : 5
  if (property.location?.address && property.location?.city) locationScore += 0.8
  if (!property.location?.address || !property.location?.city) locationScore -= 1.5
  locationScore = roundScore(locationScore)

  let priceScore = 8
  if (!pricePerSqft) {
    priceScore = 4
  } else if (pricePerSqft < 1200 || pricePerSqft > 50000) {
    priceScore = 3.5
  } else if (pricePerSqft < 2500 || pricePerSqft > 30000) {
    priceScore = 5.5
  } else if (pricePerSqft >= 4500 && pricePerSqft <= 18000) {
    priceScore = 9
  }
  priceScore = roundScore(priceScore)

  let agentTrustScore = agent?._id || agent?.name || property.agent ? 7 : 3
  if (agent?.isVerified) agentTrustScore = 10
  if (agent?.role === 'admin') agentTrustScore = Math.max(agentTrustScore, 9)
  if (verification.status === 'verified') agentTrustScore = Math.min(agentTrustScore + 0.6, 10)
  if (verification.status === 'rejected') agentTrustScore = Math.max(agentTrustScore - 2, 0)
  agentTrustScore = roundScore(agentTrustScore)

  if (verification.status === 'verified') {
    strengths.push('Property verification documents approved by admin.')
  } else if (verification.status === 'rejected') {
    riskReasons.push('Property verification was rejected')
    warnings.push(verification.rejectionReason || 'Verification documents were rejected by admin.')
  } else if (documentsCount > 0) {
    warnings.push('Verification documents are submitted and awaiting admin review.')
  } else {
    warnings.push('Property verification documents are not submitted.')
  }

  if (imagesCount === 0) {
    riskReasons.push('No listing images uploaded')
    warnings.push('Missing images reduce buyer confidence.')
  } else if (imagesCount >= 5) {
    strengths.push('Strong media coverage with multiple images.')
  }

  if (!hasLatLng) {
    riskReasons.push('Location coordinates are missing')
    warnings.push('Map confidence is limited without latitude and longitude.')
  } else {
    strengths.push('Precise map coordinates are available.')
  }

  if (descriptionLength < 80) {
    riskReasons.push('Description has very low detail')
    warnings.push('Description should explain layout, condition, locality, and ownership context.')
  } else if (descriptionLength >= 180) {
    strengths.push('Detailed description improves listing transparency.')
  }

  if (!pricePerSqft) {
    riskReasons.push('Price per sqft cannot be calculated')
    warnings.push('Area and price are needed for value checks.')
  } else if (pricePerSqft < 1200) {
    riskReasons.push('Price per sqft is suspiciously low')
    warnings.push('Price appears far below normal sanity range.')
  } else if (pricePerSqft > 50000) {
    riskReasons.push('Price per sqft is suspiciously high')
    warnings.push('Price appears far above normal sanity range.')
  } else if (priceScore >= 8) {
    strengths.push('Price per sqft is within the expected sanity range.')
  }

  if (!agent?._id && !agent?.name && !property.agent) {
    riskReasons.push('Agent information is missing')
    warnings.push('Buyer follow-up may be harder without an agent profile.')
  } else if (agent?.isVerified) {
    strengths.push('Verified agent profile attached.')
  } else {
    warnings.push('Agent profile is present but not verified.')
  }

  if (property.status && property.status !== 'active') {
    warnings.push(`Listing status is ${property.status}.`)
  }

  if (missingFields.length > 0) {
    warnings.push(`Missing fields: ${missingFields.join(', ')}.`)
  }

  const overallScore = roundScore(
    priceScore * 0.24 +
      listingCompletenessScore * 0.24 +
      locationScore * 0.18 +
      mediaScore * 0.18 +
      agentTrustScore * 0.16,
  )

  let riskLevel = 'LOW'
  if (overallScore < 5.5 || riskReasons.length >= 3) {
    riskLevel = 'HIGH'
  } else if (overallScore < 7.2 || riskReasons.length >= 1 || warnings.length >= 3) {
    riskLevel = 'MEDIUM'
  }

  if (strengths.length === 0) {
    strengths.push('Baseline listing information is available for review.')
  }

  return {
    overallScore,
    priceScore,
    listingCompletenessScore,
    locationScore,
    mediaScore: roundScore(mediaScore),
    agentTrustScore,
    riskLevel,
    riskReasons,
    strengths,
    warnings,
  }
}

const attachTrustScore = (property) => {
  const propertyObject = getPlainProperty(property)

  return {
    ...propertyObject,
    trustScore: calculatePropertyScore(propertyObject),
  }
}

module.exports = {
  attachTrustScore,
  calculatePropertyScore,
}
