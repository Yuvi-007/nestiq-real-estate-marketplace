const storageKey = 'nestiq-saved-searches'
const maxSavedSearches = 10

const safeParse = (value) => {
  try {
    return JSON.parse(value) || []
  } catch {
    return []
  }
}

export const getSavedSearches = () => {
  if (typeof window === 'undefined') return []
  return safeParse(localStorage.getItem(storageKey))
}

export const saveSearch = ({ label, queryParams }) => {
  const currentSearches = getSavedSearches()
  const normalizedQuery = queryParams.toString()
  const withoutDuplicate = currentSearches.filter((search) => search.queryParams !== normalizedQuery)
  const nextSearch = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
    label,
    queryParams: normalizedQuery,
    createdAt: new Date().toISOString(),
  }
  const nextSearches = [nextSearch, ...withoutDuplicate].slice(0, maxSavedSearches)

  localStorage.setItem(storageKey, JSON.stringify(nextSearches))
  window.dispatchEvent(new Event('nestiq-saved-searches-updated'))
  return nextSearch
}

export const deleteSavedSearch = (id) => {
  const nextSearches = getSavedSearches().filter((search) => search.id !== id)
  localStorage.setItem(storageKey, JSON.stringify(nextSearches))
  window.dispatchEvent(new Event('nestiq-saved-searches-updated'))
  return nextSearches
}

export const isSearchSaved = (queryParams) => {
  const normalizedQuery = queryParams.toString()
  return getSavedSearches().some((search) => search.queryParams === normalizedQuery)
}

export const buildSavedSearchLabel = (filters) => {
  const parts = []

  if (filters.type) parts.push(filters.type)
  if (filters.bhk) parts.push(`${filters.bhk === '4' ? '4+' : filters.bhk} BHK`)
  if (filters.city) parts.push(`in ${filters.city}`)
  if (filters.maxPrice) parts.push(`under Rs. ${Number(filters.maxPrice).toLocaleString('en-IN')}`)
  if (filters.minPrice && !filters.maxPrice) parts.push(`above Rs. ${Number(filters.minPrice).toLocaleString('en-IN')}`)
  if (filters.q) parts.push(`matching "${filters.q}"`)

  return parts.length ? parts.join(' ') : 'All NestIQ properties'
}
