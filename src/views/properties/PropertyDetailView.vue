<template>
  <div v-if="!loaded" class="text-center py-12 text-gray-400">Loading...</div>

  <div v-else class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-start mb-6">
      <div>
        <RouterLink to="/properties" class="text-sm text-gray-400 hover:text-gray-600">← Properties</RouterLink>
        <h2 class="text-2xl font-bold text-gray-800 mt-1">{{ property.title }}</h2>
        <p class="text-gray-500 text-sm">
          {{ property.address }}, {{ property.city }}, {{ property.state }} {{ property.zip }}
        </p>
      </div>
      <RouterLink
        :to="`/properties/${property.id}/edit?back=/properties/${property.id}`"
        class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700"
      >
        Edit
      </RouterLink>
    </div>

    <!-- Details card -->
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p class="text-gray-400">Price</p>
          <p class="font-semibold text-blue-700 text-lg">${{ Number(property.price).toLocaleString() }}</p>
        </div>
        <div>
          <p class="text-gray-400">Type</p>
          <p class="font-medium capitalize">{{ property.type }}</p>
        </div>
        <div>
          <p class="text-gray-400">Listing</p>
          <p class="font-medium capitalize">For {{ property.listing_type }}</p>
        </div>
        <div>
          <p class="text-gray-400">Status</p>
          <span :class="statusClass(property.status)" class="inline-block text-xs px-2.5 py-1 rounded-full font-medium">
            {{ statusLabel(property.status) }}
          </span>
        </div>
        <div v-if="property.bedrooms !== null">
          <p class="text-gray-400">Bedrooms</p>
          <p class="font-medium">{{ property.bedrooms }}</p>
        </div>
        <div v-if="property.bathrooms !== null">
          <p class="text-gray-400">Bathrooms</p>
          <p class="font-medium">{{ property.bathrooms }}</p>
        </div>
        <div v-if="property.area_sqft">
          <p class="text-gray-400">Area</p>
          <p class="font-medium">{{ property.area_sqft.toLocaleString() }} sqft</p>
        </div>
      </div>

      <div v-if="property.description" class="mt-5 pt-5 border-t text-sm text-gray-600">
        {{ property.description }}
      </div>
    </div>

    <!-- Image Gallery -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-semibold text-gray-800">Images</h3>
        <label class="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-md">
          + Add Images
          <input type="file" multiple accept="image/*" class="hidden" @change="uploadImages" />
        </label>
      </div>

      <div v-if="!property.images.length" class="text-sm text-gray-400 py-4">No images uploaded yet.</div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="img in property.images" :key="img.id" class="relative group">
          <img :src="img.url" :alt="property.title" class="w-full h-32 object-cover rounded-lg" />

          <!-- Primary badge -->
          <span v-if="img.is_primary" class="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
            Primary
          </span>

          <!-- Actions -->
          <div
            class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 rounded-lg"
          >
            <button
              v-if="!img.is_primary"
              @click="setAsPrimary(img.id)"
              class="bg-white text-xs text-blue-700 px-3 py-1 rounded font-medium"
            >
              Set Primary
            </button>
            <button @click="removeImage(img.id)" class="bg-white text-xs text-red-600 px-3 py-1 rounded font-medium">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePropertyStore } from '@/stores/property'

const props = defineProps({ id: String })
const store = usePropertyStore()
const property = ref(null)
const loaded = ref(false)

onMounted(async () => {
  property.value = await store.fetchProperty(props.id)
  loaded.value = true
})

async function uploadImages(e) {
  const fd = new FormData()
  Array.from(e.target.files).forEach((f) => fd.append('images[]', f))
  const newImages = await store.addImages(property.value.id, fd)
  property.value.images.push(...newImages)
  e.target.value = ''
}

async function removeImage(imageId) {
  if (!confirm('Delete this image?')) return
  await store.deleteImage(property.value.id, imageId)
  property.value.images = property.value.images.filter((i) => i.id !== imageId)
  // If we removed the primary, mark the first remaining as primary
  if (!property.value.images.some((i) => i.is_primary) && property.value.images.length) {
    property.value.images[0].is_primary = true
  }
}

async function setAsPrimary(imageId) {
  await store.setPrimaryImage(property.value.id, imageId)
  property.value.images.forEach((i) => (i.is_primary = i.id === imageId))
}

function statusLabel(s) {
  return { active: 'Active', under_contract: 'Under Contract', sold: 'Sold', off_market: 'Off Market' }[s] ?? s
}
function statusClass(s) {
  return {
    active: 'bg-green-100 text-green-700',
    under_contract: 'bg-yellow-100 text-yellow-700',
    sold: 'bg-blue-100 text-blue-700',
    off_market: 'bg-gray-100 text-gray-600',
  }[s]
}
</script>
