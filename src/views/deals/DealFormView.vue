<template>
  <div class="max-w-2xl mx-auto">
    <div class="flex items-center gap-2 mb-6">
      <RouterLink :to="backTo" class="text-gray-400 hover:text-gray-600 text-sm">
        {{ backTo === '/deals' ? '← Deals' : '← Back' }}
      </RouterLink>
      <span class="text-gray-300">/</span>
      <h2 class="text-xl font-bold text-gray-800">{{ isEdit ? 'Edit Deal' : 'New Deal' }}</h2>
    </div>

    <form @submit.prevent="submit" class="space-y-5">
      <!-- Deal Information -->
      <div class="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Deal Information</h3>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Deal Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="e.g. Johnson Family Home Purchase"
            class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="errors.title" class="text-xs text-red-600 mt-1">{{ errors.title[0] }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Client <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.client_id"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a client...</option>
              <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
            <p v-if="errors.client_id" class="text-xs text-red-600 mt-1">{{ errors.client_id[0] }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Property <span class="text-gray-400 font-normal">(optional)</span>
            </label>
            <select
              v-model="form.property_id"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No property linked</option>
              <option v-for="p in properties" :key="p.id" :value="p.id">{{ p.title }}</option>
            </select>
          </div>
        </div>

        <!-- Stage selector — radio cards -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Stage <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <label
              v-for="s in STAGES"
              :key="s.key"
              :class="[
                'flex items-center justify-center px-3 py-2 rounded-lg border-2 cursor-pointer',
                'text-xs font-medium transition-all',
                form.stage === s.key
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300',
              ]"
            >
              <input type="radio" :value="s.key" v-model="form.stage" class="sr-only" />
              {{ s.label }}
            </label>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Expected Close Date</label>
          <input
            v-model="form.expected_close_date"
            type="date"
            class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Financials -->
      <div class="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Financials</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Deal Value ($) <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.deal_value"
              type="number"
              min="0"
              step="0.01"
              required
              placeholder="0.00"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p v-if="errors.deal_value" class="text-xs text-red-600 mt-1">{{ errors.deal_value[0] }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Commission Rate (%) <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.commission_rate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              required
              placeholder="3.00"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Auto-calculated display -->
        <div class="bg-green-50 border border-green-200 rounded-lg px-5 py-3 flex justify-between items-center">
          <span class="text-sm font-medium text-green-700">Commission Amount (auto-calculated)</span>
          <span class="text-xl font-bold text-green-700">${{ commissionDisplay }}</span>
        </div>
      </div>

      <!-- Notes -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Notes</h3>
        <textarea
          v-model="form.notes"
          rows="3"
          placeholder="Any additional notes about this deal..."
          class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        ></textarea>
      </div>

      <!-- Lost reason — only relevant once the deal is marked lost -->
      <div v-if="form.stage === 'lost'" class="bg-red-50 border border-red-200 rounded-xl p-6">
        <div class="flex items-start gap-3">
          <svg
            class="w-5 h-5 text-red-500 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"
            />
          </svg>
          <div class="flex-1 min-w-0">
            <label for="lost-reason" class="block text-xs font-semibold text-red-800 uppercase tracking-widest mb-1">
              Reason Lost
            </label>
            <p class="text-xs text-red-600 mb-3">
              Why did this deal fall through? Useful when reviewing lost pipeline later.
            </p>
            <textarea
              id="lost-reason"
              v-model="form.lost_reason"
              rows="3"
              maxlength="1000"
              placeholder="e.g. Buyer financing fell through; seller accepted a higher offer..."
              class="w-full border border-red-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            ></textarea>
            <div class="flex justify-between items-center mt-1.5">
              <p v-if="errors.lost_reason" class="text-xs text-red-600">{{ errors.lost_reason[0] }}</p>
              <span v-else></span>
              <span class="text-xs text-red-400">{{ (form.lost_reason || '').length }}/1000</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="flex items-center gap-4 pb-8">
        <button
          type="submit"
          :disabled="loading"
          class="bg-blue-600 text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {{ loading ? 'Saving...' : isEdit ? 'Update Deal' : 'Create Deal' }}
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
import { useDealStore } from '@/stores/deal'
import api from '@/lib/axios'

const props = defineProps({ id: String })

const router = useRouter()
const route = useRoute()
const store = useDealStore()
const isEdit = computed(() => !!props.id)

// Arriving from a client page (/deals/create?client_id=5) — go back there
// rather than dumping the user on the deals list.
const fromClientId = computed(() => route.query.client_id ?? null)

// An explicit ?back= wins over the client_id inference. Only same-origin
// paths are honoured so the param can't redirect off-site.
const backTo = computed(() => {
  const back = route.query.back
  if (typeof back === 'string' && back.startsWith('/')) return back
  return fromClientId.value ? `/clients/${fromClientId.value}` : '/deals'
})
const loading = ref(false)
const submitError = ref('')
const errors = ref({})
const clients = ref([])
const properties = ref([])

const STAGES = [
  { key: 'lead', label: 'Lead' },
  { key: 'prospect', label: 'Prospect' },
  { key: 'showing', label: 'Showing' },
  { key: 'offer_made', label: 'Offer Made' },
  { key: 'under_contract', label: 'Under Contract' },
  { key: 'closed', label: 'Closed' },
  { key: 'lost', label: 'Lost' },
]

const form = reactive({
  title: '',
  client_id: '',
  property_id: '',
  stage: 'lead',
  deal_value: '',
  commission_rate: '3.00',
  expected_close_date: '',
  notes: '',
  lost_reason: '',
})

const commissionDisplay = computed(() => {
  const v = parseFloat(form.deal_value) || 0
  const r = parseFloat(form.commission_rate) || 0
  return ((v * r) / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

onMounted(async () => {
  const [cr, pr] = await Promise.all([
    api.get('/clients', { params: { per_page: 100 } }),
    api.get('/properties', { params: { per_page: 100 } }),
  ])
  clients.value = cr.data.data
  properties.value = pr.data.data

  // Arrived from a client page — pre-select that client. Set before the edit
  // hydration below so an existing deal's own client always wins.
  if (fromClientId.value) {
    form.client_id = Number(fromClientId.value)
  }

  if (isEdit.value) {
    const d = await store.fetchDeal(props.id)
    Object.assign(form, {
      title: d.title,
      client_id: d.client_id,
      property_id: d.property_id ?? '',
      stage: d.stage,
      deal_value: d.deal_value,
      commission_rate: d.commission_rate,
      expected_close_date: d.expected_close_date ?? '',
      notes: d.notes ?? '',
      lost_reason: d.lost_reason ?? '',
    })
  }
})

async function submit() {
  loading.value = true
  submitError.value = ''
  errors.value = {}

  const payload = { ...form }
  if (!payload.property_id) delete payload.property_id
  if (!payload.expected_close_date) delete payload.expected_close_date
  if (!payload.notes) delete payload.notes
  // Only a lost deal carries a reason; clear any stale one when it moves on.
  if (payload.stage !== 'lost') {
    payload.lost_reason = null
  } else if (!payload.lost_reason) {
    delete payload.lost_reason
  }

  try {
    if (isEdit.value) {
      await store.updateDeal(props.id, payload)
    } else {
      await store.createDeal(payload)
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
