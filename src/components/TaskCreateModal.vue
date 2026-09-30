<template>
  <Transition name="tc-fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <Transition name="tc-pop" appear>
        <div
          v-if="show"
          role="dialog"
          aria-modal="true"
          aria-labelledby="task-create-title"
          class="w-full max-w-lg bg-white rounded-2xl shadow-xl shadow-slate-900/10 overflow-hidden flex flex-col"
        >
          <!-- Header (fixed) -->
          <div class="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between gap-3 shrink-0">
            <div>
              <h2 id="task-create-title" class="text-base font-bold text-gray-900">New Task</h2>
              <p class="text-xs text-gray-400 mt-0.5">{{ contextLabel }}</p>
            </div>
            <button
              type="button"
              @click="$emit('close')"
              aria-label="Close"
              class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body (scrolls) -->
          <form class="overflow-y-auto max-h-[85vh] px-6 py-5 space-y-4" @submit.prevent="submit">
            <!-- Title -->
            <div>
              <label for="tc-title" class="block text-sm font-medium text-gray-700 mb-1.5">
                Title <span class="text-red-500">*</span>
              </label>
              <input
                id="tc-title"
                ref="titleInput"
                v-model="form.title"
                type="text"
                required
                placeholder="e.g. Call client about inspection"
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p v-if="errors.title" class="text-xs text-red-600 mt-1">{{ errors.title[0] }}</p>
            </div>

            <!-- Due date -->
            <div>
              <label for="tc-due" class="block text-sm font-medium text-gray-700 mb-1.5">
                Due Date <span class="text-red-500">*</span>
              </label>
              <input
                id="tc-due"
                v-model="form.due_date"
                type="date"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p v-if="errors.due_date" class="text-xs text-red-600 mt-1">{{ errors.due_date[0] }}</p>
            </div>

            <!-- Priority -->
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
                  <input type="radio" name="tc-priority" :value="p.key" v-model="form.priority" class="sr-only" />
                  {{ p.label }}
                </label>
              </div>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div class="grid grid-cols-2 gap-2">
                <label
                  v-for="s in STATUSES"
                  :key="s.key"
                  :class="[
                    'flex items-center justify-center px-3 py-2.5 rounded-xl border-2 cursor-pointer',
                    'text-xs font-semibold transition-all select-none',
                    form.status === s.key ? s.activeClass : 'border-gray-200 text-gray-500 hover:border-gray-300',
                  ]"
                >
                  <input type="radio" name="tc-status" :value="s.key" v-model="form.status" class="sr-only" />
                  {{ s.label }}
                </label>
              </div>
            </div>

            <!-- Recurrence -->
            <div class="bg-gray-50 rounded-xl p-4 space-y-4">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Recurring Task</h3>
                  <p class="text-xs text-gray-400 mt-0.5">
                    Auto-create the next instance when this one is completed.
                  </p>
                </div>
                <!-- Toggle switch -->
                <button
                  type="button"
                  role="switch"
                  :aria-checked="form.is_recurring"
                  aria-label="Recurring task"
                  @click="form.is_recurring = !form.is_recurring"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
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
              <div v-if="form.is_recurring" class="space-y-4 pt-2 border-t border-gray-200">
                <!-- Frequency -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="tc-interval" class="block text-sm font-medium text-gray-700 mb-1.5">
                      Repeat Every
                    </label>
                    <div class="flex gap-2">
                      <input
                        id="tc-interval"
                        v-model.number="form.recurrence_interval"
                        type="number"
                        min="1"
                        max="99"
                        class="w-20 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                      />
                      <select
                        v-model="form.recurrence_type"
                        aria-label="Frequency"
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
                    <label for="tc-end" class="block text-sm font-medium text-gray-700 mb-1.5">End Date</label>
                    <input
                      id="tc-end"
                      v-model="form.recurrence_end_date"
                      type="date"
                      :min="form.due_date"
                      placeholder="No end date"
                      class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p class="text-xs text-gray-400 mt-1">Leave blank to repeat indefinitely.</p>
                    <p v-if="errors.recurrence_end_date" class="text-xs text-red-600 mt-1">
                      {{ errors.recurrence_end_date[0] }}
                    </p>
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
                          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300',
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

            <!-- Link To -->
            <div class="bg-gray-50 rounded-xl p-4 space-y-4">
              <div>
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Link To</h3>
                <p class="text-xs text-gray-400 mt-0.5">Attach this task to a client and / or a deal.</p>
              </div>

              <!-- Client -->
              <div>
                <label
                  :for="clientLocked ? undefined : 'tc-client'"
                  class="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Client
                </label>

                <!-- Locked: set by the page that opened the modal -->
                <div
                  v-if="clientLocked"
                  class="flex items-center justify-between gap-2 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-100 text-gray-600"
                >
                  <span class="truncate font-medium">{{ lockedClientLabel }}</span>
                  <svg
                    class="w-4 h-4 text-gray-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>

                <select
                  v-else
                  id="tc-client"
                  v-model="form.client_id"
                  class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No client</option>
                  <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
              </div>

              <!-- Deal -->
              <div>
                <label :for="dealLocked ? undefined : 'tc-deal'" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Deal
                </label>

                <div
                  v-if="dealLocked"
                  class="flex items-center justify-between gap-2 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-100 text-gray-600"
                >
                  <span class="truncate font-medium">{{ lockedDealLabel }}</span>
                  <svg
                    class="w-4 h-4 text-gray-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>

                <select
                  v-else
                  id="tc-deal"
                  v-model="form.deal_id"
                  class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No deal</option>
                  <option v-for="d in deals" :key="d.id" :value="d.id">{{ d.title }}</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label for="tc-desc" class="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                id="tc-desc"
                v-model="form.description"
                rows="3"
                placeholder="Optional details..."
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>

            <p v-if="submitError" class="text-sm text-red-600">{{ submitError }}</p>
          </form>

          <!-- Footer (fixed) -->
          <div class="px-6 py-4 border-t border-gray-100 flex items-center gap-3 shrink-0 bg-white">
            <button
              type="button"
              @click="submit"
              :disabled="loading || !form.title.trim() || !form.due_date"
              class="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {{ loading ? 'Creating...' : 'Create Task' }}
            </button>
            <button
              type="button"
              @click="$emit('close')"
              class="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useTaskStore } from '@/stores/task'
