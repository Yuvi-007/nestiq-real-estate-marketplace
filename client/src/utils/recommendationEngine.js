export const RECOMMENDATION_STORAGE_KEY = 'nestiq-recommendation-preferences'

const budgetRanges = {
  'under-50l': { label: 'Under Rs 50L', min: 0, max: 5000000 },
  '50l-1cr': { label: 'Rs 50L - Rs 1Cr', min: 5000000, max: 10000000 },
  '1cr-2cr': { label: 'Rs 1Cr - Rs 2Cr', min: 10000000, max: 20000000 },
  '2cr-plus': { label: 'Rs 2Cr+', min: 20000000, max: Infinity },
  'rent-under-50k': { label: 'Rent under Rs 50K/mo', min: 0, max: 50000 },
  'rent-50k-plus': { label: 'Rent Rs 50K+/mo', min: 50000, max: Infinity },
}

const normalize = (value) => String(value || '').trim().toLowerCase()

const includesAny = (values = [], keywords = []) => {
  const normalizedValues = values.map(normalize)
  return keywords.some((keyword) => normalizedValues.some((value) => value.includes(normalize(keyword))))
}

const getTrustScore = (property) => Number(property.trustScore?.overallScore || property.trustScore || 0)

const getRiskLevel = (property) => normalize(property.trustScore?.riskLevel || property.riskLevel || 'medium')

const getPropertyCity = (property) => property.location?.city || property.city || ''

const getPropertyType = (property) => property.type || property.propertyType || ''

const isVerified = (property) => property.verification?.status === 'verified'

const clampScore = (score) => Math.max(0, Math.min(100, Math.round(score)))

const pushUnique = (list, value) => {
  if (value && !list.includes(value)) {
    list.push(value)
  }
}

const getLabel = (score) => {
  if (score >= 82) return 'Best Match'
  if (score >= 62) return 'Good Match'
  return 'Consider Carefully'
}

export const getBudgetRange = (key) => budgetRanges[key]

export const saveRecommendationPreferences = (preferences, results = []) => {
  if (typeof window === 'undefined') return

  localStorage.setItem(
    RECOMMENDATION_STORAGE_KEY,
    JSON.stringify({
      preferences,
      results: results.slice(0, 6).map((item) => ({
        propertyId: item.property._id,
        matchScore: item.matchScore,
        label: item.label,
        matchedReasons: item.matchedReasons,
        missingPreferences: item.missingPreferences,
        shortExplanation: item.shortExplanation,
      })),
      savedAt: new Date().toISOString(),
    }),
  )
}

export const getRecommendationPreferences = () => {
  if (typeof window === 'undefined') return null

  try {
    return JSON.parse(localStorage.getItem(RECOMMENDATION_STORAGE_KEY))
  } catch {
    return null
  }
}

