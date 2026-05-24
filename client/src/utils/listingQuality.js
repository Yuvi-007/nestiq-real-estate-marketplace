const getPlainValue = (value) => (value === undefined || value === null ? '' : String(value).trim())
const hasValue = (value) => getPlainValue(value).length > 0
const isPositiveNumber = (value) => Number(value) > 0

const getImages = (data) => {
  const uploadedImages = data.uploadedImages || []
  const uploadedUrls = uploadedImages.map((image) => image.url).filter(Boolean)
  const directImages = Array.isArray(data.images) ? data.images : []
  const manualImages = getPlainValue(data.imagesText)
    .split('\n')
    .map((url) => url.trim())
    .filter(Boolean)

  return [...uploadedUrls, ...directImages, ...manualImages]
}

const getAmenities = (data) => {
  if (Array.isArray(data.amenities)) return data.amenities

  return getPlainValue(data.amenitiesText)
    .split(',')
    .map((amenity) => amenity.trim())
    .filter(Boolean)
}

export const calculateListingQuality = (data = {}) => {
  const description = getPlainValue(data.description)
  const location = data.location || {}
  const images = getImages(data)
  const amenities = getAmenities(data)

  const items = [
    {
      key: 'title',
      label: 'Title added',
      complete: hasValue(data.title),
      tip: 'Add a specific, buyer-friendly listing title.',
    },
    {
      key: 'description',
      label: 'Description has at least 100 characters',
      complete: description.length >= 100,
      tip: 'Explain layout, condition, locality, ownership context, and buyer highlights.',
    },
    {
      key: 'price',
      label: 'Valid price added',
      complete: isPositiveNumber(data.price),
      tip: 'Add a realistic asking price so buyers can compare quickly.',
    },
    {
      key: 'address',
      label: 'City and address added',
      complete: hasValue(location.city) && hasValue(location.address),
      tip: 'Add both city and full address or locality.',
    },
    {
      key: 'coordinates',
      label: 'Latitude and longitude added',
      complete: hasValue(location.lat) && hasValue(location.lng),
      tip: 'Map coordinates improve buyer confidence and map discovery.',
    },
    {
      key: 'images',
      label: 'At least 3 images uploaded',
      complete: images.length >= 3,
      tip: 'Upload exterior, living area, bedroom, kitchen, and building photos.',
    },
    {
      key: 'dimensions',
      label: 'BHK, bathrooms, and area added',
      complete: isPositiveNumber(data.bhk) && isPositiveNumber(data.bathrooms) && isPositiveNumber(data.area),
      tip: 'Add core size details so buyers can shortlist accurately.',
    },
    {
      key: 'amenities',
      label: 'Amenities added',
      complete: amenities.length > 0,
      tip: 'List key amenities like parking, security, gym, lift, pool, or power backup.',
    },
    {
      key: 'finish',
      label: 'Furnishing and facing added',
      complete: hasValue(data.furnishing) && hasValue(data.facing),
      tip: 'Add furnishing and facing details for better decision clarity.',
    },
    {
      key: 'documents',
      label: 'Verification documents submitted',
      complete: Boolean(data.documents?.length || data.verificationDocuments?.length),
      tip: 'Document verification can be connected later for stronger listing trust.',
      optionalFuture: true,
    },
  ]

  const completedCount = items.filter((item) => item.complete).length
  const completionScore = Math.round((completedCount / items.length) * 100)

  return {
    completionScore,
    completedItems: items.filter((item) => item.complete),
    incompleteItems: items.filter((item) => !item.complete),
    items,
  }
}

export const getListingQualityLabel = (score) => {
  if (score >= 85) return { label: 'Excellent', variant: 'success' }
  if (score >= 70) return { label: 'Good', variant: 'accent' }
  return { label: 'Needs Work', variant: 'danger' }
}
