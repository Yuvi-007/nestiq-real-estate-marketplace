import { formatPrice } from './formatPrice'

const confidenceLabels = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LIMITED: 'Limited',
}

const nextActions = {
  CONTACT: 'Contact agent',
  VISIT: 'Schedule visit',
  COMPARE: 'Compare properties',
  VERIFY: 'Check verification',
  NEARBY: 'Review nearby insights',
}

const keywordGroups = [
  {
    category: 'family',
    keywords: ['family', 'families', 'kids', 'children', 'school', 'schools', 'hospital', 'safe', 'lifestyle'],
  },
  {
    category: 'price',
    keywords: ['price', 'fair', 'valuation', 'value', 'cost', 'expensive', 'cheap', 'overpriced', 'budget'],
  },
  {
    category: 'beforeContact',
    keywords: ['before contacting', 'contacting', 'before contact', 'ask agent', 'agent', 'visit', 'tour', 'inspect'],
  },
  {
    category: 'risks',
    keywords: ['risk', 'risks', 'warning', 'warnings', 'concern', 'concerns', 'problem', 'issue', 'issues', 'check'],
  },
  {
    category: 'strengths',
    keywords: ['strength', 'strengths', 'best', 'good', 'highlight', 'highlights', 'why', 'standout'],
  },
  {
    category: 'verification',
    keywords: ['verified', 'verification', 'trust', 'trustworthy', 'safe', 'documents', 'legal'],
  },
  {
    category: 'investment',
    keywords: ['investment', 'invest', 'rent', 'rental', 'resale', 'roi', 'appreciation', 'yield'],
  },
  {
    category: 'amenities',
    keywords: ['amenity', 'amenities', 'facility', 'facilities', 'parking', 'pool', 'gym', 'security', 'lift'],
  },
]

const normalizeText = (value = '') => String(value).toLowerCase()

const asNumber = (value) => {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue : 0
}

const toList = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean).map(String)
  return [String(value)]
}

const formatArea = (area) => {
  const numericArea = asNumber(area)
  return numericArea ? `${numericArea.toLocaleString('en-IN')} sqft` : 'area not listed'
}

const getVerificationLabel = (status) => {
  const normalizedStatus = normalizeText(status)

  if (normalizedStatus === 'approved' || normalizedStatus === 'verified') return 'verified'
  if (normalizedStatus === 'pending' || normalizedStatus === 'in_review') return 'pending verification'
  if (normalizedStatus === 'rejected') return 'not verified'

  return 'verification status unavailable'
}

const getPriceBand = (priceScore) => {
  const score = asNumber(priceScore)

  if (score >= 8) return 'fair'
  if (score >= 6) return 'slightly high'
  if (score >= 4) return 'premium'
  if (score > 0) return 'needs review'

  return 'unknown'
}

const getConfidence = ({ hasTrustScore, hasVerification, hasLifestyle }) => {
  if (hasTrustScore && hasVerification && hasLifestyle) return confidenceLabels.HIGH
  if (hasTrustScore || hasVerification || hasLifestyle) return confidenceLabels.MEDIUM
  return confidenceLabels.LIMITED
}

export const suggestedNestIQQuestions = [
  'Is this property good for families?',
  'Is the price fair?',
  'What are the main risks?',
  'What are the best strengths?',
  'Is this property verified?',
  'Is it good for investment?',
  'What amenities stand out?',
  'What should I check before contacting the agent?',
]

export const getAssistantCategory = (question = '') => {
  const normalizedQuestion = normalizeText(question)

  const match = keywordGroups.find((group) => (
    group.keywords.some((keyword) => normalizedQuestion.includes(keyword))
  ))

  return match?.category || 'overview'
}

