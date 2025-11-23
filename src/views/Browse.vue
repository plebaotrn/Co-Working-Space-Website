<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import spacesData from '../data/spaces.json'
import newsData from '../data/news.json'

const router = useRouter()
const { isAuthenticated, toggleFavorite, isFavorite } = useAuth()

// Active tab state
const activeTab = ref('spaces') // 'spaces' or 'news'

// Spaces state
const searchSpaces = ref('')
const filterLocation = ref('All')
const filterPriceRange = ref('All')
const filterCapacity = ref('All')
const sortSpacesBy = ref('default')
const currentSpacesPage = ref(1)
const itemsPerPage = 6

// News state
const searchNews = ref('')
const filterCategory = ref('All')
const sortNewsBy = ref('newest')
const currentNewsPage = ref(1)

// Get unique locations from spaces
const locations = computed(() => {
  const locs = [...new Set(spacesData.map(s => s.location))]
  return ['All', ...locs]
})

// Get unique categories from news
const categories = computed(() => {
  const cats = [...new Set(newsData.map(n => n.category))]
  return ['All', ...cats]
})

// Filtered and sorted spaces
const filteredSpaces = computed(() => {
  let result = [...spacesData]

  // Search filter
  if (searchSpaces.value) {
    const search = searchSpaces.value.toLowerCase()
    result = result.filter(space => 
      space.name.toLowerCase().includes(search) ||
      space.location.toLowerCase().includes(search) ||
      space.amenities.some(a => a.toLowerCase().includes(search)) ||
      space.description.toLowerCase().includes(search)
    )
  }

  // Location filter
  if (filterLocation.value !== 'All') {
    result = result.filter(space => space.location === filterLocation.value)
  }

  // Price range filter
  if (filterPriceRange.value !== 'All') {
    switch (filterPriceRange.value) {
      case 'Under $25':
        result = result.filter(space => space.price < 25)
        break
      case '$25-$35':
        result = result.filter(space => space.price >= 25 && space.price <= 35)
        break
      case '$35-$50':
        result = result.filter(space => space.price > 35 && space.price <= 50)
        break
      case '$50+':
        result = result.filter(space => space.price > 50)
        break
    }
  }

  // Capacity filter
  if (filterCapacity.value !== 'All') {
    switch (filterCapacity.value) {
      case 'Small (<30)':
        result = result.filter(space => space.capacity < 30)
        break
      case 'Medium (30-60)':
        result = result.filter(space => space.capacity >= 30 && space.capacity <= 60)
        break
      case 'Large (60+)':
        result = result.filter(space => space.capacity > 60)
        break
    }
  }

  // Sorting
  switch (sortSpacesBy.value) {
    case 'price-low':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      result.sort((a, b) => b.price - a.price)
      break
    case 'capacity':
      result.sort((a, b) => b.capacity - a.capacity)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
  }

  return result
})

// Filtered and sorted news
const filteredNews = computed(() => {
  let result = [...newsData]

  // Search filter
  if (searchNews.value) {
    const search = searchNews.value.toLowerCase()
    result = result.filter(article => 
      article.title.toLowerCase().includes(search) ||
      article.content.toLowerCase().includes(search) ||
      article.category.toLowerCase().includes(search)
    )
  }

  // Category filter
  if (filterCategory.value !== 'All') {
    result = result.filter(article => article.category === filterCategory.value)
  }

  // Sorting
  switch (sortNewsBy.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.date) - new Date(a.date))
      break
    case 'oldest':
      result.sort((a, b) => new Date(a.date) - new Date(b.date))
      break
  }

  return result
})

