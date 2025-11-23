<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useBookingStore } from '../stores/bookings'
import spacesData from '../data/spaces.json'

const router = useRouter()
const { currentUser } = useAuth()
const bookingStore = useBookingStore()

const showCancelModal = ref(false)
const bookingToCancel = ref(null)
const showDeleteModal = ref(false)
const bookingToDelete = ref(null)

// Load bookings from store
onMounted(() => {
  // Bookings are already loaded in main.js
})

// Get user bookings from store
const bookings = computed(() => {
  return bookingStore.getUserBookings(currentUser.value.id)
})

// Get favorite spaces
const favoriteSpaces = computed(() => {
  if (!currentUser.value.favorites || currentUser.value.favorites.length === 0) {
    return []
  }
  return spacesData.filter(space => currentUser.value.favorites.includes(space.id))
})

// Filter bookings
const upcomingBookings = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return bookings.value.filter(b => {
    const bookingDate = new Date(b.date)
    const status = (b.status || '').toLowerCase()
    return bookingDate >= today && status !== 'cancelled'
  }).sort((a, b) => new Date(a.date) - new Date(b.date))
})

const pastBookings = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return bookings.value.filter(b => {
    const bookingDate = new Date(b.date)
    const status = (b.status || '').toLowerCase()
    return bookingDate < today || status === 'cancelled'
  }).sort((a, b) => new Date(b.date) - new Date(a.date))
})

// Statistics
const totalBookings = computed(() => bookings.value.length)
const upcomingCount = computed(() => upcomingBookings.value.length)
const favoritesCount = computed(() => favoriteSpaces.value.length)
const totalSpent = computed(() => {
  return bookings.value
    .filter(b => (b.status || '').toLowerCase() !== 'cancelled')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
    .toFixed(2)
})

// Actions
const viewBooking = (id) => {
  router.push({ name: 'view-booking', params: { id } })
}

const editBooking = (id) => {
  router.push({ name: 'edit-booking', params: { id } })
}

const confirmCancelBooking = (booking) => {
  bookingToCancel.value = booking
  showCancelModal.value = true
}

const cancelBooking = () => {
  if (!bookingToCancel.value) return
  
  bookingStore.cancelBooking(bookingToCancel.value.id)
  
  showCancelModal.value = false
  bookingToCancel.value = null
}

const closeCancelModal = () => {
  showCancelModal.value = false
  bookingToCancel.value = null
}

const undoCancel = (bookingId) => {
  bookingStore.updateBookingStatus(bookingId, 'confirmed')
}

const confirmDeleteBooking = (booking) => {
  bookingToDelete.value = booking
  showDeleteModal.value = true
}

const deleteBooking = () => {
  if (!bookingToDelete.value) return
  
  bookingStore.deleteBooking(bookingToDelete.value.id)
  
  showDeleteModal.value = false
  bookingToDelete.value = null
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  bookingToDelete.value = null
}

const viewSpace = (id) => {
  router.push({ name: 'space-details', params: { id } })
}

const bookSpace = (id) => {
  router.push({ name: 'create-booking', params: { spaceId: id } })
}

const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString(undefined, options)
}

const getStatusClass = (status) => {
  switch (status) {
    case 'confirmed':
    case 'Confirmed':
      return 'bg-success text-white'
    case 'Pending':
      return 'bg-warning text-dark'
    case 'cancelled':
    case 'Cancelled':
      return 'bg-secondary text-white'
    case 'Completed':
      return 'bg-info text-white'
    default:
      return 'bg-primary text-white'
  }
}
</script>

