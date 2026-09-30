import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/axios'

export const useSubscriptionStore = defineStore('subscription', () => {
  const redirecting = ref(false)
  const error = ref('')

  // Both of these hand off to a Stripe-hosted page, so the promise never
  // resolves in the normal case — the browser navigates away instead.
  async function createCheckoutSession() {
    redirecting.value = true
    error.value = ''
    try {
      const { data } = await api.post('/subscription/checkout')
      window.location.href = data.url
    } catch (e) {
      error.value = e.response?.data?.message || 'Could not start checkout. Please try again.'
      redirecting.value = false
      throw e
    }
  }

  async function openCustomerPortal() {
    redirecting.value = true
    error.value = ''
    try {
      const { data } = await api.post('/subscription/portal')
      window.location.href = data.url
    } catch (e) {
      error.value = e.response?.data?.message || 'Could not open billing. Please try again.'
      redirecting.value = false
      throw e
    }
  }

  return { redirecting, error, createCheckoutSession, openCustomerPortal }
})
