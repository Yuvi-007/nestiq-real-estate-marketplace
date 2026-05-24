import { lazy, Suspense, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'

import ActiveFilterChips from '../../components/common/ActiveFilterChips'
import CompareBar from '../../components/common/CompareBar'
import FilterSidebar from '../../components/common/FilterSidebar'
import MobileFilterDrawer from '../../components/common/MobileFilterDrawer'
import PropertyCard from '../../components/common/PropertyCard'
import PropertySearchHeader from '../../components/common/PropertySearchHeader'
import PopularSearches from '../../components/common/PopularSearches'
import QuickViewModal from '../../components/common/QuickViewModal'
import RecentlyViewed from '../../components/common/RecentlyViewed'
import PageLoader from '../../components/common/PageLoader'
import ResultsToolbar from '../../components/common/ResultsToolbar'
import SavedSearchButton from '../../components/common/SavedSearchButton'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import PageHeader from '../../components/ui/PageHeader'
import SkeletonCard from '../../components/ui/SkeletonCard'
import { useProperties } from '../../hooks/useProperties'

const initialFilters = {
  q: '',
  city: '',
  type: '',
  minPrice: '',
  maxPrice: '',
  bhk: '',
  sort: 'latest',
  mode: 'buy',
  amenities: [],
  furnishing: [],
  verifiedOnly: false,
}

const MapView = lazy(() => import('../../components/common/MapView'))

const amenityAliases = {
  Pool: ['pool', 'swimming pool', 'private pool'],
  Parking: ['parking', 'covered parking', 'private parking'],
  Gym: ['gym'],
  Security: ['security'],
  'Pet-friendly': ['pet-friendly', 'pet friendly'],
}

const getArrayParam = (searchParams, key) => {
  const value = searchParams.get(key)
  return value ? value.split(',').map((item) => item.trim()).filter(Boolean) : []
}

const getFiltersFromSearchParams = (searchParams) => ({
  ...initialFilters,
  q: searchParams.get('q') || '',
  city: searchParams.get('city') || '',
  type: searchParams.get('type') || '',
  minPrice: searchParams.get('minPrice') || '',
  maxPrice: searchParams.get('maxPrice') || '',
  bhk: searchParams.get('bhk') || '',
  sort: searchParams.get('sort') || 'latest',
  mode: searchParams.get('mode') || 'buy',
  amenities: getArrayParam(searchParams, 'amenities'),
  furnishing: getArrayParam(searchParams, 'furnishing'),
  verifiedOnly: searchParams.get('verifiedOnly') === 'true',
})

const getApiParams = (filters) => ({
  q: filters.q,
  city: filters.city,
  type: filters.type,
  minPrice: filters.minPrice,
  maxPrice: filters.maxPrice,
  bhk: filters.bhk,
  sort: filters.sort,
  page: 1,
  limit: 50,
})

const filtersToSearchParams = (filters) => {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      params.set(key, value.join(','))
      return
    }

    if (typeof value === 'boolean' && value) {
      params.set(key, 'true')
      return
    }

    if (typeof value === 'string' && value && !(key === 'sort' && value === 'latest')) {
      params.set(key, value)
    }
  })

  return params
}

const matchesAmenities = (property, selectedAmenities) => {
  if (!selectedAmenities.length) return true

  const propertyAmenities = (property.amenities || []).map((amenity) => amenity.toLowerCase())

  return selectedAmenities.every((amenity) => {
    const aliases = amenityAliases[amenity] || [amenity.toLowerCase()]
    return aliases.some((alias) => propertyAmenities.some((item) => item.includes(alias)))
  })
}

const matchesFurnishing = (property, selectedFurnishing) => {
  if (!selectedFurnishing.length) return true

  const furnishing = (property.furnishing || '').toLowerCase().replace(/\s+/g, '-')
  return selectedFurnishing.some((item) => furnishing.includes(item.toLowerCase()))
}

