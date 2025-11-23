/**
 * API Service for external integrations
 * Using JSONPlaceholder as a mock API for demonstration
 */

const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

/**
 * Fetch users from JSONPlaceholder API
 * @returns {Promise<Array>}
 */
export async function fetchExternalUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/users`)
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching external users:', error)
    throw error
  }
}

/**
 * Fetch posts from JSONPlaceholder API
 * Can be used to supplement news content
 * @returns {Promise<Array>}
 */
export async function fetchExternalPosts() {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`)
    if (!response.ok) {
      throw new Error('Failed to fetch posts')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching external posts:', error)
    throw error
  }
}

/**
 * Fetch a specific post
 * @param {number} id - Post ID
 * @returns {Promise<Object>}
 */
export async function fetchExternalPost(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch post')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching external post:', error)
    throw error
  }
}

/**
 * Generic fetch function with error handling
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<any>}
 */
export async function fetchApi(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export default {
  fetchExternalUsers,
  fetchExternalPosts,
  fetchExternalPost,
  fetchApi
}
