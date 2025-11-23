import { ref, computed } from 'vue'
import usersData from '../data/users.json'

// Current logged-in user stored in localStorage
const currentUser = ref(null)

// Initialize users in localStorage if not exists
const initializeUsers = () => {
  const storedUsers = localStorage.getItem('cobunny_users')
  if (!storedUsers) {
    // First time - save default users to localStorage
    localStorage.setItem('cobunny_users', JSON.stringify(usersData))
  }
}

// Load user from localStorage on app startup
const loadUserFromStorage = () => {
  const storedUser = localStorage.getItem('cobunny_user')
  if (storedUser) {
    currentUser.value = JSON.parse(storedUser)
  }
}

// Initialize on module load
initializeUsers()
loadUserFromStorage()

export function useAuth() {
  const isAuthenticated = computed(() => currentUser.value !== null)

  /**
   * Sign in a user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} - { success: boolean, message: string, user: Object }
   */
  const signIn = (email, password) => {
    // Get current users from localStorage or use default data
    const storedUsers = localStorage.getItem('cobunny_users')
    const users = storedUsers ? JSON.parse(storedUsers) : usersData

    // Find user by email and password
    const user = users.find(u => u.email === email && u.password === password)

    if (user) {
      // Remove password before storing
      const userWithoutPassword = { ...user }
      delete userWithoutPassword.password
      
      currentUser.value = userWithoutPassword
      localStorage.setItem('cobunny_user', JSON.stringify(userWithoutPassword))
      
      return {
        success: true,
        message: 'Signed in successfully!',
        user: userWithoutPassword
      }
    } else {
      return {
        success: false,
        message: 'Invalid email or password',
        user: null
      }
    }
  }

  /**
   * Sign up a new user
   * @param {Object} userData - { firstName, lastName, email, password }
   * @returns {Object} - { success: boolean, message: string, user: Object }
   */
  const signUp = (userData) => {
    // Get current users fr om localStorage or use default data
    const storedUsers = localStorage.getItem('cobunny_users')
    const users = storedUsers ? JSON.parse(storedUsers) : [...usersData]

    // Check if user already exists
    const existingUser = users.find(u => u.email === userData.email)
    if (existingUser) {
      return {
        success: false,
        message: 'An account with this email already exists',
        user: null
      }
    }

    // Create new user
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      favorites: [],
      createdAt: new Date().toISOString().split('T')[0]
    }

    users.push(newUser)
    localStorage.setItem('cobunny_users', JSON.stringify(users))

    // Auto-login after signup
    const userWithoutPassword = { ...newUser }
    delete userWithoutPassword.password
    
    currentUser.value = userWithoutPassword
    localStorage.setItem('cobunny_user', JSON.stringify(userWithoutPassword))

    return {
      success: true,
      message: 'Account created successfully!',
      user: userWithoutPassword
    }
  }

  /**
   * Sign out the current user
   */
  const signOut = () => {
    currentUser.value = null
    localStorage.removeItem('cobunny_user')
  }

  /**
   * Update user favorites
   * @param {number} spaceId - Space ID to toggle
   */
  const toggleFavorite = (spaceId) => {
    if (!currentUser.value) return

    const storedUsers = localStorage.getItem('cobunny_users')
    const users = storedUsers ? JSON.parse(storedUsers) : [...usersData]
    
    const userIndex = users.findIndex(u => u.id === currentUser.value.id)
    if (userIndex !== -1) {
      if (!users[userIndex].favorites) {
        users[userIndex].favorites = []
      }

      const favIndex = users[userIndex].favorites.indexOf(spaceId)
      if (favIndex > -1) {
        users[userIndex].favorites.splice(favIndex, 1)
      } else {
        users[userIndex].favorites.push(spaceId)
      }

      localStorage.setItem('cobunny_users', JSON.stringify(users))
      
      // Update current user
      currentUser.value.favorites = users[userIndex].favorites
      localStorage.setItem('cobunny_user', JSON.stringify(currentUser.value))
    }
  }

  /**
   * Check if a space is favorited
   * @param {number} spaceId - Space ID to check
   * @returns {boolean}
   */
  const isFavorite = (spaceId) => {
    if (!currentUser.value || !currentUser.value.favorites) return false
    return currentUser.value.favorites.includes(spaceId)
  }

  return {
    currentUser,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    toggleFavorite,
    isFavorite
  }
}
