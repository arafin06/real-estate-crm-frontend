import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/axios'

export const usePropertyStore = defineStore('property', () => {
  const properties = ref([])
  const property = ref(null)
  const meta = ref({})
  const loading = ref(false)

  async function fetchProperties(params = {}) {
    loading.value = true
    try {
      const { data } = await api.get('/properties', { params })
      properties.value = data.data
      meta.value = {
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total,
        perPage: data.per_page,
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchProperty(id) {
    const { data } = await api.get(`/properties/${id}`)
    property.value = data
    return data
  }

  async function createProperty(formData) {
    const { data } = await api.post('/properties', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  }

  async function updateProperty(id, payload) {
    const { data } = await api.patch(`/properties/${id}`, payload)
    return data
  }

  async function deleteProperty(id) {
    await api.delete(`/properties/${id}`)
    properties.value = properties.value.filter((p) => p.id !== id)
  }

  async function addImages(propertyId, formData) {
    const { data } = await api.post(`/properties/${propertyId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  }

  async function deleteImage(propertyId, imageId) {
    await api.delete(`/properties/${propertyId}/images/${imageId}`)
  }

  async function setPrimaryImage(propertyId, imageId) {
    const { data } = await api.patch(`/properties/${propertyId}/images/${imageId}/primary`)
    return data
  }

  return {
    properties,
    property,
    meta,
    loading,
    fetchProperties,
    fetchProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    addImages,
    deleteImage,
    setPrimaryImage,
  }
})
