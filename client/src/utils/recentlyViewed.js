const STORAGE_KEY = 'nestiq_recently_viewed'
const MAX_RECENT_PROPERTIES = 4

export const getRecentlyViewed = () => {
  try {
    const storedProperties = localStorage.getItem(STORAGE_KEY)
    return storedProperties ? JSON.parse(storedProperties) : []
  } catch {
    return []
  }
}

export const saveRecentlyViewed = (property) => {
  if (!property?._id) {
    return
  }

  const currentProperties = getRecentlyViewed()
  const nextProperties = [
    property,
    ...currentProperties.filter((item) => item._id !== property._id),
  ].slice(0, MAX_RECENT_PROPERTIES)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProperties))
}

export const clearRecentlyViewed = () => {
  localStorage.removeItem(STORAGE_KEY)
}
