const storageKey = 'nestiq-recent-searches'
const maxRecentSearches = 5

const safeParse = (value) => {
  try {
    return JSON.parse(value) || []
  } catch {
    return []
  }
}

export const getRecentSearches = () => {
  if (typeof window === 'undefined') return []
  return safeParse(localStorage.getItem(storageKey))
}

export const clearRecentSearches = () => {
  if (typeof window === 'undefined') return []
  localStorage.removeItem(storageKey)
  window.dispatchEvent(new Event('nestiq-recent-searches-updated'))
  return []
}

export const buildRecentSearchLabel = (filtersOrParams) => {
  const params = filtersOrParams instanceof URLSearchParams ? filtersOrParams : new URLSearchParams()

  if (!(filtersOrParams instanceof URLSearchParams)) {
    Object.entries(filtersOrParams || {}).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length) params.set(key, value.join(','))
      if (typeof value === 'boolean' && value) params.set(key, 'true')
      if (typeof value === 'string' && value) params.set(key, value)
    })
  }

  const parts = []
  const cityList = params.get('cityList')

  if (params.get('mode')) parts.push(params.get('mode'))
  if (params.get('type')) parts.push(params.get('type'))
  if (params.get('bhk')) parts.push(`${params.get('bhk')} BHK`)
  if (cityList) parts.push(`in ${cityList.split(',').slice(0, 3).join(', ')}`)
  else if (params.get('city')) parts.push(`in ${params.get('city')}`)
  if (params.get('maxPrice')) parts.push(`under Rs. ${Number(params.get('maxPrice')).toLocaleString('en-IN')}`)
  if (params.get('q')) parts.push(`matching "${params.get('q')}"`)
  if (params.get('verifiedOnly') === 'true') parts.push('verified')

  return parts.length ? parts.join(' ') : 'All NestIQ properties'
}

export const saveRecentSearch = ({ filters, queryParams }) => {
  if (typeof window === 'undefined') return null

  const params = queryParams instanceof URLSearchParams ? queryParams : new URLSearchParams(queryParams || '')
  const normalizedQuery = params.toString()

  if (!normalizedQuery) return null

  const currentSearches = getRecentSearches()
  const withoutDuplicate = currentSearches.filter((search) => search.queryParams !== normalizedQuery)
  const nextSearch = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
    label: buildRecentSearchLabel(filters || params),
    queryParams: normalizedQuery,
    createdAt: new Date().toISOString(),
  }
  const nextSearches = [nextSearch, ...withoutDuplicate].slice(0, maxRecentSearches)

  localStorage.setItem(storageKey, JSON.stringify(nextSearches))
  window.dispatchEvent(new Event('nestiq-recent-searches-updated'))
  return nextSearch
}
