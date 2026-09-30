<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-800">Properties</h2>
      <RouterLink
        to="/properties/create"
        class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700"
      >
        + Add Property
      </RouterLink>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-6 grid grid-cols-2 md:grid-cols-5 gap-3">
      <input
        v-model="filters.search"
        type="text"
        placeholder="Search title or address..."
        class="border border-gray-300 rounded-md px-3 py-2 text-sm col-span-2"
        @input="onFilter"
      />
      <select
        v-model="filters.type"
        class="border border-gray-300 rounded-md px-3 py-2 text-sm"
        @change="onFilter"
      >
        <option value="">All Types</option>
        <option value="residential">Residential</option>
        <option value="commercial">Commercial</option>
      </select>
      <select
        v-model="filters.status"
        class="border border-gray-300 rounded-md px-3 py-2 text-sm"
        @change="onFilter"
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="under_contract">Under Contract</option>
        <option value="sold">Sold</option>
        <option value="off_market">Off Market</option>
      </select>
      <input
        v-model="filters.city"
        type="text"
        placeholder="City..."
        class="border border-gray-300 rounded-md px-3 py-2 text-sm"
        @input="onFilter"
      />
    </div>

    <!-- Grid -->
    <div v-if="store.loading" class="text-center py-12 text-gray-400">Loading...</div>

    <div v-else-if="!store.properties.length" class="text-center py-12 text-gray-400">
      No properties found.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div
        v-for="p in store.properties"
        :key="p.id"
        class="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
      >
        <!-- Image -->
        <RouterLink :to="`/properties/${p.id}`" class="block relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            v-if="p.primary_image"
            :src="p.primary_image.url"
            :alt="p.title"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-300">
            <svg class="w-10 h-10 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75
                   m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25
                   c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008z"
              />
            </svg>
            <span class="text-xs">No photo</span>
          </div>

          <!-- Badges on image -->
          <div class="absolute top-2 left-2 flex gap-1.5">
            <span class="bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
              {{ p.listing_type === 'rent' ? 'FOR RENT' : 'FOR SALE' }}
            </span>
            <span class="bg-gray-700/80 text-white text-xs font-medium px-2 py-0.5 rounded capitalize">
              {{ p.type }}
            </span>
          </div>

          <!-- Status badge -->
          <div class="absolute top-2 right-2">
            <span :class="statusClass(p.status)" class="text-xs font-semibold px-2 py-0.5 rounded">
              {{ statusLabel(p.status) }}
            </span>
          </div>
        </RouterLink>

        <!-- Card Body -->
        <div class="p-4 flex flex-col flex-1">
          <RouterLink
            :to="`/properties/${p.id}`"
            class="font-semibold text-gray-800 hover:text-blue-600 leading-snug mb-1 line-clamp-1"
          >
            {{ p.title }}
          </RouterLink>
          <p class="text-xs text-gray-400 mb-3">
            <svg class="w-3 h-3 inline mr-0.5 -mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001
                .006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966
                2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355
                7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.757.433l.018.008.006.003z"
                clip-rule="evenodd"
              />
            </svg>
            {{ p.city }}, {{ p.state }}
          </p>

          <p class="text-blue-700 font-bold text-xl mb-1">
            ${{ Number(p.price).toLocaleString() }}
            <span class="text-xs font-normal text-gray-400">{{ p.listing_type === 'rent' ? '/mo' : '' }}</span>
          </p>

          <div class="flex gap-3 text-xs text-gray-500 mb-4">
            <span v-if="p.bedrooms != null"> <strong class="text-gray-700">{{ p.bedrooms }}</strong> bd </span>
            <span v-if="p.bathrooms != null"> <strong class="text-gray-700">{{ p.bathrooms }}</strong> ba </span>
            <span v-if="p.area_sqft">
              <strong class="text-gray-700">{{ Number(p.area_sqft).toLocaleString() }}</strong> sqft
            </span>
          </div>

          <!-- Actions -->
          <div class="mt-auto flex gap-2 pt-3 border-t border-gray-100">
            <RouterLink
              :to="`/properties/${p.id}`"
              class="flex-1 text-center text-xs font-medium text-gray-600 hover:text-blue-600 py-1.5"
            >
              View
            </RouterLink>
            <RouterLink
              :to="`/properties/${p.id}/edit`"
              class="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-1.5 rounded-md transition-colors"
            >
              Edit
            </RouterLink>
            <button
              @click="confirmDelete(p)"
              class="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium py-1.5 rounded-md transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="store.meta.lastPage > 1" class="flex justify-center gap-2 mt-8">
      <button
        v-for="page in store.meta.lastPage"
        :key="page"
        @click="goToPage(page)"
        :class="page === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'"
        class="w-9 h-9 rounded-md text-sm font-medium border border-gray-200"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePropertyStore } from '@/stores/property'

const store = usePropertyStore()
const currentPage = ref(1)
const filters = ref({ search: '', type: '', status: '', city: '' })

let filterTimer = null

function onFilter() {
  clearTimeout(filterTimer)
  filterTimer = setTimeout(() => {
    currentPage.value = 1
    load()
  }, 400)
}

function goToPage(page) {
  currentPage.value = page
  load()
}

function load() {
  store.fetchProperties({
    page: currentPage.value,
    ...Object.fromEntries(Object.entries(filters.value).filter(([, v]) => v)),
  })
}

async function confirmDelete(property) {
  if (!confirm(`Delete "${property.title}"?`)) return
  await store.deleteProperty(property.id)
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
  }[s] ?? 'bg-gray-100 text-gray-600'
}

onMounted(load)
</script>
