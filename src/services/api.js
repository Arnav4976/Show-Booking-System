const API_BASE_URL = 'http://localhost:8080/api';

const fetchJson = async (url, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("Conflict: The selected seats are already booked.");
    }
    if (response.status === 404) {
      throw new Error("Resource not found");
    }
    throw new Error(`HTTP Error: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ==========================================
// Authentication & Users (Mock)
// ==========================================
export const AuthService = {
  // POST /api/auth/register
  register: async (userData) => {
    await delay(300);
    // Mock successful registration
    return { message: "User registered successfully!" };
  },

  // POST /api/auth/login
  login: async (credentials) => {
    await delay(300);
    
    // Mock role distribution based on predictable testing credentials
    const isAdmin = credentials.username === 'admin';

    return {
      token: "mock-jwt-token-ey12345",
      type: "Bearer",
      id: isAdmin ? 99 : 1,
      username: credentials.username || "guest_user",
      email: isAdmin ? "admin@cineprime.local" : "guest@cineprime.local",
      roles: isAdmin ? ["ROLE_ADMIN"] : ["ROLE_USER"]
    };
  },

  // GET /api/auth/me
  getCurrentUser: async () => {
    await delay(200);
    // Mock retrieving the current authenticated user context
    return {
      id: 1,
      username: "guest_user",
      email: "guest@cineprime.local",
      roles: ["ROLE_USER"]
    };
  },
  
  logout: async () => {
    await delay(100);
    return { message: "Logged out successfully" };
  }
};

// ==========================================
// Movies
// ==========================================
export const MovieService = {
  getAll: async () => fetchJson('/movies'),
  getById: async (id) => fetchJson(`/movies/${id}`),
  create: async (movieData) => fetchJson('/movies', { method: 'POST', body: JSON.stringify(movieData) }),
  update: async (id, movieData) => fetchJson(`/movies/${id}`, { method: 'PUT', body: JSON.stringify(movieData) }),
  delete: async (id) => fetchJson(`/movies/${id}`, { method: 'DELETE' })
};

// ==========================================
// Theatres & Screens
// ==========================================
export const TheatreService = {
  getAll: async () => fetchJson('/theatres'),
  getById: async (id) => fetchJson(`/theatres/${id}`),
  create: async (data) => fetchJson('/theatres', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => fetchJson(`/theatres/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => fetchJson(`/theatres/${id}`, { method: 'DELETE' })
};

export const ScreenService = {
  getAll: async () => fetchJson('/screens'),
  getByTheatreId: async (theatreId) => fetchJson(`/theatres/${theatreId}/screens`),
  getSeats: async (screenId) => fetchJson(`/screens/${screenId}/seats`),
  create: async (data) => fetchJson('/screens', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => fetchJson(`/screens/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => fetchJson(`/screens/${id}`, { method: 'DELETE' })
};

// ==========================================
// Shows
// ==========================================
export const ShowService = {
  getAll: async () => fetchJson('/shows'),
  getByMovieId: async (movieId) => fetchJson(`/shows?movieId=${movieId}`),
  getByTheatreId: async (theatreId) => fetchJson(`/shows?theatreId=${theatreId}`),
  getById: async (id) => fetchJson(`/shows/${id}`),
  getSeatsForShow: async (showId) => fetchJson(`/shows/${showId}/seats`),
  create: async (data) => fetchJson('/shows', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => fetchJson(`/shows/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => fetchJson(`/shows/${id}`, { method: 'DELETE' })
};

// ==========================================
// Bookings
// ==========================================
export const BookingService = {
  create: async (bookingData) => fetchJson('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
  getAll: async () => fetchJson('/bookings'),
  getById: async (id) => fetchJson(`/bookings/${id}`),
  getUserBookings: async (userId = 1) => fetchJson(`/users/${userId}/bookings`),
  delete: async (id) => fetchJson(`/bookings/${id}`, { method: 'DELETE' })
};

