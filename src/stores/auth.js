import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || null)

  const isLoggedIn = computed(() => !!token.value)
  const isAgent = computed(() => user.value?.role === 'agent')
  const isAdmin = computed(() => user.value?.role === 'super_admin')
  const plan = computed(() => user.value?.subscription_status ?? 'free')
  const isPro = computed(() => plan.value === 'pro')

  function setAuth(userData, tokenValue) {
    user.value = userData
    token.value = tokenValue
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', tokenValue)
  }

  function clearAuth() {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  async function login(credentials) {
    const { data } = await api.post('/login', credentials)
    setAuth(data.user, data.token)
  }

  async function register(payload) {
    const { data } = await api.post('/register', payload)
    setAuth(data.user, data.token)
  }

  async function logout() {
    await api.post('/logout')
    clearAuth()
  }

  function setUser(data) {
    user.value = data
    localStorage.setItem('user', JSON.stringify(data))
  }

  async function fetchUser() {
    const { data } = await api.get('/me')
    setUser(data)
  }

  async function updateProfile(payload) {
    const { data } = await api.patch('/profile', payload)
    setUser(data)
    return data
  }

  async function updatePassword(payload) {
    const { data } = await api.post('/profile/password', payload)
    return data
  }

  async function updateAvatar(formData) {
    // Let the browser set the multipart boundary itself.
    const { data } = await api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': undefined },
    })
    setUser(data.user)
    return data
  }

  return {
    user,
    token,
    isLoggedIn,
    isAgent,
    isAdmin,
    plan,
    isPro,
    login,
    register,
    logout,
    fetchUser,
    setUser,
    updateProfile,
    updatePassword,
    updateAvatar,
    clearAuth,
  }
})
