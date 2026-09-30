import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/axios'

export const useDealStore = defineStore('deal', () => {
  const deals = ref([])
  const deal = ref(null)
  const kanban = ref({})
  const meta = ref({})
  const loading = ref(false)

  async function fetchDeals(params = {}) {
    loading.value = true
    try {
      const { data } = await api.get('/deals', { params })
      deals.value = data.data
      meta.value = {
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total,
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchKanban() {
    loading.value = true
    try {
      const { data } = await api.get('/deals/kanban')
      kanban.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchDeal(id) {
    const { data } = await api.get(`/deals/${id}`)
    deal.value = data
    return data
  }

  async function createDeal(payload) {
    const { data } = await api.post('/deals', payload)
    return data
  }

  async function updateDeal(id, payload) {
    const { data } = await api.patch(`/deals/${id}`, payload)
    return data
  }

  async function deleteDeal(id) {
    await api.delete(`/deals/${id}`)
    deals.value = deals.value.filter((d) => d.id !== id)
  }

  async function updateStage(id, stage) {
    const { data } = await api.patch(`/deals/${id}/stage`, { stage })
    return data
  }

  // Timeline notes come back as `note_entries`; `notes` is the deal's own text
  // column and must not be shadowed by the relation.
  async function addNote(dealId, content) {
    const { data } = await api.post(`/deals/${dealId}/notes`, { content })
    return data
  }

  async function deleteNote(dealId, noteId) {
    await api.delete(`/deals/${dealId}/notes/${noteId}`)
  }

  return {
    deals,
    deal,
    kanban,
    meta,
    loading,
    fetchDeals,
    fetchKanban,
    fetchDeal,
    createDeal,
    updateDeal,
    deleteDeal,
    updateStage,
    addNote,
    deleteNote,
  }
})