const applyClientFilters = (properties, filters) => {
  return properties.filter((property) => {
    if (!matchesAmenities(property, filters.amenities)) return false
    if (!matchesFurnishing(property, filters.furnishing)) return false
    if (filters.verifiedOnly && !property.agent) return false
    return true
  })
}

function PropertiesContent({ initialUrlFilters, setSearchParams }) {
  const [draftFilters, setDraftFilters] = useState(initialUrlFilters)
  const [appliedFilters, setAppliedFilters] = useState(initialUrlFilters)
  const [viewMode, setViewMode] = useState('grid')
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const [quickViewProperty, setQuickViewProperty] = useState(null)
  const [compareProperties, setCompareProperties] = useState([])
  const [highlightedPropertyId, setHighlightedPropertyId] = useState('')
  const [selectedMapPropertyId, setSelectedMapPropertyId] = useState('')

  const apiParams = useMemo(() => getApiParams(appliedFilters), [appliedFilters])
  const { data, isLoading, isError, error, refetch } = useProperties(apiParams)
  const properties = useMemo(
    () => applyClientFilters(data?.data || [], appliedFilters),
    [data?.data, appliedFilters],
  )
  const comparedIds = compareProperties.map((property) => property._id)
  const appliedSearchParams = useMemo(() => filtersToSearchParams(appliedFilters), [appliedFilters])

  const updateUrlAndApply = (nextFilters) => {
    setDraftFilters(nextFilters)
    setAppliedFilters(nextFilters)
    setSearchParams(filtersToSearchParams(nextFilters))
  }

  const applyFilters = () => {
    updateUrlAndApply(draftFilters)
  }

  const clearFilters = () => {
    updateUrlAndApply(initialFilters)
  }

  const removeFilter = (key) => {
    const nextFilters = { ...appliedFilters }

    if (key.startsWith('amenities:')) {
      const amenity = key.split(':')[1]
      nextFilters.amenities = nextFilters.amenities.filter((item) => item !== amenity)
    } else if (key.startsWith('furnishing:')) {
      const furnishing = key.split(':')[1]
      nextFilters.furnishing = nextFilters.furnishing.filter((item) => item !== furnishing)
    } else if (key === 'price') {
      nextFilters.minPrice = ''
      nextFilters.maxPrice = ''
    } else if (key === 'verifiedOnly') {
      nextFilters.verifiedOnly = false
    } else {
      nextFilters[key] = key === 'sort' ? 'latest' : ''
    }

    updateUrlAndApply(nextFilters)
  }

  const changeSort = (sort) => {
    updateUrlAndApply({ ...appliedFilters, sort })
  }

  const toggleCompare = (property) => {
    setCompareProperties((currentProperties) => {
      const alreadySelected = currentProperties.some((item) => item._id === property._id)

      if (alreadySelected) {
        return currentProperties.filter((item) => item._id !== property._id)
      }

      if (currentProperties.length >= 3) {
        return currentProperties
      }

      return [...currentProperties, property]
    })
  }

  const removeCompare = (propertyId) => {
    setCompareProperties((currentProperties) => currentProperties.filter((property) => property._id !== propertyId))
  }

  const renderResults = () => {
    if (isLoading) {
      return (
        <div
          className={
            viewMode === 'list'
              ? 'grid gap-5'
              : 'grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6'
          }
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} variant={viewMode === 'list' ? 'list' : 'grid'} />
          ))}
        </div>
      )
    }

    if (isError) {
      return (
        <div className="rounded-2xl border border-danger/20 bg-danger/5 px-6 py-10 shadow-sm">
          <h2 className="text-2xl font-extrabold text-danger">Unable to load properties</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
            {error?.message || 'Please confirm the backend is running and try again.'}
          </p>
          <Button className="mt-6" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )
    }

    if (properties.length === 0) {
      return (
        <EmptyState
          icon={SlidersHorizontal}
          title="No results match these filters"
          description="Try clearing filters or widening your location, price, amenity, or furnishing choices."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      )
    }

    return (
      <div
        className={
          viewMode === 'list'
            ? 'grid gap-5'
            : 'grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6'
        }
      >
        {properties.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            variant={viewMode === 'list' ? 'list' : 'grid'}
            isCompared={comparedIds.includes(property._id)}
            isCompareDisabled={compareProperties.length >= 3}
            isHighlighted={highlightedPropertyId === property._id || selectedMapPropertyId === property._id}
            onToggleCompare={toggleCompare}
            onQuickView={setQuickViewProperty}
            onHover={setHighlightedPropertyId}
          />
        ))}
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="space-y-5">
        <PageHeader
          eyebrow="NestIQ marketplace"
          title="Property Search Results"
          description="Browse verified listings, compare smarter, and use transparent trust signals before shortlisting."
        />

        <PropertySearchHeader filters={draftFilters} onChange={setDraftFilters} onSearch={applyFilters} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <PopularSearches />
        <SavedSearchButton filters={appliedFilters} queryParams={appliedSearchParams} />
      </div>

      <ResultsToolbar
        count={isLoading ? 0 : properties.length}
        filters={appliedFilters}
        onSortChange={changeSort}
        viewMode={viewMode}
        onViewChange={setViewMode}
        onOpenFilters={() => setIsFilterDrawerOpen(true)}
      />

      <ActiveFilterChips filters={appliedFilters} onRemove={removeFilter} onClear={clearFilters} />

      <RecentlyViewed
        comparedIds={comparedIds}
        onToggleCompare={toggleCompare}
        onQuickView={setQuickViewProperty}
      />

      {viewMode === 'map' ? (
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <FilterSidebar
            filters={draftFilters}
            onChange={setDraftFilters}
            onApply={applyFilters}
            onClear={clearFilters}
            className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
          />
          <Suspense
            fallback={
              <PageLoader
                compact
                className="h-[72vh]"
                title="Loading map view"
                message="Preparing the map tiles and property markers."
              />
            }
          >
            <MapView
              properties={properties}
              className="h-[72vh]"
              highlightedPropertyId={highlightedPropertyId}
              selectedPropertyId={selectedMapPropertyId}
              onPropertyHover={setHighlightedPropertyId}
              onPropertySelect={setSelectedMapPropertyId}
            />
          </Suspense>
          <div className="lg:col-start-2">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-extrabold text-primary">Map result cards</p>
              <p className="text-xs font-semibold text-slate-500">Hover cards or markers to connect results.</p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  isCompared={comparedIds.includes(property._id)}
                  isCompareDisabled={compareProperties.length >= 3}
                  isHighlighted={highlightedPropertyId === property._id || selectedMapPropertyId === property._id}
                  onToggleCompare={toggleCompare}
                  onQuickView={setQuickViewProperty}
                  onHover={setHighlightedPropertyId}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <FilterSidebar
            filters={draftFilters}
            onChange={setDraftFilters}
            onApply={applyFilters}
            onClear={clearFilters}
            className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
          />

          <div className="min-w-0">{renderResults()}</div>
        </div>
      )}

      <MobileFilterDrawer
        isOpen={isFilterDrawerOpen}
        filters={draftFilters}
        onChange={setDraftFilters}
        onApply={applyFilters}
        onClear={clearFilters}
        onClose={() => setIsFilterDrawerOpen(false)}
      />

      <QuickViewModal property={quickViewProperty} onClose={() => setQuickViewProperty(null)} />
      <CompareBar properties={compareProperties} onRemove={removeCompare} onClear={() => setCompareProperties([])} />
    </section>
  )
}

function Properties() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.toString()
  const urlFilters = useMemo(
    () => getFiltersFromSearchParams(new URLSearchParams(searchQuery)),
    [searchQuery],
  )

  return (
    <PropertiesContent
      key={searchQuery}
      initialUrlFilters={urlFilters}
      setSearchParams={setSearchParams}
    />
  )
}

export default Properties
