<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-800">Deals</h2>
      <div class="flex gap-2">
        <RouterLink
          to="/deals/kanban"
          class="border border-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
        >
          ⊞ Kanban
        </RouterLink>
        <RouterLink
          to="/deals/create"
          class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700"
        >
          + Add Deal
        </RouterLink>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-3">
      <input
        v-model="filters.search"
        type="text"
        placeholder="Search deal title..."
        class="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 min-w-48"
        @input="onFilter"
      />
      <select v-model="filters.stage" class="border border-gray-300 rounded-md px-3 py-2 text-sm" @change="onFilter">
        <option value="">All Stages</option>
        <option v-for="s in STAGES" :key="s.key" :value="s.key">{{ s.label }}</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div v-if="store.loading" class="text-center py-12 text-gray-400">Loading...</div>
      <div v-else-if="!store.deals.length" class="text-center py-12 text-gray-400">No deals found.</div>

      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide border-b border-gray-100">
          <tr>
            <th class="text-left px-5 py-3">Title</th>
            <th class="text-left px-5 py-3">Client</th>
            <th class="text-left px-5 py-3">Stage</th>
            <th class="text-left px-5 py-3">Deal Value</th>
            <th class="text-left px-5 py-3">Commission</th>
            <th class="text-left px-5 py-3">Close Date</th>
            <th class="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="d in store.deals" :key="d.id" class="hover:bg-gray-50">
            <td class="px-5 py-3 font-medium text-gray-800">
              <RouterLink :to="`/deals/${d.id}`" class="hover:text-blue-600">{{ d.title }}</RouterLink>
            </td>
            <td class="px-5 py-3 text-gray-500">{{ d.client?.name ?? '—' }}</td>
            <td class="px-5 py-3">
              <span :class="stageClass(d.stage)" class="text-xs px-2.5 py-0.5 rounded-full font-medium">
                {{ stageLabel(d.stage) }}
              </span>
            </td>
            <td class="px-5 py-3 font-medium text-gray-800">${{ Number(d.deal_value).toLocaleString() }}</td>
            <td class="px-5 py-3 font-medium text-green-600">
              ${{ Number(d.commission_amount).toLocaleString() }}
            </td>
            <td class="px-5 py-3 text-gray-500">
              {{ d.expected_close_date ? formatDate(d.expected_close_date) : '—' }}
            </td>
            <td class="px-5 py-3">
              <div class="flex gap-3 justify-end">
                <RouterLink :to="`/deals/${d.id}/edit`" class="text-xs text-gray-600 hover:text-blue-600 font-medium"
                  >Edit</RouterLink
                >
                <button @click="confirmDelete(d)" class="text-xs text-red-500 hover:text-red-700 font-medium">
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
import { useDealStore } from '@/stores/deal'

const store = useDealStore()
const currentPage = ref(1)
const filters = ref({ search: '', stage: '' })
let filterTimer = null

const STAGES = [
  { key: 'lead', label: 'Lead' },
  { key: 'prospect', label: 'Prospect' },
  { key: 'showing', label: 'Showing' },
  { key: 'offer_made', label: 'Offer Made' },
  { key: 'under_contract', label: 'Under Contract' },
  { key: 'closed', label: 'Closed' },
  { key: 'lost', label: 'Lost' },
]

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
  store.fetchDeals({
    page: currentPage.value,
    ...Object.fromEntries(Object.entries(filters.value).filter(([, v]) => v)),
  })
}

async function confirmDelete(deal) {
  if (!confirm(`Delete "${deal.title}"?`)) return
  await store.deleteDeal(deal.id)
}

function stageLabel(s) {
  return STAGES.find((st) => st.key === s)?.label ?? s
}

function stageClass(s) {
  return (
    {
      lead: 'bg-gray-100 text-gray-600',
      prospect: 'bg-blue-100 text-blue-700',
      showing: 'bg-indigo-100 text-indigo-700',
      offer_made: 'bg-yellow-100 text-yellow-700',
      under_contract: 'bg-orange-100 text-orange-700',
      closed: 'bg-green-100 text-green-700',
      lost: 'bg-red-100 text-red-700',
    }[s] ?? 'bg-gray-100 text-gray-600'
  )
}

function formatDate(s) {
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(load)
</script>