<template>
  <div>
    <!-- Main Dashboard Content -->
    <div class="min-h-screen px-4 py-8 bg-off-white">
    <div class="container">
      <!-- Header -->
      <div class="mb-5 row">
        <div class="col-12">
          <h1 class="mb-2 text-5xl font-bold text-navy font-montserrat">
            Welcome back, {{ currentUser.firstName }}! 👋
          </h1>
          <p class="text-xl text-slate font-inter">Manage your bookings and explore new spaces</p>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="mb-5 row g-4">
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="border-0 shadow-sm card h-100">
            <div class="text-center card-body">
              <div class="mb-2 display-4">📊</div>
              <h3 class="mb-1 h2 text-navy">{{ totalBookings }}</h3>
              <p class="mb-0 text-slate">Total Bookings</p>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="border-0 shadow-sm card h-100">
            <div class="text-center card-body">
              <div class="mb-2 display-4">📅</div>
              <h3 class="mb-1 h2 text-teal">{{ upcomingCount }}</h3>
              <p class="mb-0 text-slate">Upcoming Bookings</p>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="border-0 shadow-sm card h-100">
            <div class="text-center card-body">
              <div class="mb-2 display-4">❤️</div>
              <h3 class="mb-1 h2 text-danger">{{ favoritesCount }}</h3>
              <p class="mb-0 text-slate">Favorite Spaces</p>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="border-0 shadow-sm card h-100">
            <div class="text-center card-body">
              <div class="mb-2 display-4">💰</div>
              <h3 class="mb-1 h2 text-success">${{ totalSpent }}</h3>
              <p class="mb-0 text-slate">Total Spent</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Main Content -->
        <div class="col-12 col-lg-8">
          <!-- Upcoming Bookings -->
          <div class="mb-4 border-0 shadow-sm card">
            <div class="card-body">
              <h2 class="mb-4 h3 text-navy font-poppins">📅 Upcoming Bookings</h2>
              
              <div v-if="upcomingBookings.length === 0" class="py-5 text-center">
                <p class="mb-3 text-slate">No upcoming bookings</p>
                <button 
                  @click="router.push({ name: 'browse' })"
                  class="text-white btn btn-navy"
                >
                  Browse Spaces
                </button>
              </div>

              <div v-else class="space-y-3">
                <div 
                  v-for="booking in upcomingBookings" 
                  :key="booking.id"
                  class="p-3 border rounded-3 hover-lift"
                >
                  <div class="row align-items-center g-3">
                    <div class="col-12 col-md-8">
                      <h5 class="mb-1 text-navy font-poppins">{{ booking.spaceName }}</h5>
                      <p class="mb-1 text-slate small">
                        <strong>Date:</strong> {{ formatDate(booking.date) }}
                      </p>
                      <p class="mb-1 text-slate small">
                        <strong>Time:</strong> {{ booking.timeSlot }}
                      </p>
                      <p class="mb-1 text-slate small">
                        <strong>People:</strong> {{ booking.numberOfPeople }}
                      </p>
                      <p class="mb-2 text-slate small">
                        <strong>Price:</strong> <span class="text-teal fw-bold">${{ booking.totalPrice }}</span>
                      </p>
                      <span class="badge" :class="getStatusClass(booking.status)">
                        {{ booking.status }}
                      </span>
                    </div>
                    <div class="col-12 col-md-4">
                      <div class="gap-2 d-grid">
                        <button 
                          @click="viewBooking(booking.id)"
                          class="btn btn-sm btn-outline-navy"
                        >
                          View
                        </button>
                        <button 
                          @click="editBooking(booking.id)"
                          class="btn btn-sm btn-outline-secondary"
                        >
                          Edit
                        </button>
                        <button 
                          @click="confirmCancelBooking(booking)"
                          class="btn btn-sm btn-outline-danger"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Past Bookings -->
          <div class="border-0 shadow-sm card">
            <div class="card-body">
              <h2 class="mb-4 h3 text-navy font-poppins">🗓️ Past Bookings</h2>
              
              <div v-if="pastBookings.length === 0" class="py-4 text-center">
                <p class="mb-0 text-slate">No past bookings</p>
              </div>

              <div v-else class="space-y-3">
                <div 
                  v-for="booking in pastBookings.slice(0, 5)" 
                  :key="booking.id"
                  class="p-3 border rounded-3"
                >
                  <div class="row align-items-start">
                    <div class="col-8">
                      <h6 class="mb-1 text-navy">{{ booking.spaceName }}</h6>
                      <p class="mb-1 text-slate small">{{ formatDate(booking.date) }} • {{ booking.timeSlot }}</p>
                      <span class="badge" :class="getStatusClass(booking.status)">
                        {{ booking.status }}
                      </span>
                    </div>
                    <div class="col-4 text-end">
                      <p class="mb-2 text-teal fw-bold">${{ booking.totalPrice }}</p>
                      <div class="gap-2 d-grid">
                        <button 
                          v-if="booking.status === 'cancelled' || booking.status === 'Cancelled'"
                          @click="undoCancel(booking.id)"
                          class="btn btn-sm btn-outline-success"
                          title="Restore booking"
                        >
                          ↶ Undo
                        </button>
                        <button 
                          @click="confirmDeleteBooking(booking)"
                          class="btn btn-sm btn-danger"
                          title="Delete permanently"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-12 col-lg-4">
          <!-- Profile Card -->
          <div class="mb-4 border-0 shadow-sm card">
            <div class="card-body">
              <h2 class="mb-4 h4 text-navy font-poppins">👤 Profile</h2>
              <div class="mb-3">
                <p class="mb-1 text-slate small">Name</p>
                <p class="mb-0 text-navy fw-semibold">{{ currentUser.firstName }} {{ currentUser.lastName }}</p>
              </div>
              <div class="mb-3">
                <p class="mb-1 text-slate small">Email</p>
                <p class="mb-0 text-navy fw-semibold">{{ currentUser.email }}</p>
              </div>
              <div class="mb-4">
                <p class="mb-1 text-slate small">Member Since</p>
                <p class="mb-0 text-navy fw-semibold">{{ formatDate(currentUser.createdAt) }}</p>
              </div>
              <button class="btn btn-outline-navy w-100">
                Edit Profile
              </button>
            </div>
          </div>

          <!-- Favorite Spaces -->
          <div class="border-0 shadow-sm card">
            <div class="card-body">
              <h2 class="mb-4 h4 text-navy font-poppins">❤️ Favorite Spaces</h2>
              
              <div v-if="favoriteSpaces.length === 0" class="py-4 text-center">
                <p class="mb-3 text-slate small">No favorite spaces yet</p>
                <button 
                  @click="router.push({ name: 'browse' })"
                  class="btn btn-sm btn-outline-navy"
                >
                  Browse Spaces
                </button>
              </div>

              <div v-else class="space-y-3">
                <div 
                  v-for="space in favoriteSpaces.slice(0, 3)" 
                  :key="space.id"
                  class="p-2 border cursor-pointer rounded-3 hover-lift"
                  @click="viewSpace(space.id)"
                >
                  <div class="row g-2 align-items-center">
                    <div class="col-4">
                      <img 
                        :src="space.imageUrl" 
                        :alt="space.name"
                        class="rounded img-fluid"
                        style="height: 60px; width: 100%; object-fit: cover;"
                      />
                    </div>
                    <div class="col-8">
                      <h6 class="mb-1 small text-navy">{{ space.name }}</h6>
                      <p class="mb-1 text-slate" style="font-size: 0.75rem;">
                        📍 {{ space.location }}
                      </p>
                      <button 
                        @click.stop="bookSpace(space.id)"
                        class="text-white btn btn-sm btn-teal w-100"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Booking Modal -->
    <div 
    v-if="showCancelModal" 
    class="modal d-block" 
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5);"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-navy">Cancel Booking</h5>
          <button type="button" class="btn-close" @click="closeCancelModal"></button>
        </div>
        <div class="modal-body">
          <p class="text-slate">
            Are you sure you want to cancel your booking for 
            <strong>{{ bookingToCancel?.spaceName }}</strong> on 
            <strong>{{ formatDate(bookingToCancel?.date) }}</strong>?
          </p>
          <p class="mb-0 text-danger small">
            This action cannot be undone.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeCancelModal">
              Keep Booking
            </button>
            <button type="button" class="btn btn-danger" @click="cancelBooking">
              Yes, Cancel Booking
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Booking Modal -->
    <div 
      v-if="showDeleteModal" 
      class="modal d-block" 
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5);"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="border-0 modal-header">
            <h5 class="modal-title text-navy">Delete Booking</h5>
            <button type="button" class="btn-close" @click="closeDeleteModal"></button>
          </div>
          <div class="modal-body">
            <p class="mb-2 text-slate">
              Are you sure you want to permanently delete this booking?
            </p>
            <div v-if="bookingToDelete" class="p-3 mb-3 rounded bg-light">
              <p class="mb-1"><strong>{{ bookingToDelete.spaceName }}</strong></p>
              <p class="mb-0 small text-slate">{{ formatDate(bookingToDelete.date) }} • {{ bookingToDelete.timeSlot }}</p>
            </div>
            <p class="mb-0 text-danger small">
              ⚠️ This action cannot be undone. The booking will be permanently removed.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDeleteModal">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="deleteBooking">
              Yes, Delete Permanently
            </button>
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

.hover-lift {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.space-y-3 > * + * {
  margin-top: 1rem;
}

.cursor-pointer {
  cursor: pointer;
}
</style>