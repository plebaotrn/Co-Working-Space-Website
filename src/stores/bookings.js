import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBookingStore = defineStore('bookings', () => {
  const bookings = ref([])

  // Add a new booking
  const addBooking = (booking) => {
    const newBooking = {
      id: Date.now(),
      ...booking,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
    bookings.value.push(newBooking)
    saveToLocalStorage()
    return newBooking
  }

  // Get bookings for a specific user
  const getUserBookings = (userId) => {
    return bookings.value.filter(b => b.userId === userId)
  }

  // Get a specific booking by ID
  const getBookingById = (bookingId) => {
    return bookings.value.find(b => b.id === parseInt(bookingId))
  }

  // Update booking status
  const updateBookingStatus = (bookingId, status) => {
    const booking = bookings.value.find(b => b.id === parseInt(bookingId))
    if (booking) {
      booking.status = status
      saveToLocalStorage()
    }
  }

  // Update entire booking
  const updateBooking = (bookingId, updatedData) => {
    const index = bookings.value.findIndex(b => b.id === parseInt(bookingId))
    if (index !== -1) {
      bookings.value[index] = {
        ...bookings.value[index],
        ...updatedData,
        updatedAt: new Date().toISOString()
      }
      saveToLocalStorage()
      return bookings.value[index]
    }
    return null
  }

  // Cancel a booking
  const cancelBooking = (bookingId) => {
    const booking = bookings.value.find(b => b.id === parseInt(bookingId))
    if (booking) {
      booking.status = 'cancelled'
      booking.cancelledAt = new Date().toISOString()
      saveToLocalStorage()
    }
  }

  // Delete a booking
  const deleteBooking = (bookingId) => {
    const index = bookings.value.findIndex(b => b.id === parseInt(bookingId))
    if (index !== -1) {
      bookings.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  // Save to localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem('cobunny_bookings', JSON.stringify(bookings.value))
  }

  // Load from localStorage
  const loadBookings = () => {
    const saved = localStorage.getItem('cobunny_bookings')
    if (saved) {
      try {
        bookings.value = JSON.parse(saved)
      } catch (error) {
        console.error('Error loading bookings from localStorage:', error)
        bookings.value = []
      }
    }
  }

  // Clear all bookings
  const clearBookings = () => {
    bookings.value = []
    localStorage.removeItem('cobunny_bookings')
  }

  // Computed properties
  const totalBookings = computed(() => bookings.value.length)
  const confirmedBookings = computed(() => 
    bookings.value.filter(b => b.status === 'confirmed')
  )
  const cancelledBookings = computed(() => 
    bookings.value.filter(b => b.status === 'cancelled')
  )

  return {
    bookings,
    addBooking,
    getUserBookings,
    getBookingById,
    updateBooking,
    updateBookingStatus,
    cancelBooking,
    deleteBooking,
    loadBookings,
    clearBookings,
    totalBookings,
    confirmedBookings,
    cancelledBookings
  }
})
