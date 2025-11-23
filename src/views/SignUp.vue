<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { signUp } = useAuth()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeToTerms = ref(false)

const errors = ref({})
const isLoading = ref(false)

// Password strength indicator
const passwordStrength = computed(() => {
  const pwd = password.value
  if (!pwd) return { level: 0, text: '' }
  
  let strength = 0
  if (pwd.length >= 8) strength++
  if (pwd.length >= 12) strength++
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
  if (/\d/.test(pwd)) strength++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++
  
  if (strength <= 2) return { level: 1, text: 'Weak', color: 'danger' }
  if (strength <= 3) return { level: 2, text: 'Fair', color: 'warning' }
  if (strength <= 4) return { level: 3, text: 'Good', color: 'info' }
  return { level: 4, text: 'Strong', color: 'success' }
})

// Validate form
const validateForm = () => {
  errors.value = {}
  
  // First name validation
  if (!firstName.value.trim()) {
    errors.value.firstName = 'First name is required'
  }
  
  // Last name validation
  if (!lastName.value.trim()) {
    errors.value.lastName = 'Last name is required'
  }
  
  // Email validation
  if (!email.value) {
    errors.value.email = 'Email is required'
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      errors.value.email = 'Please enter a valid email address'
    }
  }
  
  // Password validation
  if (!password.value) {
    errors.value.password = 'Password is required'
  } else if (password.value.length < 8) {
    errors.value.password = 'Password must be at least 8 characters long'
  }
  
  // Confirm password validation
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match'
  }
  
  // Terms agreement
  if (!agreeToTerms.value) {
    errors.value.terms = 'You must agree to the terms and conditions'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSignUp = () => {
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  
  // Simulate async operation
  setTimeout(() => {
    const result = signUp({
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      password: password.value
    })
    
    if (result.success) {
      router.push({ name: 'dashboard' })
    } else {
      errors.value.email = result.message
    }
    
    isLoading.value = false
  }, 500)
}

const goToSignIn = () => {
  router.push({ name: 'sign-in' })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-6 bg-off-white">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h1 class="text-4xl font-bold mb-2 text-center text-navy font-montserrat">Join CoBunny! 🎉</h1>
        <p class="text-slate text-center mb-8 font-inter">Create your account and start booking</p>
        
        <form @submit.prevent="handleSignUp" class="space-y-4">
          <!-- First Name -->
          <div>
            <label for="firstName" class="block text-navy font-semibold mb-2 font-inter">
              First Name <span class="text-danger">*</span>
            </label>
            <input 
              id="firstName"
              v-model="firstName"
              type="text" 
              required
              placeholder="John"
              class="form-control"
              :class="{ 'is-invalid': errors.firstName }"
              :disabled="isLoading"
              @input="errors.firstName = ''"
            >
            <div v-if="errors.firstName" class="invalid-feedback">
              {{ errors.firstName }}
            </div>
          </div>
          
          <!-- Last Name -->
          <div>
            <label for="lastName" class="block text-navy font-semibold mb-2 font-inter">
              Last Name <span class="text-danger">*</span>
            </label>
            <input 
              id="lastName"
              v-model="lastName"
              type="text" 
              required
              placeholder="Doe"
              class="form-control"
              :class="{ 'is-invalid': errors.lastName }"
              :disabled="isLoading"
              @input="errors.lastName = ''"
            >
            <div v-if="errors.lastName" class="invalid-feedback">
              {{ errors.lastName }}
            </div>
          </div>
          
          <!-- Email -->
          <div>
            <label for="email" class="block text-navy font-semibold mb-2 font-inter">
              Email Address <span class="text-danger">*</span>
            </label>
            <input 
              id="email"
              v-model="email"
              type="email" 
              required
              placeholder="you@example.com"
              class="form-control"
              :class="{ 'is-invalid': errors.email }"
              :disabled="isLoading"
              @input="errors.email = ''"
            >
            <div v-if="errors.email" class="invalid-feedback">
              {{ errors.email }}
            </div>
          </div>
          
          <!-- Password -->
          <div>
            <label for="password" class="block text-navy font-semibold mb-2 font-inter">
              Password <span class="text-danger">*</span>
            </label>
            <input 
              id="password"
              v-model="password"
              type="password" 
              required
              placeholder="••••••••"
              class="form-control"
              :class="{ 'is-invalid': errors.password }"
              :disabled="isLoading"
              @input="errors.password = ''"
            >
            <div v-if="errors.password" class="invalid-feedback">
              {{ errors.password }}
            </div>
            <!-- Password strength indicator -->
            <div v-if="password && !errors.password" class="mt-2">
              <div class="progress" style="height: 4px;">
                <div 
                  class="progress-bar"
                  :class="`bg-${passwordStrength.color}`"
                  :style="{ width: `${(passwordStrength.level / 4) * 100}%` }"
                ></div>
              </div>
              <small :class="`text-${passwordStrength.color}`">
                Password strength: {{ passwordStrength.text }}
              </small>
            </div>
            <small class="form-text text-slate">
              Must be at least 8 characters long
            </small>
          </div>
          
          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-navy font-semibold mb-2 font-inter">
              Confirm Password <span class="text-danger">*</span>
            </label>
            <input 
              id="confirmPassword"
              v-model="confirmPassword"
              type="password" 
              required
              placeholder="••••••••"
              class="form-control"
              :class="{ 'is-invalid': errors.confirmPassword }"
              :disabled="isLoading"
              @input="errors.confirmPassword = ''"
            >
            <div v-if="errors.confirmPassword" class="invalid-feedback">
              {{ errors.confirmPassword }}
            </div>
          </div>
          
          <!-- Terms Agreement -->
          <div class="form-check">
            <input 
              id="agreeToTerms"
              v-model="agreeToTerms"
              type="checkbox" 
              required 
              class="form-check-input"
              :class="{ 'is-invalid': errors.terms }"
              :disabled="isLoading"
              @change="errors.terms = ''"
            >
            <label for="agreeToTerms" class="form-check-label text-slate">
              I agree to the <a href="#" class="text-teal">Terms of Service</a> and <a href="#" class="text-teal">Privacy Policy</a>
            </label>
            <div v-if="errors.terms" class="invalid-feedback d-block">
              {{ errors.terms }}
            </div>
          </div>
          
          <button 
            type="submit"
            class="btn btn-navy w-full text-white mt-4"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Creating account...</span>
            <span v-else>Create Account</span>
          </button>
        </form>
        
        <p class="text-center mt-6 text-slate font-inter">
          Already have an account? 
          <button @click="goToSignIn" class="text-teal hover:text-navy font-semibold transition">
            Sign In
          </button>
        </p>
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

.form-control.is-invalid {
  border-color: #dc3545;
}

.form-control:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.form-check-input.is-invalid {
  border-color: #dc3545;
}
</style>