<template>
  <div class="max-w-2xl mx-auto">
    <div class="flex items-center gap-2 mb-6">
      <RouterLink :to="backTo" class="text-gray-400 hover:text-gray-600 text-sm">
        {{ backTo === '/tasks' ? '← Tasks' : '← Back' }}
      </RouterLink>
      <span class="text-gray-300">/</span>
      <span class="text-sm font-semibold text-gray-700">{{ isEdit ? 'Edit Task' : 'New Task' }}</span>
    </div>

    <form @submit.prevent="submit" class="space-y-5">
      <!-- ① Task Details -->
      <div class="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Task Details</h3>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="e.g. Follow up with Johnson family"
            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p v-if="errors.title" class="text-xs text-red-600 mt-1">{{ errors.title[0] }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Additional context or notes..."
            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          ></textarea>
        </div>

        <!-- Due Date + Priority -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Due Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.due_date"
              type="date"
              required
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p v-if="errors.due_date" class="text-xs text-red-600 mt-1">{{ errors.due_date[0] }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <div class="grid grid-cols-4 gap-2">
              <label
                v-for="p in PRIORITIES"
                :key="p.key"
                :class="[
                  'flex items-center justify-center px-3 py-2.5 rounded-xl border-2 cursor-pointer',
                  'text-xs font-semibold transition-all select-none',
                  form.priority === p.key ? p.activeClass : 'border-gray-200 text-gray-500 hover:border-gray-300',
                ]"
              >
                <input type="radio" :value="p.key" v-model="form.priority" class="sr-only" />
                {{ p.label }}
              </label>
            </div>
          </div>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div class="grid grid-cols-4 gap-2">
            <label
              v-for="s in STATUSES"
              :key="s.key"
              :class="[
                'flex flex-col items-center gap-1 px-3 py-3 rounded-xl border-2 cursor-pointer',
                'text-xs font-semibold transition-all select-none',
                form.status === s.key ? s.activeClass : 'border-gray-200 text-gray-500 hover:border-gray-300',
              ]"
            >
              <input type="radio" :value="s.key" v-model="form.status" class="sr-only" />
              <span
                :class="[
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  form.status === s.key ? s.dotActive : 'border-gray-300',
                ]"
              >
                <svg
                  v-if="s.key === 'complete' && form.status === 'complete'"
                  class="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <svg
                  v-else-if="s.key === 'closed' && form.status === 'closed'"
                  class="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              {{ s.label }}
            </label>
          </div>
        </div>
      </div>

      <!-- ② Link To -->
      <div class="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div>
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Link To</h3>
          <p class="text-xs text-gray-400 mt-0.5">Optionally link this task to a deal or client.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Deal</label>
            <select
              v-model="form.deal_id"
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">No deal linked</option>
              <option v-for="d in deals" :key="d.id" :value="d.id">{{ d.title }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Client</label>
            <select
              v-model="form.client_id"
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">No client linked</option>
              <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- ③ Recurrence -->
      <div class="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Recurring Task</h3>
            <p class="text-xs text-gray-400 mt-0.5">Auto-create the next instance when this one is completed.</p>
          </div>
          <!-- Toggle switch -->
          <button
            type="button"
            @click="form.is_recurring = !form.is_recurring"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              form.is_recurring ? 'bg-blue-600' : 'bg-gray-200',
            ]"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                form.is_recurring ? 'translate-x-6' : 'translate-x-1',
              ]"
            ></span>
          </button>
        </div>

        <!-- Recurrence options -->
        <div v-if="form.is_recurring" class="space-y-4 pt-2 border-t border-gray-100">
          <!-- Frequency -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Repeat Every</label>
              <div class="flex gap-2">
                <input
                  v-model.number="form.recurrence_interval"
                  type="number"
                  min="1"
                  max="99"
                  class="w-20 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                />
                <select
                  v-model="form.recurrence_type"
                  class="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Day(s)</option>
                  <option value="weekly">Week(s)</option>
                  <option value="biweekly">2 Weeks</option>
                  <option value="monthly">Month(s)</option>
                  <option value="yearly">Year(s)</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">End Date</label>
              <input
                v-model="form.recurrence_end_date"
                type="date"
                :min="form.due_date"
                placeholder="No end date"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-400 mt-1">Leave blank to repeat indefinitely.</p>
            </div>
          </div>

          <!-- Day picker for weekly -->
          <div v-if="form.recurrence_type === 'weekly'">
            <label class="block text-sm font-medium text-gray-700 mb-2">Repeat On</label>
            <div class="flex gap-2 flex-wrap">
              <label
                v-for="day in DAYS"
                :key="day.value"
                :class="[
                  'flex items-center justify-center w-10 h-10 rounded-xl border-2 cursor-pointer',
                  'text-xs font-bold transition-all select-none',
                  form.recurrence_days?.includes(day.value)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300',
                ]"
              >
                <input
                  type="checkbox"
                  :value="day.value"
                  :checked="form.recurrence_days?.includes(day.value)"
                  @change="toggleDay(day.value)"
                  class="sr-only"
                />
                {{ day.label }}
              </label>
            </div>
          </div>

          <!-- Preview -->
          <div class="bg-blue-50 rounded-xl px-4 py-3 text-sm text-blue-700 font-medium">
            {{ recurrencePreview }}
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="flex items-center gap-4 pb-8">
        <button
          type="submit"
          :disabled="loading"
          class="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm shadow-blue-600/30"
        >
          {{ loading ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task' }}
        </button>
        <RouterLink
          :to="backTo"
          class="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
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
import { useTaskStore } from '@/stores/task'
import api from '@/lib/axios'

const props = defineProps({ id: String })

const router = useRouter()
const route = useRoute()

// ?back=/deals/3 — return to whichever detail page sent us here.
// Only same-origin paths are honoured so the param can't redirect off-site.
const backTo = computed(() => {
  const back = route.query.back
  return typeof back === 'string' && back.startsWith('/') ? back : '/tasks'
})
const store = useTaskStore()
const isEdit = computed(() => !!props.id)
const loading = ref(false)
const submitError = ref('')
const errors = ref({})
const deals = ref([])
const clients = ref([])

const PRIORITIES = [
  { key: 'low', label: 'Low', activeClass: 'border-slate-400 bg-slate-50 text-slate-700' },
  { key: 'medium', label: 'Medium', activeClass: 'border-blue-500 bg-blue-50 text-blue-700' },
  { key: 'high', label: 'High', activeClass: 'border-amber-500 bg-amber-50 text-amber-800' },
  { key: 'urgent', label: 'Urgent', activeClass: 'border-red-500 bg-red-50 text-red-700' },
]

const STATUSES = [
  {
    key: 'incomplete',
    label: 'Incomplete',
    activeClass: 'border-gray-500 bg-gray-50 text-gray-700',
    dotActive: 'border-gray-500 bg-gray-500',
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    activeClass: 'border-amber-500 bg-amber-50 text-amber-700',
    dotActive: 'border-amber-500 bg-amber-500',
  },
  {
    key: 'complete',
    label: 'Complete',
    activeClass: 'border-green-500 bg-green-50 text-green-700',
    dotActive: 'border-green-500 bg-green-500',
  },
  {
    key: 'closed',
    label: 'Closed',
    activeClass: 'border-red-500 bg-red-50 text-red-700',
    dotActive: 'border-red-500 bg-red-500',
  },
]

const DAYS = [
  { label: 'Mo', value: 1 },
  { label: 'Tu', value: 2 },
  { label: 'We', value: 3 },
  { label: 'Th', value: 4 },
  { label: 'Fr', value: 5 },
  { label: 'Sa', value: 6 },
  { label: 'Su', value: 0 },
]

const form = reactive({
  title: '',
  description: '',
  due_date: '',
  priority: 'medium',
  status: 'incomplete',
  deal_id: '',
  client_id: '',
  is_recurring: false,
  recurrence_type: 'weekly',
  recurrence_interval: 1,
  recurrence_days: [],
  recurrence_end_date: '',
})

const recurrencePreview = computed(() => {
  if (!form.is_recurring) return ''
  const n = form.recurrence_interval || 1
  const type = form.recurrence_type
  const map = { daily: 'day', weekly: 'week', biweekly: '2 weeks', monthly: 'month', yearly: 'year' }
  const unit = map[type] ?? type
  const end = form.recurrence_end_date ? ` until ${form.recurrence_end_date}` : ' with no end date'
  if (type === 'biweekly') return `Repeats every 2 weeks${end}`
  return `Repeats every ${n > 1 ? n + ' ' : ''}${unit}${n > 1 && type !== 'biweekly' ? 's' : ''}${end}`
})

function toggleDay(value) {
  if (!form.recurrence_days) form.recurrence_days = []
  const idx = form.recurrence_days.indexOf(value)
  if (idx === -1) form.recurrence_days.push(value)
  else form.recurrence_days.splice(idx, 1)
}

onMounted(async () => {
  const [dr, cr] = await Promise.all([
    api.get('/deals', { params: { per_page: 100 } }),
    api.get('/clients', { params: { per_page: 100 } }),
  ])
  deals.value = dr.data.data
  clients.value = cr.data.data

  if (isEdit.value) {
    const t = await store.fetchTask(props.id)
    Object.assign(form, {
      title: t.title,
      description: t.description ?? '',
      due_date: t.due_date,
      priority: t.priority,
      status: t.status,
      deal_id: t.deal_id ?? '',
      client_id: t.client_id ?? '',
      is_recurring: t.is_recurring,
      recurrence_type: t.recurrence_type ?? 'weekly',
      recurrence_interval: t.recurrence_interval ?? 1,
      recurrence_days: t.recurrence_days ?? [],
      recurrence_end_date: t.recurrence_end_date ?? '',
    })
  }
})

async function submit() {
  loading.value = true
  submitError.value = ''
  errors.value = {}

  const payload = { ...form }
  if (!payload.deal_id) delete payload.deal_id
  if (!payload.client_id) delete payload.client_id
  if (!payload.description) delete payload.description
  if (!payload.recurrence_end_date) delete payload.recurrence_end_date
  if (!payload.is_recurring) {
    delete payload.recurrence_type
    delete payload.recurrence_interval
    delete payload.recurrence_days
    delete payload.recurrence_end_date
  }

  try {
    if (isEdit.value) {
      await store.updateTask(props.id, payload)
    } else {
      await store.createTask(payload)
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
