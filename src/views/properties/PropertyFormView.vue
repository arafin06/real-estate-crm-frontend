<template>
  <div class="max-w-3xl mx-auto">
    <!-- Page Header -->
    <div class="flex items-center gap-2 mb-6">
      <RouterLink :to="backTo" class="text-gray-400 hover:text-gray-600 text-sm">
        {{ backTo === '/properties' ? '← Properties' : '← Back' }}
      </RouterLink>
      <span class="text-gray-300">/</span>
      <h2 class="text-xl font-bold text-gray-800">{{ isEdit ? 'Edit Property' : 'Add Property' }}</h2>
    </div>

    <form @submit.prevent="submit" class="space-y-5">
      <!-- ① Basic Information -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Basic Information</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              placeholder="e.g. Modern 3BR Home in Austin"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p v-if="errors.title" class="text-xs text-red-600 mt-1">{{ errors.title[0] }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Describe the property..."
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- ② Property Details -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Property Details</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Property Type <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.type"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Listing Type <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.listing_type"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Status <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.status"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="under_contract">Under Contract</option>
              <option value="sold">Sold</option>
              <option value="off_market">Off Market</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Price ($) <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.price"
              type="number"
              min="0"
              step="0.01"
              required
              placeholder="0.00"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p v-if="errors.price" class="text-xs text-red-600 mt-1">{{ errors.price[0] }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <input
              v-model="form.bedrooms"
              type="number"
              min="0"
              placeholder="—"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <input
              v-model="form.bathrooms"
              type="number"
              min="0"
              placeholder="—"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div class="mt-4 w-48">
          <label class="block text-sm font-medium text-gray-700 mb-1">Area (sqft)</label>
          <input
            v-model="form.area_sqft"
            type="number"
            min="0"
            placeholder="—"
            class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- ③ Location -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="mb-4">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Location</h3>
          <p class="text-xs text-gray-400 mt-0.5">Start typing — city, state, and ZIP auto-fill from the suggestion.</p>
        </div>

        <div class="space-y-4">
          <!-- Address with Nominatim dropdown -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Street Address <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="form.address"
                type="text"
                required
                placeholder="Start typing a US address..."
                autocomplete="off"
                @input="onAddressInput"
                @keydown.escape="suggestions = []"
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <!-- Spinner -->
              <div v-if="searching" class="absolute right-3 top-1/2 -translate-y-1/2">
                <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>

              <!-- Suggestions dropdown -->
              <ul
                v-if="suggestions.length"
                class="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-auto"
              >
                <li
                  v-for="(s, i) in suggestions"
                  :key="i"
                  @mousedown.prevent="selectSuggestion(s)"
                  class="px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
                >
                  <span class="font-medium text-gray-800">
                    {{ streetLine(s) }}
                  </span>
                  <br />
                  <span class="text-xs text-gray-400">{{ s.display_name }}</span>
                </li>
              </ul>

              <!-- No results -->
              <div
                v-if="noResults"
                class="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow mt-1 px-4 py-3 text-sm text-gray-400"
              >
                No US addresses found — try a different search or fill in manually.
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                City <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.city"
                type="text"
                required
                placeholder="Auto-filled"
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                State <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.state"
                type="text"
                required
                placeholder="Auto-filled"
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ZIP <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.zip"
                type="text"
                required
                placeholder="Auto-filled"
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- ④ Images (create mode only) -->
      <div v-if="!isEdit" class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Images</h3>

        <label
          class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5
                 m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <p class="text-sm text-gray-500 font-medium">Click to upload images</p>
          <p class="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP · Max 2MB each · First = primary</p>
          <input type="file" multiple accept="image/*" class="hidden" @change="onFileChange" />
        </label>

        <div v-if="previews.length" class="flex flex-wrap gap-3 mt-4">
          <div v-for="(src, i) in previews" :key="i" class="relative">
            <img :src="src" class="w-24 h-24 object-cover rounded-lg border border-gray-200" />
            <span
              v-if="i === 0"
              class="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded font-medium"
            >
              Primary
            </span>
            <button
              type="button"
              @click="removePreview(i)"
              class="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- Submit bar -->
      <div class="flex items-center gap-4 pb-8">
        <button
          type="submit"
          :disabled="loading"
          class="bg-blue-600 text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {{ loading ? 'Saving...' : isEdit ? 'Update Property' : 'Create Property' }}
        </button>
        <RouterLink
          :to="backTo"
          class="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </RouterLink>
        <p v-if="submitError" class="text-sm text-red-600">{{ submitError }}</p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePropertyStore } from '@/stores/property'

const props = defineProps({ id: String })

const router = useRouter()
const route = useRoute()
const store = usePropertyStore()

// ?back=/properties/3 — return to whichever detail page sent us here.
// Only same-origin paths are honoured so the param can't redirect off-site.
const backTo = computed(() => {
  const back = route.query.back
  return typeof back === 'string' && back.startsWith('/') ? back : '/properties'
})
const isEdit = computed(() => !!props.id)
const loading = ref(false)
const submitError = ref('')
const errors = ref({})
const previews = ref([])
const files = ref([])

// Address autocomplete state
const suggestions = ref([])
const searching = ref(false)
const noResults = ref(false)
let searchTimer = null

const form = reactive({
  title: '',
  description: '',
  type: 'residential',
  listing_type: 'sale',
  price: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  bedrooms: '',
  bathrooms: '',
  area_sqft: '',
  status: 'active',
})

onMounted(async () => {
  if (isEdit.value) {
    const p = await store.fetchProperty(props.id)
    Object.assign(form, {
      title: p.title,
      description: p.description ?? '',
      type: p.type,
      listing_type: p.listing_type,
      price: p.price,
      address: p.address,
      city: p.city,
      state: p.state,
      zip: p.zip,
      bedrooms: p.bedrooms ?? '',
      bathrooms: p.bathrooms ?? '',
      area_sqft: p.area_sqft ?? '',
      status: p.status,
    })
  }
})

// ─── Nominatim address search ──────────────────────────────────────
function onAddressInput() {
  suggestions.value = []
  noResults.value = false
  clearTimeout(searchTimer)

  if (form.address.length < 5) return

  searchTimer = setTimeout(fetchSuggestions, 500)
}

async function fetchSuggestions() {
  searching.value = true
  noResults.value = false
  try {
    const url =
      `https://nominatim.openstreetmap.org/search` +
      `?q=${encodeURIComponent(form.address)}` +
      `&countrycodes=us&addressdetails=1&limit=6&format=json`

    const res = await fetch(url, { headers: { 'Accept-Language': 'en-US' } })
    const data = await res.json()

    suggestions.value = data
    noResults.value = data.length === 0 && form.address.length >= 5
  } catch {
    suggestions.value = []
  } finally {
    searching.value = false
  }
}

function selectSuggestion(item) {
  const a = item.address

  // Build street line from parts Nominatim returns
  const houseNumber = a.house_number ?? ''
  const road = a.road ?? a.pedestrian ?? a.footway ?? ''
  form.address = `${houseNumber} ${road}`.trim() || item.display_name.split(',')[0]

  form.city = a.city ?? a.town ?? a.village ?? a.hamlet ?? a.county ?? ''
  form.state = a.state ?? ''
  form.zip = a.postcode ?? ''

  suggestions.value = []
  noResults.value = false
}

// Helper: what to show as the bold first line in each suggestion
function streetLine(s) {
  const a = s.address
  const num = a.house_number ?? ''
  const road = a.road ?? a.pedestrian ?? ''
  if (num || road) return `${num} ${road}`.trim()
  return s.display_name.split(',')[0]
}

// ─── Image handling ────────────────────────────────────────────────
function onFileChange(e) {
  Array.from(e.target.files).forEach((f) => {
    files.value.push(f)
    previews.value.push(URL.createObjectURL(f))
  })
  e.target.value = ''
}

function removePreview(i) {
  URL.revokeObjectURL(previews.value[i])
  previews.value.splice(i, 1)
  files.value.splice(i, 1)
}

// ─── Submit ────────────────────────────────────────────────────────
async function submit() {
  loading.value = true
  submitError.value = ''
  errors.value = {}

  try {
    if (isEdit.value) {
      await store.updateProperty(props.id, { ...form })
    } else {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (v !== '') fd.append(k, v)
      })
      files.value.forEach((f) => fd.append('images[]', f))
      if (files.value.length) fd.append('primary_index', 0)
      await store.createProperty(fd)
    }
    router.push(backTo.value)
  } catch (e) {
    if (e.response?.status === 422) errors.value = e.response.data.errors ?? {}
    submitError.value = e.response?.data?.message || 'Something went wrong.'
  } finally {
    loading.value = false
  }
}
</script>
