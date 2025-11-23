# CoBunny - Co-working Space Booking Platform 
by Pham Le Bao Tran 104997371

A comprehensive co-working space booking platform built with Vue 3, Bootstrap 5, Vite, and Pinia. This project fulfills all functional requirements for a modern web application with complete CRUD operations and persistent data storage.

## 🚀 Features

### Core Functionality
- **User Authentication**: Complete sign-in/sign-up system with session management
- **Browse & Search**: Advanced filtering for co-working spaces with multiple criteria
- **Booking Management**: Full CRUD operations (Create, Read, Update, Delete, Cancel with Undo)
- **Social Features**: Like/favorite spaces functionality
- **Persistent Storage**: Pinia store with localStorage for data persistence
- **Responsive Design**: Mobile-first design with Bootstrap 5 grid system
- **Real-time Updates**: Reactive state management with Pinia

### Functional Requirements ✅
1. ✅ **User Registration & Login**
   - Sign up with validation (name, email, password strength)
   - Sign in with credential verification
   - Differentiated content for authenticated/unauthenticated users
   - Protected routes with authentication guards

2. ✅ **Search & Filter**
   - Search spaces by name, location, amenities, description
   - Filter by location, price range, and capacity
   - Sort by price, rating, and name
   - News search and category filtering

3. ✅ **Social Features**
   - Like/favorite spaces
   - View favorite spaces in dashboard
   - Statistics tracking (total favorites, bookings)

4. ✅ **CRUD Operations**
   - **Create**: Book new spaces with date, time slot, guest count
   - **Read**: View booking details (separate view page)
   - **Update**: Edit booking information (date, time, guests, requests)
   - **Delete**: Permanently remove bookings
   - **Cancel**: Soft delete with undo functionality

5. ✅ **Persistent Data Storage**
   - Pinia stores for centralized state management
   - localStorage persistence (survives page refresh)
   - Reactive updates across all components
   - Data locations:
     - `cobunny_bookings` - All booking records
     - `cobunny_users` - User accounts
     - `cobunny_user` - Current session

### Stage 3: Advanced Features ✅
**Advanced Technique**: **Pinia State Management with Composition API**

**Why it's Advanced**:
- ✅ Not a basic technique - Official Vue 3 state management library
- ✅ Requires deep understanding of Composition API and Vue reactivity
- ✅ Significantly enhances the entire application architecture

**Implementation**:
1. **Centralized Store** (`src/stores/bookings.js`)
   - Setup with Composition API pattern
   - Reactive state with `ref()`
   - Computed properties for derived state
   - Actions for business logic with auto-persistence

2. **Key Features**:
   - Type-safe actions and getters
   - Automatic localStorage synchronization
   - Reactive updates across all components
   - Developer-friendly with Pinia DevTools support

3. **Code Example**:
```javascript
// Store definition with Composition API
export const useBookingStore = defineStore('bookings', () => {
  const bookings = ref([])
  
  // Computed getters
  const confirmedBookings = computed(() => 
    bookings.value.filter(b => b.status === 'confirmed')
  )
  
  // Actions with business logic
  const addBooking = (booking) => {
    const newBooking = {
      id: Date.now(),
      ...booking,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
    bookings.value.push(newBooking)
    saveToLocalStorage() // Auto-persist
    return newBooking
  }
  
  return { bookings, confirmedBookings, addBooking }
})
```

**Benefits**:
- Single source of truth for all booking data
- Eliminates prop drilling
- Easy testing and debugging
- Scalable architecture for future features
- Performance optimized with fine-grained reactivity

