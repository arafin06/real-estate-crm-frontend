<template>
  <div v-if="!loaded" class="flex items-center justify-center py-20">
    <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>

  <div v-else class="max-w-3xl mx-auto space-y-5">
    <!-- Header -->
    <div class="flex justify-between items-start">
      <div class="flex-1 min-w-0 mr-4">
        <RouterLink to="/tasks" class="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Tasks
        </RouterLink>
        <div class="flex items-start gap-3">
          <!-- Status circle -->
          <button
            @click="handleCycle"
            :class="[
              'w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all',
              task.status === 'complete'
                ? 'bg-green-500 border-green-500'
                : task.status === 'in_progress'
                  ? 'bg-amber-400 border-amber-400'
                  : task.status === 'closed'
                    ? 'bg-red-400 border-red-400'
                    : 'border-gray-300 hover:border-blue-400 bg-white',
            ]"
            :title="nextStatusHint"
          >
            <svg
              v-if="task.status === 'complete'"
              class="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <div v-else-if="task.status === 'in_progress'" class="w-2 h-2 bg-white rounded-full"></div>
            <svg
              v-else-if="task.status === 'closed'"
              class="w-3.5 h-3.5 text-white"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div>
            <h2
              :class="['text-2xl font-bold text-gray-900', !isActive(task.status) && 'line-through text-gray-400']"
            >
              {{ task.title }}
            </h2>
            <div class="flex items-center gap-2 mt-1.5 flex-wrap">
              <span :class="statusBadgeClass(task.status)" class="text-xs font-semibold px-2.5 py-1 rounded-full">
                {{ statusLabel(task.status) }}
              </span>
              <span :class="priorityClass(task.priority)" class="text-xs font-semibold px-2.5 py-1 rounded-full">
                {{ task.priority.charAt(0).toUpperCase() + task.priority.slice(1) }} Priority
              </span>
              <span
                v-if="task.is_recurring"
                class="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Recurring
              </span>
              <span :class="dueChipClass(task)" class="text-xs font-medium px-2.5 py-1 rounded-full">
                {{ dueChipText(task) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <RouterLink
        :to="`/tasks/${task.id}/edit?back=/tasks/${task.id}`"
        class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/25 shrink-0"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
          />
        </svg>
        Edit
      </RouterLink>
    </div>

    <!-- Task Info -->
    <div class="bg-white rounded-2xl shadow-sm p-6">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-5 text-sm mb-4">
        <div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Due Date</p>
          <p class="font-semibold text-gray-800">{{ formatDate(task.due_date) }}</p>
        </div>
        <div v-if="task.deal">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Linked Deal</p>
          <RouterLink :to="`/deals/${task.deal.id}`" class="font-semibold text-blue-600 hover:underline">
            {{ task.deal.title }}
          </RouterLink>
        </div>
        <div v-if="task.client">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Linked Client</p>
          <RouterLink :to="`/clients/${task.client.id}`" class="font-semibold text-purple-600 hover:underline">
            {{ task.client.name }}
          </RouterLink>
        </div>
        <div v-if="task.parent">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Parent Task</p>
          <RouterLink :to="`/tasks/${task.parent.id}`" class="font-semibold text-gray-700 hover:text-blue-600">
            {{ task.parent.title }}
          </RouterLink>
        </div>
      </div>
      <div v-if="task.description" class="pt-4 border-t border-gray-100 text-sm text-gray-600 whitespace-pre-wrap">
        {{ task.description }}
      </div>
    </div>

    <!-- Recurring Info -->
    <div v-if="task.is_recurring" class="bg-blue-50 border border-blue-200 rounded-2xl p-5">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        <div>
          <p class="text-sm font-semibold text-blue-800">Recurring Task</p>
          <p class="text-sm text-blue-600 mt-0.5">{{ recurrenceDescription }}</p>
          <p v-if="task.recurrence_end_date" class="text-xs text-blue-500 mt-1">
            Ends {{ formatDate(task.recurrence_end_date) }}
          </p>
          <p v-if="task.recurring_parent_id" class="text-xs text-blue-500 mt-1">
            Part of a recurring series.
            <RouterLink :to="`/tasks/${task.recurring_parent_id}`" class="underline hover:text-blue-700">
              View original
            </RouterLink>
          </p>
        </div>
      </div>
    </div>

    <!-- Subtasks -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          <h3 class="font-semibold text-gray-800">Subtasks</h3>
          <span class="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
            {{ task.subtasks?.length ?? 0 }}
          </span>
          <span v-if="task.subtasks?.length" class="text-xs text-gray-400">
            ({{ completedSubtasks }}/{{ task.subtasks.length }} done)
          </span>
        </div>
      </div>

      <!-- Progress bar -->
      <div v-if="task.subtasks?.length" class="h-1.5 bg-gray-100">
        <div
          class="h-full bg-green-500 transition-all duration-500 rounded-full"
          :style="{ width: subtaskProgress + '%' }"
        ></div>
      </div>

      <!-- Subtask list -->
      <div v-if="task.subtasks?.length" class="divide-y divide-gray-50">
        <div
          v-for="sub in task.subtasks"
          :key="sub.id"
          class="flex items-center gap-3 px-6 py-3.5 group hover:bg-gray-50 transition-colors"
        >
          <!-- Toggle -->
          <button
            @click="toggleSubtask(sub)"
            :class="[
              'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
              sub.status === 'complete'
                ? 'bg-green-500 border-green-500'
                : sub.status === 'in_progress'
                  ? 'bg-amber-400 border-amber-400'
                  : sub.status === 'closed'
                    ? 'bg-red-400 border-red-400'
                    : 'border-gray-300 hover:border-blue-400 bg-white',
            ]"
          >
            <svg
              v-if="sub.status === 'complete'"
              class="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <div v-else-if="sub.status === 'in_progress'" class="w-1.5 h-1.5 bg-white rounded-full"></div>
            <svg
              v-else-if="sub.status === 'closed'"
              class="w-2.5 h-2.5 text-white"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="flex-1 min-w-0">
            <p :class="['text-sm text-gray-700 font-medium', !isActive(sub.status) && 'line-through text-gray-400']">
              {{ sub.title }}
            </p>
            <div class="flex items-center gap-2 mt-0.5">
              <span :class="priorityClass(sub.priority)" class="text-xs font-medium px-1.5 py-0.5 rounded-full">
                {{ sub.priority }}
              </span>
              <span class="text-xs text-gray-400">{{ formatDate(sub.due_date) }}</span>
            </div>
          </div>
          <button
            @click="removeSubtask(sub.id)"
            class="text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 p-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Add Subtask -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div v-if="!addingSubtask">
          <button
            @click="startAddSubtask"
            class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add subtask
          </button>
        </div>
        <div v-else class="space-y-3">
          <input
            v-model="newSubtask.title"
            type="text"
            placeholder="Subtask title..."
            @keydown.enter.prevent="submitSubtask"
            @keydown.escape="addingSubtask = false"
            class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div class="flex items-center gap-3">
            <input
              v-model="newSubtask.due_date"
              type="date"
              class="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              v-model="newSubtask.priority"
              class="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button
              @click="submitSubtask"
              :disabled="!newSubtask.title || !newSubtask.due_date || savingSubtask"
              class="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {{ savingSubtask ? 'Adding...' : 'Add' }}
            </button>
            <button @click="addingSubtask = false" class="text-sm text-gray-500 hover:text-gray-700 px-2 py-2">
              Cancel
            </button>
          </div>
          <p v-if="subtaskError" class="text-xs text-red-600">{{ subtaskError }}</p>
        </div>
      </div>
    </div>

    <!-- Notes -->
    <div class="bg-white rounded-2xl shadow-sm p-6">
      <div class="flex items-center gap-2 mb-5">
        <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
        <h3 class="font-semibold text-gray-800">Notes</h3>
        <span class="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
          {{ task.notes?.length ?? 0 }}
        </span>
      </div>

      <!-- Add Note -->
      <div class="mb-5">
        <textarea
          v-model="newNote"
          rows="2"
          placeholder="Add a note or update about this task..."
          class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        ></textarea>
        <div class="flex justify-end mt-2">
          <button
            @click="submitNote"
            :disabled="!newNote.trim() || savingNote"
            class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {{ savingNote ? 'Saving...' : 'Add Note' }}
          </button>
        </div>
      </div>

      <!-- Notes empty state -->
      <div v-if="!task.notes?.length" class="text-center py-6 text-gray-400">
        <p class="text-sm">No notes yet.</p>
      </div>

      <!-- Notes timeline -->
      <div v-else class="space-y-1">
        <div v-for="note in task.notes" :key="note.id" class="flex gap-3 group">
          <div class="flex flex-col items-center pt-1">
            <div class="w-2 h-2 rounded-full bg-blue-300 shrink-0"></div>
            <div class="w-px flex-1 bg-gray-100 mt-1"></div>
          </div>
          <div class="flex-1 pb-4">
            <div class="flex justify-between items-center mb-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-gray-700">
                  {{ note.user?.name ?? 'Agent' }}
                </span>
                <span class="text-xs text-gray-400">{{ formatDateTime(note.created_at) }}</span>
              </div>
              <button
                @click="removeNote(note.id)"
                class="text-xs text-red-400 hover:text-red-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Delete
              </button>
            </div>
            <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{{ note.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useTaskStore } from '@/stores/task'

const props = defineProps({ id: String })
const store = useTaskStore()
const task = ref(null)
const loaded = ref(false)

const newNote = ref('')
const savingNote = ref(false)

const addingSubtask = ref(false)
const savingSubtask = ref(false)
const subtaskError = ref('')
const newSubtask = reactive({ title: '', due_date: '', priority: 'medium' })

const completedSubtasks = computed(() => task.value?.subtasks?.filter((s) => s.status === 'complete').length ?? 0)

const subtaskProgress = computed(() => {
  const total = task.value?.subtasks?.length ?? 0
  return total === 0 ? 0 : Math.round((completedSubtasks.value / total) * 100)
})

const nextStatusHint = computed(
  () =>
    ({
      incomplete: 'Mark in progress',
      in_progress: 'Mark complete',
      complete: 'Mark closed',
      closed: 'Reopen task',
    })[task.value?.status] ?? '',
)

const recurrenceDescription = computed(() => {
  const t = task.value
  if (!t?.is_recurring) return ''
  const n = t.recurrence_interval || 1
  const map = { daily: 'day', weekly: 'week', biweekly: '2 weeks', monthly: 'month', yearly: 'year' }
  const unit = map[t.recurrence_type] ?? t.recurrence_type
  if (t.recurrence_type === 'biweekly') return 'Repeats every 2 weeks'
  return `Repeats every ${n > 1 ? n + ' ' : ''}${unit}${n > 1 ? 's' : ''}`
})

onMounted(async () => {
  task.value = await store.fetchTask(props.id)
  loaded.value = true
})

async function reload() {
  task.value = await store.fetchTask(props.id)
}

// ─── Status ──────────────────────────────────────────────────────

async function handleCycle() {
  await store.cycleStatus(task.value)
  await reload()
}

// ─── Subtasks ────────────────────────────────────────────────────

function startAddSubtask() {
  addingSubtask.value = true
  subtaskError.value = ''
  newSubtask.title = ''
  newSubtask.due_date = task.value?.due_date ?? ''
  newSubtask.priority = 'medium'
}

async function submitSubtask() {
  if (!newSubtask.title || !newSubtask.due_date) return
  savingSubtask.value = true
  subtaskError.value = ''
  try {
    await store.createSubtask(task.value.id, {
      title: newSubtask.title,
      due_date: newSubtask.due_date,
      priority: newSubtask.priority,
      status: 'incomplete',
    })
    addingSubtask.value = false
    await reload()
  } catch (e) {
    subtaskError.value = e.response?.data?.message || 'Could not add subtask.'
  } finally {
    savingSubtask.value = false
  }
}

async function toggleSubtask(sub) {
  const next =
    {
      incomplete: 'in_progress',
      in_progress: 'complete',
      complete: 'closed',
      closed: 'incomplete',
    }[sub.status] ?? 'incomplete'

  await store.updateSubtask(sub.id, { status: next })
  await reload()
}

async function removeSubtask(subtaskId) {
  if (!confirm('Delete this subtask?')) return
  await store.deleteSubtask(subtaskId)
  await reload()
}

// ─── Notes ───────────────────────────────────────────────────────

async function submitNote() {
  if (!newNote.value.trim()) return
  savingNote.value = true
  try {
    const note = await store.addNote(task.value.id, newNote.value.trim())
    task.value.notes.unshift(note)
    newNote.value = ''
  } finally {
    savingNote.value = false
  }
}

async function removeNote(noteId) {
  if (!confirm('Delete this note?')) return
  await store.deleteNote(task.value.id, noteId)
  task.value.notes = task.value.notes.filter((n) => n.id !== noteId)
}

// ─── Display helpers ─────────────────────────────────────────────

// incomplete and in_progress are both "still open" for display purposes
function isActive(s) {
  return s === 'incomplete' || s === 'in_progress'
}

function statusLabel(s) {
  return (
    { incomplete: 'Incomplete', in_progress: 'In Progress', complete: 'Complete', closed: 'Closed' }[
      s
    ] ?? s
  )
}

function statusBadgeClass(s) {
  return (
    {
      incomplete: 'bg-gray-100 text-gray-600',
      in_progress: 'bg-amber-100 text-amber-700',
      complete: 'bg-green-100 text-green-700',
      closed: 'bg-red-100 text-red-700',
    }[s] ?? 'bg-gray-100 text-gray-600'
  )
}

function priorityClass(p) {
  return (
    {
      urgent: 'bg-red-100 text-red-700',
      high: 'bg-amber-100 text-amber-800',
      medium: 'bg-blue-50 text-blue-700',
      low: 'bg-slate-100 text-slate-600',
    }[p] ?? 'bg-gray-100 text-gray-600'
  )
}

function dueChipText(t) {
  if (!isActive(t.status)) return statusLabel(t.status)
  const due = new Date(t.due_date)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diff = Math.round((due - now) / 86400000)
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  return `Due in ${diff}d`
}

function dueChipClass(t) {
  if (!isActive(t.status)) return 'bg-gray-100 text-gray-500'
  const due = new Date(t.due_date)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diff = Math.round((due - now) / 86400000)
  if (diff < 0) return 'bg-red-100 text-red-700'
  if (diff === 0) return 'bg-amber-100 text-amber-700'
  if (diff === 1) return 'bg-yellow-100 text-yellow-700'
  return 'bg-gray-100 text-gray-500'
}

function formatDate(s) {
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateTime(s) {
  return new Date(s).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
</script>
