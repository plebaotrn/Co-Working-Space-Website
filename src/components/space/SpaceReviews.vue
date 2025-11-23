<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../../composables/useAuth'

const props = defineProps({
  spaceId: {
    type: Number,
    required: true
  },
  spaceName: {
    type: String,
    required: true
  }
})

const { isAuthenticated, currentUser } = useAuth()

const reviews = ref([])
const showReviewForm = ref(false)

// New review form
const newReview = ref({
  rating: 5,
  comment: ''
})

const errors = ref({})

onMounted(() => {
  loadReviews()
})

const loadReviews = () => {
  const allReviews = JSON.parse(localStorage.getItem('cobunny_reviews') || '[]')
  reviews.value = allReviews
    .filter(r => r.spaceId === props.spaceId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

// Check if user has booked this space (required to leave a review)
const userHasBooked = computed(() => {
  if (!isAuthenticated.value) return false
  
  const bookings = JSON.parse(localStorage.getItem('cobunny_bookings') || '[]')
  return bookings.some(b => 
    b.userId === currentUser.value.id && 
    b.spaceId === props.spaceId && 
    b.status !== 'Cancelled'
  )
})

// Check if user has already reviewed
const userHasReviewed = computed(() => {
  if (!isAuthenticated.value) return false
  return reviews.value.some(r => r.userId === currentUser.value.id)
})

// Average rating
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0)
  return (sum / reviews.value.length).toFixed(1)
})

// Validate review form
const validateReview = () => {
  errors.value = {}
  
  if (!newReview.value.rating || newReview.value.rating < 1 || newReview.value.rating > 5) {
    errors.value.rating = 'Please select a rating between 1 and 5'
  }
  
  if (!newReview.value.comment.trim()) {
    errors.value.comment = 'Please write a review'
  } else if (newReview.value.comment.trim().length < 10) {
    errors.value.comment = 'Review must be at least 10 characters long'
  }
  
  return Object.keys(errors.value).length === 0
}

// Submit review
const submitReview = () => {
  if (!validateReview()) return
  
  const allReviews = JSON.parse(localStorage.getItem('cobunny_reviews') || '[]')
  
  const review = {
    id: allReviews.length > 0 ? Math.max(...allReviews.map(r => r.id)) + 1 : 1,
    spaceId: props.spaceId,
    userId: currentUser.value.id,
    userName: `${currentUser.value.firstName} ${currentUser.value.lastName}`,
    rating: newReview.value.rating,
    comment: newReview.value.comment.trim(),
    date: new Date().toISOString()
  }
  
  allReviews.push(review)
  localStorage.setItem('cobunny_reviews', JSON.stringify(allReviews))
  
  loadReviews()
  showReviewForm.value = false
  newReview.value = { rating: 5, comment: '' }
  errors.value = {}
}

const cancelReview = () => {
  showReviewForm.value = false
  newReview.value = { rating: 5, comment: '' }
  errors.value = {}
}

const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString(undefined, options)
}

const getStarIcon = (rating) => {
  return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
}
</script>

<template>
  <div class="reviews-section">
    <!-- Reviews Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="h4 text-navy mb-2 font-poppins">
          Reviews & Ratings
        </h3>
        <div v-if="reviews.length > 0">
          <div class="d-flex align-items-center">
            <span class="display-6 text-warning me-2">{{ averageRating }}</span>
            <div>
              <div class="text-warning fs-5">
                {{ getStarIcon(Math.round(parseFloat(averageRating))) }}
              </div>
              <small class="text-slate">{{ reviews.length }} review{{ reviews.length !== 1 ? 's' : '' }}</small>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Write Review Button -->
      <div v-if="isAuthenticated && userHasBooked && !userHasReviewed">
        <button 
          @click="showReviewForm = !showReviewForm"
          class="btn btn-navy"
          v-tooltip="'Share your experience'"
        >
          Write a Review
        </button>
      </div>
      <div v-else-if="!isAuthenticated" class="text-end">
        <small class="text-slate">Sign in to write a review</small>
      </div>
      <div v-else-if="!userHasBooked" class="text-end">
        <small class="text-slate">Book this space to write a review</small>
      </div>
      <div v-else-if="userHasReviewed" class="text-end">
        <small class="text-success">✓ You've reviewed this space</small>
      </div>
    </div>

    <!-- Review Form -->
    <Transition name="slide-down">
      <div v-if="showReviewForm" class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <h5 class="card-title text-navy mb-3">Write Your Review</h5>
          
          <form @submit.prevent="submitReview">
            <!-- Rating -->
            <div class="mb-3">
              <label class="form-label text-navy fw-semibold">
                Rating <span class="text-danger">*</span>
              </label>
              <div class="rating-selector">
                <div class="btn-group" role="group">
                  <input 
                    v-for="star in 5" 
                    :key="star"
                    type="radio"
                    :id="`rating-${star}`"
                    v-model="newReview.rating"
                    :value="star"
                    class="btn-check"
                  />
                  <label 
                    v-for="star in 5" 
                    :key="`label-${star}`"
                    :for="`rating-${star}`"
                    class="btn btn-outline-warning"
                  >
                    {{ star }} <span v-if="star === 1">⭐</span><span v-else>⭐</span>
                  </label>
                </div>
              </div>
              <div v-if="errors.rating" class="text-danger small mt-1">
                {{ errors.rating }}
              </div>
            </div>

            <!-- Comment -->
            <div class="mb-3">
              <label for="reviewComment" class="form-label text-navy fw-semibold">
                Your Review <span class="text-danger">*</span>
              </label>
              <textarea 
                id="reviewComment"
                v-model="newReview.comment"
                class="form-control"
                :class="{ 'is-invalid': errors.comment }"
                rows="4"
                placeholder="Share your experience with this space..."
              ></textarea>
              <div v-if="errors.comment" class="invalid-feedback">
                {{ errors.comment }}
              </div>
              <small class="form-text text-slate">
                Minimum 10 characters
              </small>
            </div>

            <!-- Actions -->
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-navy">
                Submit Review
              </button>
              <button type="button" @click="cancelReview" class="btn btn-outline-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Reviews List -->
    <div v-if="reviews.length === 0" class="text-center py-5">
      <p class="text-slate mb-0">No reviews yet. Be the first to review {{ spaceName }}!</p>
    </div>

    <div v-else class="reviews-list">
      <div 
        v-for="review in reviews" 
        :key="review.id"
        class="card border-0 shadow-sm mb-3"
      >
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h6 class="text-navy mb-1">{{ review.userName }}</h6>
              <div class="text-warning">
                {{ getStarIcon(review.rating) }}
              </div>
            </div>
            <small class="text-slate">{{ formatDate(review.date) }}</small>
          </div>
          <p class="text-slate mb-0">{{ review.comment }}</p>
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

.btn-navy:hover {
  background-color: #64748b;
  color: white;
}

.text-navy {
  color: #1C2541;
}

.text-slate {
  color: #64748b;
}

.rating-selector .btn-group {
  width: 100%;
}

.rating-selector .btn {
  flex: 1;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
