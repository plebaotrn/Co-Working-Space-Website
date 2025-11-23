<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import SpaceReviews from '../components/space/SpaceReviews.vue'
import spacesData from '../data/spaces.json'

const router = useRouter()
const route = useRoute()
const { isAuthenticated, toggleFavorite, isFavorite } = useAuth()

const spaceId = computed(() => parseInt(route.params.id))
const space = ref(null)
const isLoading = ref(true)

onMounted(() => {
  space.value = spacesData.find(s => s.id === spaceId.value)
  if (!space.value) {
    alert('Space not found')
    router.push({ name: 'browse' })
  }
  isLoading.value = false
})

const bookSpace = () => {
  if (!isAuthenticated.value) {
    alert('Please sign in to book a space')
    router.push({ name: 'sign-in' })
  } else {
    router.push({ name: 'create-booking', params: { spaceId: spaceId.value } })
  }
}

const goBack = () => {
  router.push({ name: 'browse' })
}

const handleFavorite = () => {
  if (!isAuthenticated.value) {
    alert('Please sign in to add favorites')
    router.push({ name: 'sign-in' })
  } else {
    toggleFavorite(spaceId.value)
  }
}
</script>

<template>
  <div class="min-h-screen bg-off-white py-8 px-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <button 
            @click="goBack"
            class="btn btn-link text-navy p-0 mb-4"
          >
            ← Back to Browse
          </button>
          
          <div v-if="!isLoading && space" class="card border-0 shadow-sm overflow-hidden">
            <!-- Space Image -->
            <img 
              :src="space.imageUrl" 
              :alt="space.name"
              class="card-img-top"
              style="height: 400px; object-fit: cover;"
            />
            
            <div class="card-body p-4 p-md-5">
              <!-- Header -->
              <div class="row mb-4">
                <div class="col-12 col-md-8">
                  <h1 class="display-5 font-bold text-navy mb-2 font-montserrat">
                    {{ space.name }}
                  </h1>
                  <p class="text-xl text-slate mb-2 font-inter">
                    📍 {{ space.location }} • {{ space.address }}
                  </p>
                  <div class="d-flex align-items-center gap-3">
                    <div class="text-warning fs-5">
                      ⭐ {{ space.rating }}
                    </div>
                    <span class="badge bg-success" v-if="space.availability">Available</span>
                    <span class="badge bg-secondary" v-else>Not Available</span>
                  </div>
                </div>
                <div class="col-12 col-md-4 text-md-end mt-3 mt-md-0">
                  <div class="mb-2">
                    <span class="display-4 text-teal fw-bold">${{ space.price }}</span>
                    <span class="text-slate fs-5">/day</span>
                  </div>
                  <button
                    @click="handleFavorite"
                    class="btn"
                    :class="isFavorite(space.id) ? 'btn-danger' : 'btn-outline-danger'"
                    v-tooltip="isFavorite(space.id) ? 'Remove from favorites' : 'Add to favorites'"
                  >
                    <span v-if="isFavorite(space.id)">❤️ Favorited</span>
                    <span v-else>🤍 Add to Favorites</span>
                  </button>
                </div>
              </div>
              
              <!-- Description -->
              <div class="mb-4">
                <h2 class="h4 text-navy mb-3 font-poppins">About This Space</h2>
                <p class="text-slate font-inter" style="line-height: 1.8; font-size: 1.1rem;">
                  {{ space.description }}
                </p>
              </div>
              
              <!-- Details Grid -->
              <div class="row g-3 mb-4">
                <div class="col-12 col-sm-6 col-md-4">
                  <div class="card bg-light border-0 h-100">
                    <div class="card-body text-center">
                      <div class="fs-2 mb-2">👥</div>
                      <div class="text-slate small">Capacity</div>
                      <div class="h5 text-navy mb-0">{{ space.capacity }} people</div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-sm-6 col-md-4">
                  <div class="card bg-light border-0 h-100">
                    <div class="card-body text-center">
                      <div class="fs-2 mb-2">💰</div>
                      <div class="text-slate small">Price per Day</div>
                      <div class="h5 text-navy mb-0">${{ space.price }}</div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-sm-6 col-md-4">
                  <div class="card bg-light border-0 h-100">
                    <div class="card-body text-center">
                      <div class="fs-2 mb-2">⭐</div>
                      <div class="text-slate small">Rating</div>
                      <div class="h5 text-navy mb-0">{{ space.rating }}/5</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Amenities -->
              <div class="mb-5">
                <h2 class="h4 text-navy mb-3 font-poppins">Amenities</h2>
                <div class="row g-2">
                  <div 
                    v-for="amenity in space.amenities" 
                    :key="amenity"
                    class="col-12 col-sm-6 col-md-4"
                  >
                    <div class="d-flex align-items-center p-2 bg-light rounded">
                      <span class="text-success me-2">✓</span>
                      <span class="text-navy">{{ amenity }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Reviews Section -->
              <div class="mb-4">
                <SpaceReviews :space-id="space.id" :space-name="space.name" />
              </div>
              
              <!-- Book Button -->
              <div class="d-grid">
                <button 
                  @click="bookSpace"
                  class="btn btn-navy btn-lg py-3"
                  v-tooltip="'Book this space now'"
                  :disabled="!space.availability"
                >
                  <span v-if="space.availability">Book This Space 🚀</span>
                  <span v-else>Currently Unavailable</span>
                </button>
              </div>
            </div>
          </div>

          <div v-else-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-navy" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-navy {
  background-color: #1C2541;
  color: white;
  border: none;
}

.btn-navy:hover:not(:disabled) {
  background-color: #64748b;
  color: white;
}

.btn-navy:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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