// Paginated spaces
const paginatedSpaces = computed(() => {
  const start = (currentSpacesPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredSpaces.value.slice(start, end)
})

// Paginated news
const paginatedNews = computed(() => {
  const start = (currentNewsPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredNews.value.slice(start, end)
})

// Total pages
const totalSpacesPages = computed(() => Math.ceil(filteredSpaces.value.length / itemsPerPage))
const totalNewsPages = computed(() => Math.ceil(filteredNews.value.length / itemsPerPage))

// Navigation functions
const viewSpaceDetails = (id) => {
  router.push({ name: 'space-details', params: { id } })
}

const bookSpace = (id) => {
  if (!isAuthenticated.value) {
    router.push({ name: 'sign-in' })
  } else {
    router.push({ name: 'create-booking', params: { spaceId: id } })
  }
}

const handleFavorite = (spaceId) => {
  if (!isAuthenticated.value) {
    alert('Please sign in to add favorites')
    router.push({ name: 'sign-in' })
  } else {
    toggleFavorite(spaceId)
  }
}

// Reset filters
const resetSpacesFilters = () => {
  searchSpaces.value = ''
  filterLocation.value = 'All'
  filterPriceRange.value = 'All'
  filterCapacity.value = 'All'
  sortSpacesBy.value = 'default'
  currentSpacesPage.value = 1
}

const resetNewsFilters = () => {
  searchNews.value = ''
  filterCategory.value = 'All'
  sortNewsBy.value = 'newest'
  currentNewsPage.value = 1
}

// Format date
const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString(undefined, options)
}
</script>

<template>
  <div class="min-h-screen bg-off-white py-8 px-4">
    <div class="container">
      <!-- Page Header -->
      <div class="row mb-5">
        <div class="col-12 text-center">
          <h1 class="text-5xl font-bold text-navy mb-3 font-montserrat">Browse CoBunny</h1>
          <p class="text-xl text-slate font-inter">Discover co-working spaces and stay updated with industry news</p>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="row mb-4">
        <div class="col-12">
          <ul class="nav nav-tabs justify-content-center" role="tablist">
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link"
                :class="{ active: activeTab === 'spaces' }"
                @click="activeTab = 'spaces'"
                type="button"
              >
                <span class="fs-5 font-poppins">🏢 Co-working Spaces</span>
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link"
                :class="{ active: activeTab === 'news' }"
                @click="activeTab = 'news'"
                type="button"
              >
                <span class="fs-5 font-poppins">📰 Industry News</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Spaces Tab Content -->
      <div v-show="activeTab === 'spaces'" class="tab-content">
        <!-- Search and Filters -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-body">
                <div class="row g-3">
                  <!-- Search -->
                  <div class="col-12 col-md-6 col-lg-3">
                    <label class="form-label fw-semibold text-navy">Search</label>
                    <input 
                      v-model="searchSpaces"
                      type="text"
                      class="form-control"
                      placeholder="Name, location, amenities..."
                    />
                  </div>
                  
                  <!-- Location Filter -->
                  <div class="col-12 col-md-6 col-lg-3">
                    <label class="form-label fw-semibold text-navy">Location</label>
                    <select v-model="filterLocation" class="form-select">
                      <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
                    </select>
                  </div>
                  
                  <!-- Price Range Filter -->
                  <div class="col-12 col-md-6 col-lg-3">
                    <label class="form-label fw-semibold text-navy">Price Range</label>
                    <select v-model="filterPriceRange" class="form-select">
                      <option value="All">All Prices</option>
                      <option value="Under $25">Under $25</option>
                      <option value="$25-$35">$25 - $35</option>
                      <option value="$35-$50">$35 - $50</option>
                      <option value="$50+">$50+</option>
                    </select>
                  </div>
                  
                  <!-- Capacity Filter -->
                  <div class="col-12 col-md-6 col-lg-3">
                    <label class="form-label fw-semibold text-navy">Capacity</label>
                    <select v-model="filterCapacity" class="form-select">
                      <option value="All">All Sizes</option>
                      <option value="Small (<30)">Small (&lt;30)</option>
                      <option value="Medium (30-60)">Medium (30-60)</option>
                      <option value="Large (60+)">Large (60+)</option>
                    </select>
                  </div>
                  
                  <!-- Sort By -->
                  <div class="col-12 col-md-6 col-lg-3">
                    <label class="form-label fw-semibold text-navy">Sort By</label>
                    <select v-model="sortSpacesBy" class="form-select">
                      <option value="default">Default</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="capacity">Capacity</option>
                      <option value="rating">Rating</option>
                    </select>
                  </div>
                  
                  <!-- Reset Button -->
                  <div class="col-12 col-md-6 col-lg-3 d-flex align-items-end">
                    <button 
                      @click="resetSpacesFilters"
                      class="btn btn-outline-secondary w-100"
                      v-tooltip="'Clear all filters'"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
                
                <!-- Results Count -->
                <div class="mt-3">
                  <p class="mb-0 text-slate">
                    Showing <strong>{{ filteredSpaces.length }}</strong> space{{ filteredSpaces.length !== 1 ? 's' : '' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Spaces Grid -->
        <div class="row g-4 mb-4">
          <div 
            v-for="space in paginatedSpaces" 
            :key="space.id"
            class="col-12 col-md-6 col-lg-4"
          >
            <div class="card h-100 border-0 shadow-sm hover-lift">
              <div class="position-relative">
                <img 
                  :src="space.imageUrl" 
                  :alt="space.name"
                  class="card-img-top"
                  style="height: 200px; object-fit: cover;"
                />
                <button
                  @click="handleFavorite(space.id)"
                  class="btn btn-sm position-absolute top-0 end-0 m-2"
                  :class="isFavorite(space.id) ? 'btn-danger' : 'btn-light'"
                  v-tooltip="isFavorite(space.id) ? 'Remove from favorites' : 'Add to favorites'"
                  aria-label="Toggle favorite"
                >
                  <span v-if="isFavorite(space.id)">❤️</span>
                  <span v-else>🤍</span>
                </button>
              </div>
              <div class="card-body d-flex flex-column">
                <h5 class="card-title text-navy font-poppins">{{ space.name }}</h5>
                <p class="text-slate mb-2">
                  <small>📍 {{ space.location }}</small>
                </p>
                <p class="card-text text-slate flex-grow-1" style="font-size: 0.9rem;">
                  {{ space.description.substring(0, 100) }}...
                </p>
                
                <!-- Amenities -->
                <div class="mb-2">
                  <span 
                    v-for="amenity in space.amenities.slice(0, 3)" 
                    :key="amenity"
                    class="badge bg-light text-navy me-1 mb-1"
                    style="font-size: 0.75rem;"
                  >
                    {{ amenity }}
                  </span>
                </div>
                
                <!-- Price and Rating -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <span class="h5 text-teal mb-0">${{ space.price }}</span>
                    <span class="text-slate">/day</span>
                  </div>
                  <div>
                    <span class="text-warning">⭐</span>
                    <span class="fw-semibold">{{ space.rating }}</span>
                  </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="d-grid gap-2">
                  <button 
                    @click="viewSpaceDetails(space.id)"
                    class="btn btn-outline-navy"
                    v-tooltip="'View space details'"
                  >
                    View Details
                  </button>
                  <button 
                    @click="bookSpace(space.id)"
                    class="btn btn-teal text-white"
                    v-tooltip="'Book this space'"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredSpaces.length === 0" class="row">
          <div class="col-12 text-center py-5">
            <p class="text-slate fs-5">No spaces found matching your criteria</p>
            <button @click="resetSpacesFilters" class="btn btn-navy mt-2">
              Reset Filters
            </button>
          </div>
        </div>

        <!-- Pagination for Spaces -->
        <div v-if="totalSpacesPages > 1" class="row">
          <div class="col-12">
            <nav aria-label="Spaces pagination">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentSpacesPage === 1 }">
                  <button 
                    class="page-link" 
                    @click="currentSpacesPage--"
                    :disabled="currentSpacesPage === 1"
                  >
                    Previous
                  </button>
                </li>
                <li 
                  v-for="page in totalSpacesPages" 
                  :key="page"
                  class="page-item"
                  :class="{ active: currentSpacesPage === page }"
                >
                  <button class="page-link" @click="currentSpacesPage = page">
                    {{ page }}
                  </button>
                </li>
                <li class="page-item" :class="{ disabled: currentSpacesPage === totalSpacesPages }">
                  <button 
                    class="page-link" 
                    @click="currentSpacesPage++"
                    :disabled="currentSpacesPage === totalSpacesPages"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <!-- News Tab Content -->
      <div v-show="activeTab === 'news'" class="tab-content">
        <!-- Search and Filters -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-body">
                <div class="row g-3">
                  <!-- Search -->
                  <div class="col-12 col-md-6">
                    <label class="form-label fw-semibold text-navy">Search</label>
                    <input 
                      v-model="searchNews"
                      type="text"
                      class="form-control"
                      placeholder="Search by title or content..."
                    />
                  </div>
                  
                  <!-- Category Filter -->
                  <div class="col-12 col-md-3">
                    <label class="form-label fw-semibold text-navy">Category</label>
                    <select v-model="filterCategory" class="form-select">
                      <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                  </div>
                  
                  <!-- Sort By -->
                  <div class="col-12 col-md-3">
                    <label class="form-label fw-semibold text-navy">Sort By</label>
                    <select v-model="sortNewsBy" class="form-select">
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                  
                  <!-- Reset Button -->
                  <div class="col-12">
                    <button 
                      @click="resetNewsFilters"
                      class="btn btn-outline-secondary"
                      v-tooltip="'Clear all filters'"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
                
                <!-- Results Count -->
                <div class="mt-3">
                  <p class="mb-0 text-slate">
                    Showing <strong>{{ filteredNews.length }}</strong> article{{ filteredNews.length !== 1 ? 's' : '' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- News Grid -->
        <div class="row g-4 mb-4">
          <div 
            v-for="article in paginatedNews" 
            :key="article.id"
            class="col-12 col-md-6 col-lg-4"
          >
            <article class="card h-100 border-0 shadow-sm hover-lift">
              <img 
                :src="article.imageUrl" 
                :alt="article.title"
                class="card-img-top"
                style="height: 200px; object-fit: cover;"
              />
              <div class="card-body d-flex flex-column">
                <div class="mb-2">
                  <span class="badge bg-teal text-white">{{ article.category }}</span>
                  <small class="text-slate ms-2">{{ formatDate(article.date) }}</small>
                </div>
                <h5 class="card-title text-navy font-poppins">{{ article.title }}</h5>
                <p class="card-text text-slate flex-grow-1" style="font-size: 0.9rem;">
                  {{ article.content }}
                </p>
                <div class="mt-auto">
                  <small class="text-slate">By {{ article.author }}</small>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredNews.length === 0" class="row">
          <div class="col-12 text-center py-5">
            <p class="text-slate fs-5">No news articles found matching your criteria</p>
            <button @click="resetNewsFilters" class="btn btn-navy mt-2">
              Reset Filters
            </button>
          </div>
        </div>

        <!-- Pagination for News -->
        <div v-if="totalNewsPages > 1" class="row">
          <div class="col-12">
            <nav aria-label="News pagination">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentNewsPage === 1 }">
                  <button 
                    class="page-link" 
                    @click="currentNewsPage--"
                    :disabled="currentNewsPage === 1"
                  >
                    Previous
                  </button>
                </li>
                <li 
                  v-for="page in totalNewsPages" 
                  :key="page"
                  class="page-item"
                  :class="{ active: currentNewsPage === page }"
                >
                  <button class="page-link" @click="currentNewsPage = page">
                    {{ page }}
                  </button>
                </li>
                <li class="page-item" :class="{ disabled: currentNewsPage === totalNewsPages }">
                  <button 
                    class="page-link" 
                    @click="currentNewsPage++"
                    :disabled="currentNewsPage === totalNewsPages"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hover-lift {
  transition: transform 0.2s, box-shadow 0.2s;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}

.nav-tabs .nav-link {
  color: #64748b;
  border: none;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.nav-tabs .nav-link:hover {
  color: #1C2541;
  border-bottom-color: #5BC0BE;
}

.nav-tabs .nav-link.active {
  color: #1C2541;
  background-color: transparent;
  border-bottom-color: #5BC0BE;
  font-weight: 600;
}

.btn-navy {
  background-color: #1C2541;
  color: white;
  border: none;
}

.btn-navy:hover {
  background-color: #64748b;
  color: white;
}

.btn-outline-navy {
  border: 2px solid #1C2541;
  color: #1C2541;
}

.btn-outline-navy:hover {
  background-color: #1C2541;
  color: white;
}

.btn-teal {
  background-color: #5BC0BE;
  border: none;
}

.btn-teal:hover {
  background-color: #4aa9a7;
}

.text-navy {
  color: #1C2541;
}

.text-slate {
  color: #64748b;
}

.text-teal {
  color: #5BC0BE;
}

.bg-off-white {
  background-color: #FAFAFA;
}
</style>