const buildContext = (property = {}, lifestyleInsights) => {
  const trustScore = property.trustScore || {}
  const amenities = toList(property.amenities)
  const strengths = toList(trustScore.strengths)
  const warnings = toList(trustScore.warnings)
  const riskReasons = toList(trustScore.riskReasons)
  const city = property.location?.city || 'this city'
  const verificationStatus = getVerificationLabel(property.verification?.status)
  const price = asNumber(property.price)
  const area = asNumber(property.area)
  const pricePerSqft = price && area ? Math.round(price / area) : 0
  const hasTrustScore = Boolean(property.trustScore)
  const hasVerification = Boolean(property.verification?.status)
  const hasLifestyle = Boolean(lifestyleInsights)

  return {
    title: property.title || 'This property',
    price,
    formattedPrice: price ? formatPrice(price) : 'price unavailable',
    area,
    formattedArea: formatArea(area),
    bhk: property.bhk || property.bedrooms || 'BHK not listed',
    bathrooms: property.bathrooms || 'bathrooms not listed',
    furnishing: property.furnishing || 'furnishing not listed',
    city,
    amenities,
    strengths,
    warnings,
    riskReasons,
    trustScore,
    riskLevel: trustScore.riskLevel || 'UNKNOWN',
    overallScore: trustScore.overallScore,
    priceScore: asNumber(trustScore.priceScore),
    priceBand: getPriceBand(trustScore.priceScore),
    verificationStatus,
    pricePerSqft,
    lifestyleInsights,
    confidence: getConfidence({ hasTrustScore, hasVerification, hasLifestyle }),
  }
}

const getTrustSummary = (context) => (
  context.overallScore ? `Trust Score is ${context.overallScore}/10 with ${context.riskLevel} risk.` : 'Trust Score is not available for this listing.'
)

const getDefaultWarnings = (context) => {
  const warnings = [...context.warnings, ...context.riskReasons]

  if (context.verificationStatus !== 'verified') {
    warnings.push(`Listing is ${context.verificationStatus}.`)
  }

  if (!context.pricePerSqft) {
    warnings.push('Price per sqft cannot be calculated because price or area data is missing.')
  }

  return warnings.length ? warnings : ['No major rule-based warnings are listed, but documents and site condition still need manual checks.']
}

const answerFamily = (context) => ({
  shortAnswer: context.lifestyleInsights?.familyScore >= 8
    ? 'This looks family-friendly based on the listed home details and city-level lifestyle signals.'
    : 'This may work for families, but the family-fit signal is limited and should be verified locally.',
  bullets: [
    `${context.bhk} BHK, ${context.bathrooms} bathrooms, and ${context.formattedArea} are the core space signals available.`,
    `City insight for ${context.city}: ${context.lifestyleInsights?.shortSummary || 'sample local insight is limited.'}`,
    `Nearby sample categories include schools, hospitals, transit, and shopping access where available.`,
    getTrustSummary(context),
  ],
  confidence: context.confidence,
  nextAction: nextActions.NEARBY,
})

const answerPrice = (context) => ({
  shortAnswer: context.priceBand === 'fair'
    ? 'The price appears fair in NestIQ rule-based checks.'
    : 'The price needs comparison before you treat it as fair.',
  bullets: [
    `Listing price is ${context.formattedPrice}${context.pricePerSqft ? `, about ${formatPrice(context.pricePerSqft)} per sqft` : ''}.`,
    `Price fairness signal is ${context.priceBand}${context.priceScore ? ` with a ${context.priceScore}/10 price score` : ''}.`,
    `${context.formattedArea} is the declared area used for this calculation.`,
    'Compare against similar listings before making a financial decision.',
  ],
  confidence: context.priceScore ? context.confidence : confidenceLabels.LIMITED,
  nextAction: nextActions.COMPARE,
})

const answerRisks = (context) => ({
  shortAnswer: context.riskLevel === 'LOW'
    ? 'No major rule-based risk is visible, but verification still matters.'
    : 'There are some risk signals worth reviewing before you proceed.',
  bullets: [
    ...getDefaultWarnings(context).slice(0, 4),
    getTrustSummary(context),
  ],
  confidence: context.confidence,
  nextAction: context.verificationStatus === 'verified' ? nextActions.VISIT : nextActions.VERIFY,
})

const answerStrengths = (context) => ({
  shortAnswer: 'The strongest signals come from listing completeness, amenities, and local lifestyle context.',
  bullets: [
    ...(context.strengths.length ? context.strengths.slice(0, 3) : ['No Trust Score strengths are listed yet.']),
    `${context.amenities.length ? `${context.amenities.slice(0, 4).join(', ')} amenities are listed.` : 'Amenities are limited or unavailable.'}`,
    `${context.city} lifestyle note: ${context.lifestyleInsights?.shortSummary || 'city-level insight is limited.'}`,
  ],
  confidence: context.confidence,
  nextAction: nextActions.VISIT,
})