import api from '@/lib/axios'

const props = defineProps({
  show: { type: Boolean, default: false },
  clientId: { type: [String, Number], default: null },
  dealId: { type: [String, Number], default: null },
})

const emit = defineEmits(['close', 'created'])

const store = useTaskStore()

const loading = ref(false)
const submitError = ref('')
const errors = ref({})
const titleInput = ref(null)

const clients = ref([])
const deals = ref([])
const optionsLoaded = ref(false)

const PRIORITIES = [
  { key: 'urgent', label: 'Urgent', activeClass: 'border-rose-600 bg-rose-50 text-rose-700' },
  { key: 'high', label: 'High', activeClass: 'border-amber-500 bg-amber-50 text-amber-800' },
  { key: 'medium', label: 'Medium', activeClass: 'border-blue-500 bg-blue-50 text-blue-700' },
  { key: 'low', label: 'Low', activeClass: 'border-slate-400 bg-slate-50 text-slate-700' },
]

const STATUSES = [
  { key: 'incomplete', label: 'Incomplete', activeClass: 'border-slate-400 bg-slate-50 text-slate-700' },
  { key: 'in_progress', label: 'In Progress', activeClass: 'border-amber-500 bg-amber-50 text-amber-800' },
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

const clientLocked = computed(() => props.clientId !== null && props.clientId !== '')
const dealLocked = computed(() => props.dealId !== null && props.dealId !== '')

const lockedClientLabel = computed(() => {
  const match = clients.value.find((c) => String(c.id) === String(props.clientId))
  return match?.name ?? `Client #${props.clientId}`
})

const lockedDealLabel = computed(() => {
  const match = deals.value.find((d) => String(d.id) === String(props.dealId))
  return match?.title ?? `Deal #${props.dealId}`
})

const contextLabel = computed(() => {
  if (dealLocked.value) return 'Will be linked to this deal'
  if (clientLocked.value) return 'Will be linked to this client'
  return 'Quick task'
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

function reset() {
  form.title = ''
  form.description = ''
  form.due_date = new Date().toISOString().slice(0, 10)
  form.priority = 'medium'
  form.status = 'incomplete'
  form.deal_id = dealLocked.value ? props.dealId : ''
  form.client_id = clientLocked.value ? props.clientId : ''
  form.is_recurring = false
  form.recurrence_type = 'weekly'
  form.recurrence_interval = 1
  form.recurrence_days = []
  form.recurrence_end_date = ''
  errors.value = {}
  submitError.value = ''
  loading.value = false
}

// Only fetch the lists actually needed — a locked side needs just the label,
// which the dropdown data also supplies, so fetch it once either way.
async function loadOptions() {
  if (optionsLoaded.value) return
  try {
    const [cr, dr] = await Promise.all([
      api.get('/clients', { params: { per_page: 100 } }),
      api.get('/deals', { params: { per_page: 100 } }),
    ])
    clients.value = cr.data.data ?? []
    deals.value = dr.data.data ?? []
    optionsLoaded.value = true
  } catch {
    // Non-fatal: the locked fields fall back to "#id" and the dropdowns stay empty.
  }
}

watch(
  () => props.show,
  async (open) => {
    if (!open) return
    reset()
    loadOptions()
    await nextTick()
    titleInput.value?.focus()
  },
  { immediate: true },
)

function onKeydown(e) {
  if (e.key === 'Escape' && props.show) emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

async function submit() {
  if (!form.title.trim() || !form.due_date) return

  loading.value = true
  submitError.value = ''
  errors.value = {}

  const payload = { ...form }
  payload.title = payload.title.trim()

  // A locked prop always wins over whatever is in the form.
  if (clientLocked.value) payload.client_id = props.clientId
  if (dealLocked.value) payload.deal_id = props.dealId

  if (!payload.deal_id) delete payload.deal_id
  if (!payload.client_id) delete payload.client_id
  if (!payload.description?.trim()) delete payload.description
  else payload.description = payload.description.trim()
  if (!payload.recurrence_end_date) delete payload.recurrence_end_date
  if (!payload.is_recurring) {
    delete payload.recurrence_type
    delete payload.recurrence_interval
    delete payload.recurrence_days
    delete payload.recurrence_end_date
  } else if (payload.recurrence_type !== 'weekly') {
    // Day selection only means anything for a weekly cadence.
    delete payload.recurrence_days
  }

  try {
    const task = await store.createTask(payload)
    emit('created', task)
    emit('close')
  } catch (e) {
    if (e.response?.status === 422) errors.value = e.response.data.errors ?? {}
    submitError.value = e.response?.data?.message || 'Could not create the task.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.tc-fade-enter-active,
.tc-fade-leave-active {
  transition: opacity 0.2s ease;
}
.tc-fade-enter-from,
.tc-fade-leave-to {
  opacity: 0;
}

.tc-pop-enter-active {
  transition:
    transform 0.22s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.22s ease;
}
.tc-pop-enter-from {
  transform: translateY(8px) scale(0.98);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .tc-fade-enter-active,
  .tc-fade-leave-active,
  .tc-pop-enter-active {
    transition: none;
  }
}
</style>
