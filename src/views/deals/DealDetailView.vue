<template>
  <div v-if="!loaded" class="flex items-center justify-center py-24">
    <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>

  <div v-else class="space-y-5">
    <!-- ── Stage Progress Bar ────────────────────────── -->
    <div class="bg-white rounded-2xl shadow-sm p-5">
      <div class="flex items-center gap-1 overflow-x-auto pb-1">
        <template v-for="(stage, i) in STAGE_STEPS" :key="stage.key">
          <div class="flex flex-col items-center min-w-0 flex-1">
            <div
              :class="[
                'w-full h-2 rounded-full transition-all duration-500',
                isStageActive(stage.key)
                  ? stage.key === 'lost'
                    ? 'bg-red-400'
                    : 'bg-blue-500'
                  : isStageCompleted(stage.key)
                    ? 'bg-blue-200'
                    : 'bg-gray-100',
              ]"
            ></div>
            <div class="flex items-center gap-1.5 mt-2">
              <div
                :class="[
                  'w-3 h-3 rounded-full border-2 shrink-0 transition-all',
                  deal.stage === stage.key
                    ? stage.key === 'lost'
                      ? 'bg-red-400 border-red-400 scale-125'
                      : 'bg-blue-600 border-blue-600 scale-125'
                    : isStageCompleted(stage.key)
                      ? 'bg-blue-200 border-blue-200'
                      : 'bg-gray-200 border-gray-200',
                ]"
              ></div>
              <span
                :class="[
                  'text-xs font-semibold whitespace-nowrap',
                  deal.stage === stage.key
                    ? stage.key === 'lost'
                      ? 'text-red-600'
                      : 'text-blue-700'
                    : 'text-gray-400',
                ]"
              >
                {{ stage.label }}
              </span>
            </div>
          </div>
          <div v-if="i < STAGE_STEPS.length - 1" class="w-4 h-px bg-gray-200 shrink-0 mb-3"></div>
        </template>
      </div>

      <!-- Update stage -->
      <div class="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
        <Transition name="dd-fade">
          <p v-if="stageFlash" class="text-xs font-semibold text-emerald-600 flex items-center gap-1.5" role="status">
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            Stage updated
          </p>
        </Transition>
        <label for="stage-select" class="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Update Stage
        </label>
        <select
          id="stage-select"
          :value="deal.stage"
          :disabled="stageSaving"
          @change="onStageChange"
          class="border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 bg-white hover:border-gray-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          <option v-for="s in STAGE_STEPS" :key="s.key" :value="s.key">{{ s.label }}</option>
        </select>
      </div>
    </div>

    <!-- ── Hero Header ────────────────────────────────── -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div :class="stageGradient(deal.stage)" class="h-1.5"></div>

      <div class="px-6 py-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div class="min-w-0 flex-1">
          <RouterLink to="/deals" class="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-2">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Deals
          </RouterLink>
          <h1 class="text-2xl font-black text-gray-900">{{ deal.title }}</h1>
          <div class="flex items-center gap-2 mt-2 flex-wrap">
            <span :class="stageClass(deal.stage)" class="text-xs font-bold px-3 py-1.5 rounded-full">
              {{ stageLabel(deal.stage) }}
            </span>
            <span
              v-if="daysUntilClose !== null"
              :class="
                daysUntilClose < 0
                  ? 'bg-red-100 text-red-700'
                  : daysUntilClose <= 7
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-gray-100 text-gray-600'
              "
              class="text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              {{
                daysUntilClose < 0
                  ? `${Math.abs(daysUntilClose)}d past close date`
                  : daysUntilClose === 0
                    ? 'Closes today'
                    : `Closes in ${daysUntilClose}d`
              }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            @click="notesOpen = true"
            class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12" />
            </svg>
            Notes
            <span
              v-if="noteEntries.length"
              class="bg-slate-300 text-slate-700 text-xs font-bold px-1.5 py-0.5 rounded-full leading-none"
            >
              {{ noteEntries.length }}
            </span>
          </button>
          <RouterLink
            :to="`/deals/${deal.id}/edit?back=/deals/${deal.id}`"
            class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm shadow-blue-600/25"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685"
              />
            </svg>
            Edit
          </RouterLink>
        </div>
      </div>

      <!-- Financial summary bar -->
      <div class="grid grid-cols-2 md:grid-cols-4 border-t border-gray-100 divide-x divide-gray-100">
        <div class="px-6 py-4">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Deal Value</p>
          <p class="text-2xl font-black text-gray-900">${{ Number(deal.deal_value).toLocaleString() }}</p>
        </div>
        <div class="px-6 py-4">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Commission ({{ deal.commission_rate }}%)
          </p>
          <p class="text-2xl font-black text-emerald-600">
            ${{ Number(deal.commission_amount).toLocaleString() }}
          </p>
        </div>
        <div class="px-6 py-4">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Expected Close</p>
          <p class="text-lg font-bold text-gray-800">
            {{ deal.expected_close_date ? formatDate(deal.expected_close_date) : '—' }}
          </p>
        </div>
        <div class="px-6 py-4">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Closed At</p>
          <p class="text-lg font-bold" :class="deal.closed_at ? 'text-emerald-600' : 'text-gray-300'">
            {{ deal.closed_at ? formatDate(deal.closed_at) : '—' }}
          </p>
        </div>
      </div>
    </div>

    <!-- ── Main Grid ───────────────────────────────────── -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <!-- ── Left: Details ─────────────────────────────── -->
      <div class="xl:col-span-2 space-y-5">
        <!-- Lost reason -->
        <div v-if="deal.stage === 'lost'" class="bg-red-50 border border-red-200 rounded-2xl p-5">
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
            <div class="min-w-0">
              <p class="text-sm font-bold text-red-800 mb-1">Deal Lost</p>
              <p v-if="deal.lost_reason" class="text-sm text-red-700 whitespace-pre-wrap">{{ deal.lost_reason }}</p>
              <p v-else class="text-sm text-red-600">
                No reason recorded.
                <RouterLink :to="`/deals/${deal.id}/edit?back=/deals/${deal.id}`" class="underline font-medium ml-1">Add one →</RouterLink>
              </p>
            </div>
          </div>
        </div>

        <!-- Deal notes (the text column, not the timeline) -->
        <div v-if="deal.notes" class="bg-white rounded-2xl shadow-sm p-6">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Deal Notes</p>
          <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{{ deal.notes }}</p>
        </div>

        <!-- Linked Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Client -->
          <div class="bg-white rounded-2xl shadow-sm p-5">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Client</p>
            <div class="flex items-start gap-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-700 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
              >
                {{ deal.client?.name?.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <RouterLink
                  :to="`/clients/${deal.client?.id}`"
                  class="font-bold text-gray-800 hover:text-blue-600 transition-colors block truncate"
                >
                  {{ deal.client?.name }}
                </RouterLink>
                <a
                  v-if="deal.client?.email"
                  :href="`mailto:${deal.client.email}`"
                  class="text-xs text-blue-600 hover:underline block mt-0.5 truncate"
                >
                  {{ deal.client.email }}
                </a>
                <a
                  v-for="phone in deal.client?.phones ?? []"
                  :key="phone.id"
                  :href="phone.tel_link"
                  class="text-xs text-gray-400 hover:text-blue-600 block mt-0.5"
                >
                  {{ phone.formatted }}
                  <span class="text-gray-300 capitalize">· {{ phone.type }}</span>
                </a>
              </div>
            </div>
            <RouterLink
              :to="`/clients/${deal.client?.id}`"
              class="mt-3 flex items-center justify-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-800 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              View Client Profile →
            </RouterLink>
          </div>

          <!-- Property -->
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div v-if="deal.property">
              <div v-if="deal.property.primary_image" class="relative">
                <img
                  :src="deal.property.primary_image.url"
                  class="w-full h-28 object-cover"
                  :alt="deal.property.title"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <span class="absolute bottom-2 left-3 text-white text-xs font-bold">
                  ${{ Number(deal.property.price).toLocaleString() }}
                </span>
              </div>
              <div class="p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Property</p>
                <RouterLink
                  :to="`/properties/${deal.property.id}`"
                  class="font-bold text-gray-800 hover:text-blue-600 transition-colors text-sm block truncate"
                >
                  {{ deal.property.title }}
                </RouterLink>
                <p class="text-xs text-gray-400 mt-0.5">{{ deal.property.city }}, {{ deal.property.state }}</p>
                <RouterLink
                  :to="`/properties/${deal.property.id}`"
                  class="mt-3 flex items-center justify-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-800 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                >
                  View Listing →
                </RouterLink>
              </div>
            </div>
            <div v-else class="p-5 flex flex-col items-center justify-center py-10">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Property</p>
              <p class="text-sm text-gray-400 text-center">No property linked to this deal.</p>
              <RouterLink
                :to="`/deals/${deal.id}/edit?back=/deals/${deal.id}`"
                class="mt-3 text-xs text-blue-600 font-semibold hover:underline"
              >
                Link a property →
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Tasks -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <svg
                class="w-5 h-5 text-amber-500"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 class="font-bold text-gray-800 text-sm">Linked Tasks</h3>
              <span
                v-if="deal.tasks?.length"
                class="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full"
              >
                {{ deal.tasks.length }}
              </span>
            </div>
            <button
              type="button"
              @click="taskCreateOpen = true"
              class="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              + New Task
            </button>
          </div>

          <div v-if="!deal.tasks?.length" class="flex flex-col items-center justify-center py-10 text-gray-400">
            <p class="text-sm">No tasks linked to this deal.</p>
          </div>

          <div v-else class="divide-y divide-gray-50">
            <div
              v-for="task in deal.tasks"
              :key="task.id"
              class="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 transition-colors"
            >
              <div
                :class="[
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                  task.status === 'complete'
                    ? 'bg-green-500 border-green-500'
                    : task.status === 'in_progress'
                      ? 'bg-amber-400 border-amber-400'
                      : task.status === 'closed'
                        ? 'bg-red-400 border-red-400'
                        : 'border-gray-300',
                ]"
              >
                <svg
                  v-if="task.status === 'complete'"
                  class="w-2.5 h-2.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p
                  :class="[
                    'text-sm font-semibold truncate',
                    task.status !== 'incomplete' && task.status !== 'in_progress'
                      ? 'text-gray-400 line-through'
                      : 'text-gray-700',
                  ]"
                >
                  {{ task.title }}
                </p>
                <div class="flex items-center gap-2 mt-0.5">
                  <span
                    :class="priorityClass(task.priority)"
                    class="text-xs font-semibold px-1.5 py-0.5 rounded-full capitalize"
                  >
                    {{ task.priority }}
                  </span>
                  <span class="text-xs text-gray-400">{{ formatDate(task.due_date) }}</span>
                </div>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  @click="openTaskModal(task.id)"
                  class="text-xs text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  View
                </button>
                <RouterLink
                  :to="`/tasks/${task.id}/edit?back=/deals/${deal.id}`"
                  class="text-xs text-gray-500 hover:text-blue-600 font-semibold bg-gray-100 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  Edit
                </RouterLink>
                <button
                  type="button"
                  @click="confirmDeleteTask(task.id)"
                  class="text-xs text-gray-500 hover:text-red-600 font-semibold bg-gray-100 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Right: Info + Activity ─────────────────────── -->
      <div class="xl:col-span-1 space-y-5">
        <div class="bg-white rounded-2xl shadow-sm p-5">
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Deal Info</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between gap-3">
              <span class="text-gray-400">Created</span>
              <span class="font-medium text-gray-700">{{ formatDate(deal.created_at) }}</span>
            </div>
            <div class="flex justify-between gap-3 items-center">
              <span class="text-gray-400">Stage</span>
              <span :class="stageClass(deal.stage)" class="text-xs font-bold px-2 py-0.5 rounded-full">
                {{ stageLabel(deal.stage) }}
              </span>
            </div>
            <div class="flex justify-between gap-3">
              <span class="text-gray-400">Commission Rate</span>
              <span class="font-bold text-gray-700">{{ deal.commission_rate }}%</span>
            </div>
            <div class="flex justify-between gap-3">
              <span class="text-gray-400">Activities</span>
              <span class="font-bold text-blue-600">{{ deal.activities?.length ?? 0 }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-5">
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Activity Log</h3>

          <div v-if="!deal.activities?.length" class="text-center py-8 text-gray-400 text-sm">No activity yet.</div>

          <div v-else class="space-y-1 max-h-96 overflow-y-auto">
            <div v-for="(act, i) in deal.activities" :key="act.id" class="flex gap-3">
              <div class="flex flex-col items-center pt-1">
                <div
                  :class="[
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0',
                    activityStyle(act.action).ring,
                  ]"
                >
                  <div :class="['w-2 h-2 rounded-full', activityStyle(act.action).dot]"></div>
                </div>
                <div v-if="i < deal.activities.length - 1" class="w-px flex-1 bg-gray-100 mt-1"></div>
              </div>
              <div class="flex-1 pb-4 min-w-0">
                <p class="text-xs font-semibold text-gray-700 leading-snug">{{ act.description }}</p>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="text-xs text-gray-400">{{ act.user?.name ?? 'System' }}</span>
                  <span class="text-gray-300">·</span>
                  <span class="text-xs text-gray-400">{{ timeAgo(act.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Task Modal -->
  <TaskModal :show="taskModalShow" :task-id="taskModalId" @close="closeTaskModal" @updated="reloadDeal" />

  <!-- Quick task creation -->
  <TaskCreateModal
    v-if="deal"
    :show="taskCreateOpen"
    :deal-id="deal.id"
    @close="taskCreateOpen = false"
    @created="reloadDeal"
  />

  <!-- Notes Slide Over -->
  <NoteSlideOver
    v-if="deal"
    :show="notesOpen"
    :title="deal.title"
    :api-base-path="`/deals/${deal.id}`"
    :initial-notes="noteEntries"
    @close="notesOpen = false"
    @note-added="onNoteAdded"
    @note-deleted="onNoteDeleted"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDealStore } from '@/stores/deal'
import { useTaskStore } from '@/stores/task'
import TaskModal from '@/components/TaskModal.vue'
import TaskCreateModal from '@/components/TaskCreateModal.vue'
import NoteSlideOver from '@/components/NoteSlideOver.vue'

const props = defineProps({ id: String })
const store = useDealStore()
const taskStore = useTaskStore()
const deal = ref(null)
const loaded = ref(false)

const notesOpen = ref(false)
const taskModalShow = ref(false)
const taskModalId = ref(null)
const taskCreateOpen = ref(false)
const stageSaving = ref(false)
const stageFlash = ref(false)
let stageFlashTimer = null

const STAGE_STEPS = [
  { key: 'lead', label: 'Lead' },
  { key: 'prospect', label: 'Prospect' },
  { key: 'showing', label: 'Showing' },
  { key: 'offer_made', label: 'Offer Made' },
  { key: 'under_contract', label: 'Under Contract' },
  { key: 'closed', label: 'Closed' },
  { key: 'lost', label: 'Lost' },
]

const stageOrder = STAGE_STEPS.map((s) => s.key)

// `notes` is the deal's own text column; the timeline lives in note_entries.
const noteEntries = computed(() => deal.value?.note_entries ?? [])

const daysUntilClose = computed(() => {
  if (!deal.value?.expected_close_date) return null
  const due = new Date(deal.value.expected_close_date)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.round((due - now) / 86400000)
})

onMounted(async () => {
  deal.value = await store.fetchDeal(props.id)
  loaded.value = true
})

onUnmounted(() => clearTimeout(stageFlashTimer))

async function reloadDeal() {
  deal.value = await store.fetchDeal(props.id)
}

function openTaskModal(id) {
  taskModalId.value = id
  taskModalShow.value = true
}

function closeTaskModal() {
  taskModalShow.value = false
  taskModalId.value = null
}

async function onStageChange(e) {
  const next = e.target.value
  if (!next || next === deal.value.stage) return

  stageSaving.value = true
  try {
    await store.updateStage(deal.value.id, next)
    await reloadDeal()
    stageFlash.value = true
    clearTimeout(stageFlashTimer)
    stageFlashTimer = setTimeout(() => {
      stageFlash.value = false
    }, 2500)
  } catch {
    // Put the select back to whatever the server still has.
    e.target.value = deal.value.stage
  } finally {
    stageSaving.value = false
  }
}

async function confirmDeleteTask(taskId) {
  if (!confirm('Delete this task?')) return
  await taskStore.deleteTask(taskId)
  await reloadDeal()
}

function onNoteAdded(note) {
  deal.value.note_entries = [note, ...(deal.value.note_entries ?? [])]
}

function onNoteDeleted(noteId) {
  deal.value.note_entries = (deal.value.note_entries ?? []).filter((n) => n.id !== noteId)
}

function isStageActive(stageKey) {
  return deal.value?.stage === stageKey
}

function isStageCompleted(stageKey) {
  const currentIdx = stageOrder.indexOf(deal.value?.stage)
  const checkIdx = stageOrder.indexOf(stageKey)
  if (deal.value?.stage === 'lost') return false
  return checkIdx < currentIdx
}

// ─── Display helpers ─────────────────────────────────────────────
const STAGE_MAP = {
  lead: { label: 'Lead', cls: 'bg-gray-100 text-gray-600', gradient: 'bg-gray-400' },
  prospect: {
    label: 'Prospect',
    cls: 'bg-blue-100 text-blue-700',
    gradient: 'bg-gradient-to-r from-blue-400 to-blue-600',
  },
  showing: {
    label: 'Showing',
    cls: 'bg-indigo-100 text-indigo-700',
    gradient: 'bg-gradient-to-r from-indigo-400 to-indigo-600',
  },
  offer_made: {
    label: 'Offer Made',
    cls: 'bg-yellow-100 text-yellow-700',
    gradient: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
  },
  under_contract: {
    label: 'Under Contract',
    cls: 'bg-orange-100 text-orange-700',
    gradient: 'bg-gradient-to-r from-orange-400 to-orange-600',
  },
  closed: {
    label: 'Closed',
    cls: 'bg-green-100 text-green-700',
    gradient: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
  },
  lost: {
    label: 'Lost',
    cls: 'bg-red-100 text-red-700',
    gradient: 'bg-gradient-to-r from-red-400 to-red-600',
  },
}

function stageLabel(s) {
  return STAGE_MAP[s]?.label ?? s
}

function stageClass(s) {
  return STAGE_MAP[s]?.cls ?? 'bg-gray-100 text-gray-600'
}

function stageGradient(s) {
  return STAGE_MAP[s]?.gradient ?? 'bg-gray-400'
}

function activityStyle(action) {
  return (
    {
      created: { ring: 'border-blue-200', dot: 'bg-blue-400' },
      stage_changed: { ring: 'border-amber-200', dot: 'bg-amber-400' },
      note_added: { ring: 'border-purple-200', dot: 'bg-purple-400' },
    }[action] ?? { ring: 'border-gray-200', dot: 'bg-gray-400' }
  )
}

function priorityClass(p) {
  return (
    {
      urgent: 'bg-rose-100 text-rose-700',
      high: 'bg-amber-100 text-amber-800',
      medium: 'bg-blue-50 text-blue-700',
      low: 'bg-slate-100 text-slate-600',
    }[p] ?? 'bg-gray-100 text-gray-500'
  )
}

function formatDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function timeAgo(s) {
  const diff = Date.now() - new Date(s).getTime()
  const mins = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(s)
}
</script>

<style scoped>
.dd-fade-enter-active,
.dd-fade-leave-active {
  transition: opacity 0.2s ease;
}
.dd-fade-enter-from,
.dd-fade-leave-to {
  opacity: 0;
}
</style>