**Learning Resources Used**:
- [Pinia Official Documentation](https://pinia.vuejs.org/)
- Vue 3 Composition API patterns
- State persistence strategies

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3.4.21 (Composition API)
- **State Management**: Pinia 2.x
- **Build Tool**: Vite 5.2.0
- **Routing**: Vue Router 4.3.0
- **UI Framework**: Bootstrap 5.3.3
- **Language**: JavaScript (ES6+)
- **Styling**: Bootstrap 5 + Tailwind CSS utilities
- **Icons**: Unicode emoji characters
- **Colors**: Navy #1C2541, Teal #5BC0BE, Off-white #FAFAFA

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/plebaotrn/CoBunny-v2.git
cd CoBunny-v2
```

2. Install dependencies:
```bash
npm install
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔍 Inspecting Data Storage

### Browser DevTools (Recommended)
1. Open browser DevTools (`F12`)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Navigate to **Local Storage** → `http://localhost:5173`
4. View stored data:
   - `cobunny_bookings` - All booking records
   - `cobunny_users` - Registered users
   - `cobunny_user` - Current session

### Browser Console Commands

**View all bookings**:
```javascript
// Pretty print all bookings
console.table(JSON.parse(localStorage.getItem('cobunny_bookings')))

// Get raw JSON
console.log(JSON.parse(localStorage.getItem('cobunny_bookings')))
```

**View current user**:
```javascript
console.log(JSON.parse(localStorage.getItem('cobunny_user')))
```

**View all registered users**:
```javascript
console.table(JSON.parse(localStorage.getItem('cobunny_users')))
```

**Check specific booking**:
```javascript
const bookings = JSON.parse(localStorage.getItem('cobunny_bookings'))
const booking = bookings.find(b => b.id === 1732176000000) // Replace with actual ID
console.log(booking)
```

**Count bookings by status**:
```javascript
const bookings = JSON.parse(localStorage.getItem('cobunny_bookings'))
const confirmed = bookings.filter(b => b.status === 'confirmed').length
const cancelled = bookings.filter(b => b.status === 'cancelled').length
console.log({ confirmed, cancelled, total: bookings.length })
```

**Clear all data (reset app)**:
```javascript
localStorage.clear()
location.reload()
```

### Pinia DevTools
Install [Vue DevTools](https://devtools.vuejs.org/) browser extension:
1. Open DevTools → **Vue** tab
2. Click **Pinia** section
3. Select `bookings` store
4. View real-time state, actions, and mutations

## 📁 Project Structure

```
CoBunny-v2/
├── src/
│   ├── assets/              # Static assets (logo, images)
│   ├── components/
│   │   ├── layout/          # Navigation & Footer
│   │   └── space/           # Space-related components
│   │       └── SpaceReviews.vue
│   ├── composables/
│   │   └── useAuth.js       # Authentication composable
│   ├── data/                # JSON data files
│   │   ├── spaces.json      # 22 co-working spaces
│   │   ├── news.json        # 22 news articles
│   │   └── users.json       # Initial user data
│   ├── directives/
│   │   └── vTooltip.js      # Custom tooltip directive
│   ├── router/
│   │   └── index.js         # Vue Router with auth guards
│   ├── stores/
│   │   └── bookings.js      # Pinia booking store
│   ├── styles/
│   │   └── main.css         # Global styles
│   ├── views/               # Page components
│   │   ├── About.vue
│   │   ├── Browse.vue       # Combined Spaces + News
│   │   ├── CreateBooking.vue
│   │   ├── Dashboard.vue
│   │   ├── EditBooking.vue
│   │   ├── ViewBooking.vue  # Read-only booking view
│   │   ├── HomePage.vue
│   │   ├── SignIn.vue
│   │   ├── SignUp.vue
│   │   └── SpaceDetails.vue
│   ├── App.vue             # Root component
│   └── main.js             # Entry point with Pinia
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🎯 Key Pages

### Public Pages
- **Home** (`/`): Landing page with overview and CTAs
- **Browse** (`/browse`): Tabbed interface for Spaces and News
- **About** (`/about`): Interactive about page with name inputs
- **Space Details** (`/space/:id`): Detailed space view with reviews
- **Sign In** (`/sign-in`): Authentication page
- **Sign Up** (`/sign-up`): Registration with validation

### Protected Pages (Require Authentication)
- **Dashboard** (`/dashboard`): User bookings, favorites, statistics, and profile
- **Create Booking** (`/booking/create/:spaceId`): New booking form
- **View Booking** (`/booking/view/:id`): Read-only booking details
- **Edit Booking** (`/booking/edit/:id`): Edit existing booking

## 🔑 Demo Credentials

```
Email: jane@example.com
Password: password123
```

Or create a new account via Sign Up!

## 💾 Data Storage Architecture

### Pinia Stores
**Booking Store** (`src/stores/bookings.js`)
- Centralized booking state management
- Actions: `addBooking`, `updateBooking`, `cancelBooking`, `deleteBooking`, `updateBookingStatus`
- Getters: `getUserBookings`, `getBookingById`, `confirmedBookings`, `cancelledBookings`
- Auto-sync with localStorage

### localStorage Keys
- `cobunny_bookings` - All booking records with status tracking
- `cobunny_users` - Registered user accounts
- `cobunny_user` - Current authenticated user session

### Booking Data Structure
```javascript
{
  id: 1732176000000,           // Timestamp-based unique ID
  userId: 1,                    // User who created booking
  spaceId: 3,                   // Space being booked
  spaceName: "Green Garden Office",
  date: "2025-11-20",
  timeSlot: "Full Day (9 AM - 5 PM)",
  numberOfPeople: 4,
  specialRequests: "Need projector",
  totalPrice: 600.00,
  status: "confirmed",          // confirmed | cancelled
  createdAt: "2025-11-17T...",
  updatedAt: "2025-11-17T...",  // Optional
  cancelledAt: "2025-11-17T..." // Optional, only if cancelled
}
```

## 🧪 Key Features Showcase

### 1. Booking Management (Complete CRUD)

**Create Booking**
```javascript
const bookingStore = useBookingStore()
bookingStore.addBooking({
  userId: 1,
  spaceId: 3,
  spaceName: "Downtown Hub",
  date: "2025-11-20",
  timeSlot: "Full Day",
  numberOfPeople: 4,
  totalPrice: 600.00
})
```

**Read/Update/Delete**
```javascript
const booking = bookingStore.getBookingById(id)
bookingStore.updateBooking(id, { date: "2025-11-25" })
bookingStore.cancelBooking(id)  // Soft delete
bookingStore.deleteBooking(id)  // Hard delete
```

### 2. Authentication & Favorites
```javascript
const { signIn, toggleFavorite } = useAuth()
signIn('john@example.com', 'password123')
toggleFavorite(spaceId)
```

## 📊 Dashboard Features

- **Statistics**: Total bookings, upcoming count, favorites, total spent
- **Upcoming Bookings**: View, Edit, Cancel actions
- **Past Bookings**: Cancelled bookings with Undo + Delete buttons
- **Favorites**: Quick access to favorite spaces

## 🎨 Design System

### Colors
- **Navy**: #1C2541 (Primary)
- **Teal**: #5BC0BE (Accent)
- **Slate**: #64748b (Secondary text)
- **Off-white**: #FAFAFA (Background)

### Fonts
- Montserrat (Headings)
- Poppins (Subheadings)
- Inter (Body text)

### Responsive Breakpoints
- Mobile: 320px - 767px (col-12)
- Tablet: 768px - 1023px (col-md-6)
- Desktop: 1024px+ (col-lg-4)

## 🔒 Security Notes

**Important**: This is a demo application for educational purposes. It uses client-side storage (localStorage) for simplicity. In a production environment:
- Never store passwords in localStorage
- Use secure backend authentication with JWT tokens
- Hash all passwords on the server
- Implement HTTPS
- Add CSRF protection
- Use environment variables for sensitive data

## 🧪 Key Features Showcase

### 1. Booking Management (Complete CRUD)

**Create Booking**
```javascript
const bookingStore = useBookingStore()
bookingStore.addBooking({
  userId: 1,
  spaceId: 3,
  spaceName: "Downtown Hub",
  date: "2025-11-20",
  timeSlot: "Full Day",
  numberOfPeople: 4,
  totalPrice: 600.00
})
// Auto-generates: id, status: 'confirmed', createdAt
```

**Read Booking**
```javascript
// Get specific booking
const booking = bookingStore.getBookingById(bookingId)

// Get user's bookings
const userBookings = bookingStore.getUserBookings(userId)
```

**Update Booking**
```javascript
bookingStore.updateBooking(bookingId, {
  date: "2025-11-25",
  numberOfPeople: 6,
  totalPrice: 720.00
})
// Auto-adds: updatedAt timestamp
```

**Delete/Cancel Booking**
```javascript
// Soft delete (keeps history)
bookingStore.cancelBooking(bookingId)
// Sets: status: 'cancelled', cancelledAt: timestamp

// Hard delete (permanent removal)
bookingStore.deleteBooking(bookingId)
// Removes from array and localStorage

// Undo cancel
bookingStore.updateBookingStatus(bookingId, 'confirmed')
// Restores booking if date is still upcoming
```

### 2. Authentication
```javascript
// Sign in
const { signIn } = useAuth()
signIn('john@example.com', 'password123')

// Sign up
const { signUp } = useAuth()
signUp({ firstName, lastName, email, password })
```

### Favorites
```javascript
// Toggle favorite
const { toggleFavorite, isFavorite } = useAuth()
toggleFavorite(spaceId)

// Check if favorited
isFavorite(spaceId) // returns boolean
```

### Custom Directive
```vue
<!-- Use tooltip -->
<button v-tooltip="'Click to book'">Book Now</button>
```

## 🚀 Future Enhancements

- Backend API with database (PostgreSQL/MongoDB)
- Real-time availability with WebSockets
- Payment integration (Stripe/PayPal)
- Email notifications for bookings
- Admin dashboard for space management
- Advanced analytics and reporting
- Mobile app (React Native/Flutter)

## 🧪 Testing & Debugging

### Quick Test Bookings
Run this in browser console to create test bookings:
```javascript
// Access the Pinia store (requires Vue DevTools)
const bookingStore = window.__VUE_DEVTOOLS_GLOBAL_HOOK__.stores.bookings

// Or use localStorage directly
const testBooking = {
  id: Date.now(),
  userId: 1,
  spaceId: 3,
  spaceName: "Test Space",
  date: "2025-11-25",
  timeSlot: "Full Day (9 AM - 5 PM)",
  numberOfPeople: 4,
  totalPrice: 500,
  status: "confirmed",
  createdAt: new Date().toISOString()
}

const bookings = JSON.parse(localStorage.getItem('cobunny_bookings') || '[]')
bookings.push(testBooking)
localStorage.setItem('cobunny_bookings', JSON.stringify(bookings))
location.reload() // Refresh to see changes
```

### Debug Helpers
```javascript
// Check if user is logged in
!!localStorage.getItem('cobunny_user')

// Get current user favorites
JSON.parse(localStorage.getItem('cobunny_user'))?.favorites || []

// Export all data (for backup)
const exportData = {
  bookings: JSON.parse(localStorage.getItem('cobunny_bookings')),
  users: JSON.parse(localStorage.getItem('cobunny_users')),
  currentUser: JSON.parse(localStorage.getItem('cobunny_user'))
}
console.log(JSON.stringify(exportData, null, 2))
```

## 📄 License

This project is for educational purposes.

---

**Built with ❤️ using Vue 3, Pinia, Bootstrap 5, and Vite**

### Quick Links
- 🏠 [Homepage](http://localhost:5173)
- 📚 [Browse Spaces](http://localhost:5173/browse)
- 📊 [Dashboard](http://localhost:5173/dashboard) (requires login)
- 🔐 [Sign In](http://localhost:5173/sign-in)

### Development Resources
- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Bootstrap 5](https://getbootstrap.com/)
- [Vite](https://vitejs.dev/)


