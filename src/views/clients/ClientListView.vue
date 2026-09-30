<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-800">Clients</h2>
      <RouterLink
        to="/clients/create"
        class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700"
      >
        + Add Client
      </RouterLink>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-3">
      <input
        v-model="filters.search"
        type="text"
        placeholder="Search name, email, phone..."
        class="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 min-w-60"
        @input="onFilter"
      />
      <select v-model="filters.type" class="border border-gray-300 rounded-md px-3 py-2 text-sm" @change="onFilter">
        <option value="">All Types</option>
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
        <option value="both">Buyer + Seller</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div v-if="store.loading" class="text-center py-12 text-gray-400">Loading...</div>
      <div v-else-if="!store.clients.length" class="text-center py-12 text-gray-400">No clients found.</div>

      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide border-b border-gray-100">
          <tr>
            <th class="text-left px-5 py-3">Name</th>
            <th class="text-left px-5 py-3">Email</th>
            <th class="text-left px-5 py-3">Phone</th>
            <th class="text-left px-5 py-3">Type</th>
            <th class="text-left px-5 py-3">Source</th>
            <th class="text-left px-5 py-3">Added</th>
            <th class="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="c in store.clients" :key="c.id" class="hover:bg-gray-50">
            <td class="px-5 py-3 font-medium text-gray-800">
              <RouterLink :to="`/clients/${c.id}`" class="hover:text-blue-600">
                {{ c.name }}
              </RouterLink>
            </td>
            <td class="px-5 py-3 text-gray-500">{{ c.email || '—' }}</td>
            <td class="px-5 py-3 text-gray-500">
              <a v-if="c.phones?.length" :href="c.phones[0].tel_link" class="hover:text-blue-600">
                {{ c.phones[0].formatted }}
              </a>
              <span v-else>—</span>
            </td>
            <td class="px-5 py-3">
              <span :class="typeClass(c.type)" class="text-xs px-2.5 py-0.5 rounded-full font-medium">
                {{ typeLabel(c.type) }}
              </span>
            </td>
            <td class="px-5 py-3 text-gray-500">{{ c.source || '—' }}</td>
            <td class="px-5 py-3 text-gray-400">{{ formatDate(c.created_at) }}</td>
            <td class="px-5 py-3">
              <div class="flex gap-3 justify-end">
                <RouterLink :to="`/clients/${c.id}/edit`" class="text-xs text-gray-600 hover:text-blue-600 font-medium">
                  Edit
                </RouterLink>
                <button @click="confirmDelete(c)" class="text-xs text-red-500 hover:text-red-700 font-medium">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="store.meta.lastPage > 1" class="flex justify-center gap-2 mt-6">
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
import { useClientStore } from '@/stores/client'

const store = useClientStore()
const currentPage = ref(1)
const filters = ref({ search: '', type: '' })
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
  store.fetchClients({
    page: currentPage.value,
    ...Object.fromEntries(Object.entries(filters.value).filter(([, v]) => v)),
  })
}

async function confirmDelete(client) {
  if (!confirm(`Delete "${client.name}"?`)) return
  await store.deleteClient(client.id)
}

function typeLabel(t) {
  return { buyer: 'Buyer', seller: 'Seller', both: 'Buyer + Seller' }[t] ?? t
}

function typeClass(t) {
  return (
    {
      buyer: 'bg-blue-100 text-blue-700',
      seller: 'bg-purple-100 text-purple-700',
      both: 'bg-green-100 text-green-700',
    }[t] ?? 'bg-gray-100 text-gray-600'
  )
}

function formatDate(s) {
  return new Date(s).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

onMounted(load)
</script>
