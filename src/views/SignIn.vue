<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { signIn } = useAuth()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

const handleSignIn = async () => {
  errorMessage.value = ''
  
  // Validate inputs
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password'
    return
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Please enter a valid email address'
    return
  }
  
  isLoading.value = true
  
  // Simulate async operation
  setTimeout(() => {
    const result = signIn(email.value, password.value)
    
    if (result.success) {
      router.push({ name: 'dashboard' })
    } else {
      errorMessage.value = result.message
    }
    
    isLoading.value = false
  }, 500)
}

const goToSignUp = () => {
  router.push({ name: 'sign-up' })
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen px-6 py-12 bg-off-white">
    <div class="w-full max-w-md">
      <div class="p-8 bg-white shadow-xl rounded-2xl">
        <h1 class="mb-2 text-4xl font-bold text-center text-navy font-montserrat">Welcome Back! 👋</h1>
        <p class="mb-8 text-center text-slate font-inter">Sign in to your CoBunny account</p>
        
        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>
        
        <form @submit.prevent="handleSignIn" class="space-y-5">
          <div>
            <label for="email" class="block mb-2 font-semibold text-navy font-inter">Email Address</label>
            <input 
              id="email"
              v-model="email"
              type="email" 
              required
              placeholder="you@example.com"
              class="form-control"
              :disabled="isLoading"
            >
          </div>
          
          <div>
            <label for="password" class="block mb-2 font-semibold text-navy font-inter">Password</label>
            <input 
              id="password"
              v-model="password"
              type="password" 
              required
              placeholder="••••••••"
              class="form-control"
              :disabled="isLoading"
            >
          </div>
          
          <div class="d-flex justify-content-between align-items-center">
            <div class="form-check">
              <input 
                id="rememberMe"
                v-model="rememberMe"
                type="checkbox" 
                class="form-check-input"
                :disabled="isLoading"
              >
              <label for="rememberMe" class="form-check-label text-slate">
                Remember me
              </label>
            </div>
            <a href="#" class="transition text-teal hover:text-navy">Forgot password?</a>
          </div>
          
          <button 
            type="submit"
            class="w-full text-white btn btn-navy"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </form>
        
        <p class="mt-6 text-center text-slate font-inter">
          Don't have an account? 
          <button @click="goToSignUp" class="font-semibold transition text-teal hover:text-navy">
            Sign Up
          </button>
        </p>
        
        <!-- Demo credentials info -->
        <div class="p-3 mt-6 rounded bg-light">
          <p class="mb-1 small text-slate font-inter">
            <strong>Demo Account:</strong>
          </p>
          <p class="mb-0 small text-slate">
            Email: admin@cobunny.com<br>
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-navy {
  background-color: #1C2541;
  border: none;
  padding: 12px;
  font-weight: 600;
}

.btn-navy:hover:not(:disabled) {
  background-color: #64748b;
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

.form-control {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  width: 100%;
  transition: border-color 0.2s;
}

.form-control:focus {
  border-color: #1C2541;
  outline: none;
  box-shadow: 0 0 0 3px rgba(28, 37, 65, 0.1);
}

.form-control:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}
</style>