const answerVerification = (context) => ({
  shortAnswer: context.verificationStatus === 'verified'
    ? 'This listing is marked verified in the current NestIQ data.'
    : 'This listing is not fully verified in the current NestIQ data.',
  bullets: [
    `Current verification status: ${context.verificationStatus}.`,
    getTrustSummary(context),
    'Ask the agent to confirm ownership, approvals, maintenance dues, and any pending disputes before paying token money.',
  ],
  confidence: context.verificationStatus === 'verification status unavailable' ? confidenceLabels.LIMITED : context.confidence,
  nextAction: context.verificationStatus === 'verified' ? nextActions.CONTACT : nextActions.VERIFY,
})

const answerInvestment = (context) => ({
  shortAnswer: context.lifestyleInsights?.investmentScore >= 8
    ? 'The city-level investment signal is strong, but deal quality still depends on price and verification.'
    : 'Investment potential is moderate or unclear from the available listing data.',
  bullets: [
    `${context.city} investment score is ${context.lifestyleInsights?.investmentScore || 'not available'}/10 in sample insights.`,
    `Price signal is ${context.priceBand}, and the listing price is ${context.formattedPrice}.`,
    `${context.verificationStatus === 'verified' ? 'Verification supports confidence.' : 'Verification should be checked before treating this as investment-ready.'}`,
    'Rental yield, society rules, taxes, and resale demand are not calculated by this demo assistant.',
  ],
  confidence: context.confidence,
  nextAction: nextActions.COMPARE,
})

const answerAmenities = (context) => ({
  shortAnswer: context.amenities.length
    ? 'Several amenities stand out from the listing data.'
    : 'Amenity data is limited for this property.',
  bullets: context.amenities.length
    ? [
      `Listed amenities include ${context.amenities.slice(0, 6).join(', ')}.`,
      `Furnishing status is ${context.furnishing}.`,
      'Confirm amenity access, maintenance charges, parking allocation, and operating hours during the visit.',
    ]
    : [
      'No detailed amenities are available in the current listing data.',
      `Furnishing status is ${context.furnishing}.`,
      'Ask the agent for society facilities, parking, lift backup, security, and maintenance charges.',
    ],
  confidence: context.amenities.length ? confidenceLabels.MEDIUM : confidenceLabels.LIMITED,
  nextAction: nextActions.VISIT,
})

const answerBeforeContact = (context) => ({
  shortAnswer: 'Before contacting the agent, review verification, pricing, and site-visit questions.',
  bullets: [
    `Confirm why the listing is ${context.verificationStatus}.`,
    `Compare ${context.formattedPrice} against similar ${context.bhk} BHK properties in ${context.city}.`,
    'Ask for ownership proof, approvals, maintenance dues, possession timeline, and exact carpet/built-up area.',
    'Use nearby insights to verify commute, schools, hospitals, and daily convenience fit.',
  ],
  confidence: context.confidence,
  nextAction: context.verificationStatus === 'verified' ? nextActions.CONTACT : nextActions.VERIFY,
})

const answerOverview = (context) => ({
  shortAnswer: `${context.title} can be assessed from price, trust, verification, amenities, and nearby lifestyle signals.`,
  bullets: [
    `${context.bhk} BHK in ${context.city}, priced at ${context.formattedPrice}.`,
    getTrustSummary(context),
    `Verification is ${context.verificationStatus}.`,
    `${context.amenities.length ? `Top amenities listed: ${context.amenities.slice(0, 3).join(', ')}.` : 'Amenity data is limited.'}`,
  ],
  confidence: context.confidence,
  nextAction: nextActions.COMPARE,
})

const answerByCategory = {
  family: answerFamily,
  price: answerPrice,
  risks: answerRisks,
  strengths: answerStrengths,
  verification: answerVerification,
  investment: answerInvestment,
  amenities: answerAmenities,
  beforeContact: answerBeforeContact,
  overview: answerOverview,
}

export const askPropertyAssistant = ({ property, question, lifestyleInsights }) => {
  const context = buildContext(property, lifestyleInsights)
  const category = getAssistantCategory(question)
  const answer = answerByCategory[category](context)

  return {
    category,
    question,
    ...answer,
  }
}
