import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/axios'

export const useClientStore = defineStore('client', () => {
  const clients = ref([])
  const client = ref(null)
  const meta = ref({})
  const loading = ref(false)

  async function fetchClients(params = {}) {
    loading.value = true
    try {
      const { data } = await api.get('/clients', { params })
      clients.value = data.data
      meta.value = {
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total,
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchClient(id) {
    const { data } = await api.get(`/clients/${id}`)
    client.value = data
    return data
  }

  async function createClient(payload) {
    const { data } = await api.post('/clients', payload)
    return data
  }

  async function updateClient(id, payload) {
    const { data } = await api.patch(`/clients/${id}`, payload)
    return data
  }

  async function deleteClient(id) {
    await api.delete(`/clients/${id}`)
    clients.value = clients.value.filter((c) => c.id !== id)
  }

  async function addNote(clientId, content) {
    const { data } = await api.post(`/clients/${clientId}/notes`, { content })
    return data
  }

  async function deleteNote(clientId, noteId) {
    await api.delete(`/clients/${clientId}/notes/${noteId}`)
  }

  async function addPhone(clientId, payload) {
    const { data } = await api.post(`/clients/${clientId}/phones`, payload)
    return data
  }

  async function updatePhone(clientId, phoneId, payload) {
    const { data } = await api.patch(`/clients/${clientId}/phones/${phoneId}`, payload)
    return data
  }

  async function deletePhone(clientId, phoneId) {
    await api.delete(`/clients/${clientId}/phones/${phoneId}`)
  }

  return {
    clients,
    client,
    meta,
    loading,
    fetchClients,
    fetchClient,
    createClient,
    updateClient,
    deleteClient,
    addNote,
    deleteNote,
    addPhone,
    updatePhone,
    deletePhone,
  }
})
