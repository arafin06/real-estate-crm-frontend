import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Redirect to login on 401; surface the upgrade prompt on 402
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    // Free-tier limit reached — App.vue listens for this and opens UpgradeModal.
    if (error.response?.status === 402 && error.response?.data?.upgrade) {
      window.dispatchEvent(new CustomEvent('show-upgrade-modal', { detail: error.response.data }))
    }

    return Promise.reject(error)
  },
)

export default api