export const scoreProperty = (property, preferences = {}) => {
  let score = 18
  const matchedReasons = []
  const missingPreferences = []
  const amenities = property.amenities || []
  const furnishing = normalize(property.furnishing)
  const propertyCity = normalize(getPropertyCity(property))
  const propertyType = normalize(getPropertyType(property))
  const selectedBudget = getBudgetRange(preferences.budget)
  const trustScore = getTrustScore(property)
  const riskLevel = getRiskLevel(property)

  if (preferences.city) {
    if (propertyCity === normalize(preferences.city)) {
      score += 16
      matchedReasons.push(`Located in ${preferences.city}`)
    } else {
      missingPreferences.push(`Preferred city was ${preferences.city}`)
      score -= 6
    }
  }

  if (selectedBudget) {
    const price = Number(property.price || 0)
    if (price >= selectedBudget.min && price <= selectedBudget.max) {
      score += 14
      matchedReasons.push(`Fits your ${selectedBudget.label} budget`)
    } else {
      missingPreferences.push(`Outside your ${selectedBudget.label} budget`)
      score -= 8
    }
  }

  if (preferences.intent) {
    const listingMode = normalize(property.listingType || property.mode || '')
    if (!listingMode || listingMode.includes(normalize(preferences.intent)) || normalize(preferences.intent) === 'buy') {
      score += 6
      matchedReasons.push(`Works for ${preferences.intent}`)
    } else {
      missingPreferences.push(`Listing intent may not match ${preferences.intent}`)
    }
  }

  if (preferences.propertyType) {
    if (propertyType.includes(normalize(preferences.propertyType))) {
      score += 10
      matchedReasons.push(`${preferences.propertyType} property type`)
    } else {
      missingPreferences.push(`Not marked as ${preferences.propertyType}`)
    }
  }

  if (preferences.bhk) {
    if (Number(property.bhk) === Number(preferences.bhk)) {
      score += 10
      matchedReasons.push(`${preferences.bhk} BHK match`)
    } else if (Number(property.bhk) > Number(preferences.bhk)) {
      score += 5
      matchedReasons.push(`More rooms than requested`)
    } else {
      missingPreferences.push(`Below requested ${preferences.bhk} BHK`)
      score -= 5
    }
  }

  const amenityChecks = [
    ['parking', preferences.parking, ['parking']],
    ['gym', preferences.gym, ['gym', 'fitness']],
    ['pool', preferences.pool, ['pool', 'swimming']],
  ]

  amenityChecks.forEach(([label, needed, keywords]) => {
    if (!needed) return
    if (includesAny(amenities, keywords)) {
      score += 5
      matchedReasons.push(`Has ${label}`)
    } else {
      missingPreferences.push(`No clear ${label} signal`)
      score -= 3
    }
  })

  if (preferences.furnished) {
    if (furnishing.includes('furnished')) {
      score += 6
      matchedReasons.push('Furnished option')
    } else {
      missingPreferences.push('Furnishing does not clearly match')
    }
  }

  if (preferences.verified) {
    if (isVerified(property)) {
      score += 8
      matchedReasons.push('NestIQ verification available')
    } else {
      missingPreferences.push('Verification is not complete')
      score -= 3
    }
  } else if (isVerified(property)) {
    score += 3
    matchedReasons.push('Verified listing signal')
  }

  if (trustScore >= 80) {
    score += 8
    matchedReasons.push(`Strong Trust Score ${trustScore}`)
  } else if (trustScore >= 60) {
    score += 4
    matchedReasons.push(`Moderate Trust Score ${trustScore}`)
  } else if (trustScore > 0) {
    missingPreferences.push(`Lower Trust Score ${trustScore}`)
    score -= 4
  }

  if (riskLevel === 'low') {
    score += 5
    matchedReasons.push('Low risk signal')
  } else if (riskLevel === 'high') {
    missingPreferences.push('Higher risk signal')
    score -= 8
  }

  if (preferences.familySize === 'family' && Number(property.bhk || 0) >= 2) {
    score += 4
    matchedReasons.push('Practical for a family setup')
  }

  if (preferences.useCase === 'investment') {
    if (trustScore >= 70 || includesAny(amenities, ['security', 'parking', 'gym'])) {
      score += 5
      matchedReasons.push('Good rule-based investment signal')
    } else {
      missingPreferences.push('Limited investment confidence signals')
    }
  }

  pushUnique(matchedReasons, matchedReasons.length ? '' : 'Basic listing fit available')

  const matchScore = clampScore(score)
  const label = getLabel(matchScore)

  return {
    property,
    matchScore,
    label,
    matchedReasons: matchedReasons.slice(0, 5),
    missingPreferences: missingPreferences.slice(0, 4),
    shortExplanation:
      matchScore >= 82
        ? 'This listing lines up strongly with your selected preferences and trust signals.'
        : matchScore >= 62
          ? 'This listing matches several preferences, with a few tradeoffs to review.'
          : 'This listing may still be relevant, but it misses important preferences.',
  }
}

export const getRecommendedProperties = (properties = [], preferences = {}, limit = 6) => {
  return properties
    .map((property) => scoreProperty(property, preferences))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}
