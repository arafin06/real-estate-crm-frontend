<template>
  <div class="space-y-5">
    <!-- Top Bar -->
    <div class="flex flex-wrap items-center gap-3">
      <!-- Search -->
      <div class="relative flex-1 min-w-64">
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z"
          />
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Search tasks..."
          class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Priority filter -->
      <select
        v-model="priorityFilter"
        class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-40"
      >
        <option value="">All Priorities</option>
        <option value="high">High Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="low">Low Priority</option>
      </select>

      <!-- Add Task -->
      <RouterLink
        to="/tasks/create"
        class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/25 shrink-0"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Task
      </RouterLink>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-white rounded-xl p-4 border-l-4 border-red-500 shadow-sm">
        <p class="text-2xl font-bold text-red-600">{{ store.summary.overdue ?? 0 }}</p>
        <p class="text-xs font-semibold text-red-400 mt-0.5 uppercase tracking-wide">Overdue</p>
      </div>
      <div class="bg-white rounded-xl p-4 border-l-4 border-amber-500 shadow-sm">
        <p class="text-2xl font-bold text-amber-600">{{ store.summary.today ?? 0 }}</p>
        <p class="text-xs font-semibold text-amber-400 mt-0.5 uppercase tracking-wide">Due Today</p>
      </div>
      <div class="bg-white rounded-xl p-4 border-l-4 border-blue-500 shadow-sm">
        <p class="text-2xl font-bold text-blue-600">{{ store.summary.upcoming ?? 0 }}</p>
        <p class="text-xs font-semibold text-blue-400 mt-0.5 uppercase tracking-wide">Upcoming</p>
      </div>
      <div class="bg-white rounded-xl p-4 border-l-4 border-slate-400 shadow-sm">
        <p class="text-2xl font-bold text-slate-700">{{ store.summary.total ?? 0 }}</p>
        <p class="text-xs font-semibold text-slate-400 mt-0.5 uppercase tracking-wide">Total</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Sections -->
    <template v-else>
      <div v-for="section in SECTIONS" :key="section.key">
        <!-- Skip empty sections (after filtering) unless always-show -->
        <div v-if="filtered[section.key]?.length > 0 || section.alwaysShow">
          <!-- Section Card -->
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
            <!-- Section Header -->
            <button
              @click="toggleSection(section.key)"
              :class="[section.headerBg, section.headerBorder]"
              class="w-full flex items-center justify-between px-5 py-3.5 border-b transition-colors hover:brightness-95"
            >
              <div class="flex items-center gap-3">
                <!-- Colored dot -->
                <div :class="section.dotColor" class="w-3 h-3 rounded-full shadow-sm"></div>
                <span :class="section.titleColor" class="text-sm font-bold uppercase tracking-wide">
                  {{ section.label }}
                </span>
                <span
                  v-if="filtered[section.key]?.length"
                  :class="section.countBadge"
                  class="text-xs font-bold px-2 py-0.5 rounded-full leading-none"
                >
                  {{ filtered[section.key].length }}
                </span>
              </div>

              <!-- Collapse toggle -->
              <svg
                :class="[
                  'w-4 h-4 transition-transform duration-200',
                  section.titleColor,
                  collapsed[section.key] ? '' : 'rotate-180',
                ]"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            <!-- Task List -->
            <div v-show="!collapsed[section.key]">
              <!-- Empty state (filtered to zero) -->
              <div v-if="!filtered[section.key]?.length" class="flex items-center justify-center py-8 text-gray-400">
                <p class="text-sm">{{ section.emptyText }}</p>
              </div>

              <!-- Tasks -->
              <div v-else class="divide-y divide-gray-50">
                <div
                  v-for="task in filtered[section.key]"
                  :key="task.id"
                  :class="[
                    'flex items-start gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors',
                    'border-l-4',
                    task.status === 'complete' || task.status === 'closed'
                      ? 'border-green-300'
                      : task.status === 'in_progress'
                        ? 'border-amber-400'
                        : priorityBorder(task.priority),
                  ]"
                >
                  <!-- Status Toggle -->
                  <button
                    @click="handleToggle(task)"
                    :class="[
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all',
                      task.status === 'complete'
                        ? 'bg-green-500 border-green-500 hover:bg-green-600'
                        : task.status === 'in_progress'
                          ? 'bg-amber-400 border-amber-400 hover:bg-amber-500'
                          : task.status === 'closed'
                            ? 'bg-red-400 border-red-400 hover:bg-red-500'
                            : 'border-gray-300 hover:border-blue-400 bg-white',
                    ]"
                    :title="nextStatusLabel(task.status)"
                  >
                    <svg
                      v-if="task.status === 'complete'"
                      class="w-3.5 h-3.5 text-white"
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
                      class="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <!-- Title row -->
                    <div class="flex items-start justify-between gap-3">
                      <RouterLink
                        :to="`/tasks/${task.id}`"
                        :class="[
                          'text-sm font-semibold leading-snug',
                          task.status !== 'incomplete' && task.status !== 'in_progress'
                            ? 'line-through text-gray-400'
                            : 'text-gray-800 hover:text-blue-600',
                        ]"
                      >
                        {{ task.title }}
                      </RouterLink>

                      <!-- Actions -->
                      <div class="flex items-center gap-1.5 shrink-0">
                        <button
                          @click="openModal(task.id)"
                          class="text-xs text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          View
                        </button>
                        <RouterLink
                          :to="`/tasks/${task.id}/edit`"
                          class="text-xs text-gray-500 hover:text-blue-600 font-semibold bg-gray-100 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
                        </RouterLink>
                        <button
                          @click="confirmDelete(task)"
                          class="text-xs text-gray-500 hover:text-red-600 font-semibold bg-gray-100 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <!-- Description -->
                    <p v-if="task.description" class="text-xs text-gray-400 mt-0.5 truncate max-w-xl">
                      {{ task.description }}
                    </p>

                    <!-- Tags + meta info row -->
                    <div class="flex items-center justify-between mt-2 gap-4">
                      <!-- Left: tags -->
                      <div class="flex flex-wrap items-center gap-1.5 min-w-0">
                        <span
                          :class="priorityClass(task.priority)"
                          class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                        >
                          <span
                            class="w-1.5 h-1.5 rounded-full"
                            :class="{
                              'bg-red-500': task.priority === 'urgent',
                              'bg-amber-500': task.priority === 'high',
                              'bg-blue-500': task.priority === 'medium',
                              'bg-slate-400': task.priority === 'low',
                            }"
                          ></span>
                          {{ task.priority.charAt(0).toUpperCase() + task.priority.slice(1) }}
                        </span>

                        <span
                          :class="dueChipClass(task)"
                          class="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5"
                            />
                          </svg>
                          {{ dueChipText(task) }}
                        </span>

                        <span
                          :class="statusClass(task.status)"
                          class="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                        >
                          {{ statusLabel(task.status) }}
                        </span>

                        <RouterLink
                          v-if="task.deal"
                          :to="`/deals/${task.deal.id}`"
                          class="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-2 py-0.5 rounded-full transition-colors shrink-0"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25"
                            />
                          </svg>
                          {{ task.deal.title }}
                        </RouterLink>

                        <RouterLink
                          v-if="task.client"
                          :to="`/clients/${task.client.id}`"
                          class="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium bg-purple-50 px-2 py-0.5 rounded-full transition-colors shrink-0"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"
                            />
                          </svg>
                          {{ task.client.name }}
                        </RouterLink>
                      </div>

                      <!-- Right: meta info -->
                      <div class="flex items-center gap-3 shrink-0 text-xs text-gray-400">
                        <!-- Notes count -->
                        <span
                          v-if="task.notes_count > 0"
                          class="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                            />
                          </svg>
                          {{ task.notes_count }} note{{ task.notes_count !== 1 ? 's' : '' }}
                        </span>

                        <!-- Subtask count -->
                        <span
                          v-if="task.subtasks_count > 0"
                          class="inline-flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-lg"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75z"
                            />
                          </svg>
                          {{ task.subtasks_count }} subtask{{ task.subtasks_count !== 1 ? 's' : '' }}
                        </span>

                        <!-- Recurring badge -->
                        <span
                          v-if="task.is_recurring"
                          class="inline-flex items-center gap-1 bg-blue-50 text-blue-600 font-semibold px-2 py-1 rounded-lg"
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- All clear state -->
      <div
        v-if="totalVisible === 0 && !store.loading"
        class="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200"
      >
        <svg class="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-gray-600 font-semibold text-lg">All caught up!</p>
        <p class="text-gray-400 text-sm mt-1">No tasks match your current filters.</p>
        <RouterLink
          to="/tasks/create"
          class="inline-flex items-center gap-2 mt-4 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Create a task
        </RouterLink>
      </div>
    </template>

    <!-- Task Modal -->
    <TaskModal :show="modalShow" :task-id="modalTaskId" @close="closeModal" @updated="onModalUpdated" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '@/stores/task'
import TaskModal from '@/components/TaskModal.vue'

const store = useTaskStore()

const search = ref('')
const priorityFilter = ref('')
const collapsed = ref({})

const modalShow = ref(false)
const modalTaskId = ref(null)

function openModal(id) {
  modalTaskId.value = id
  modalShow.value = true
}

function closeModal() {
  modalShow.value = false
  modalTaskId.value = null
}

async function onModalUpdated() {
  await Promise.all([store.fetchGrouped(), store.fetchSummary()])
}

const SECTIONS = [
  {
    key: 'overdue',
    label: 'Overdue',
    alwaysShow: false,
    startOpen: true,
    dotColor: 'bg-red-500',
    headerBg: 'bg-red-50',
    headerBorder: 'border-red-100',
    titleColor: 'text-red-700',
    countBadge: 'bg-red-500 text-white',
    emptyText: 'No overdue tasks',
  },
  {
    key: 'today',
    label: 'Due Today',
    alwaysShow: false,
    startOpen: true,
    dotColor: 'bg-amber-500',
    headerBg: 'bg-amber-50',
    headerBorder: 'border-amber-100',
    titleColor: 'text-amber-700',
    countBadge: 'bg-amber-500 text-white',
    emptyText: 'Nothing due today',
  },
  {
    key: 'tomorrow',
    label: 'Tomorrow',
    alwaysShow: false,
    startOpen: true,
    dotColor: 'bg-yellow-500',
    headerBg: 'bg-yellow-50',
    headerBorder: 'border-yellow-100',
    titleColor: 'text-yellow-700',
    countBadge: 'bg-yellow-500 text-white',
    emptyText: 'Nothing due tomorrow',
  },
  {
    key: 'this_week',
    label: 'This Week',
    alwaysShow: false,
    startOpen: true,
    dotColor: 'bg-blue-500',
    headerBg: 'bg-blue-50',
    headerBorder: 'border-blue-100',
    titleColor: 'text-blue-700',
    countBadge: 'bg-blue-500 text-white',
    emptyText: 'Nothing else this week',
  },
  {
    key: 'later',
    label: 'Later',
    alwaysShow: false,
    startOpen: false,
    dotColor: 'bg-slate-400',
    headerBg: 'bg-slate-50',
    headerBorder: 'border-slate-100',
    titleColor: 'text-slate-600',
    countBadge: 'bg-slate-400 text-white',
    emptyText: 'Nothing planned further out',
  },
  {
    key: 'complete',
    label: 'Complete',
    alwaysShow: false,
    startOpen: false,
    dotColor: 'bg-green-500',
    headerBg: 'bg-green-50',
    headerBorder: 'border-green-100',
    titleColor: 'text-green-700',
    countBadge: 'bg-green-500 text-white',
    emptyText: 'No completed tasks',
  },
  {
    key: 'closed',
    label: 'Closed',
    alwaysShow: false,
    startOpen: false,
    dotColor: 'bg-red-400',
    headerBg: 'bg-red-50',
    headerBorder: 'border-red-100',
    titleColor: 'text-red-700',
    countBadge: 'bg-red-400 text-white',
    emptyText: 'No closed tasks',
  },
]

// Init collapse state
SECTIONS.forEach((s) => {
  collapsed.value[s.key] = !s.startOpen
})

// Client-side filtering across all sections
const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  const p = priorityFilter.value

  const filterFn = (task) => {
    const matchSearch = !q || task.title.toLowerCase().includes(q)
    const matchPriority = !p || task.priority === p
    return matchSearch && matchPriority
  }

  return Object.fromEntries(
    Object.entries(store.grouped).map(([key, tasks]) => [key, Array.isArray(tasks) ? tasks.filter(filterFn) : []]),
  )
})

const totalVisible = computed(() =>
  Object.values(filtered.value).reduce((sum, arr) => sum + (arr?.length ?? 0), 0),
)

function toggleSection(key) {
  collapsed.value[key] = !collapsed.value[key]
}

async function handleToggle(task) {
  await store.cycleStatus(task)
}

async function confirmDelete(task) {
  if (!confirm(`Delete "${task.title}"?`)) return
  await store.deleteTask(task.id)
  await store.fetchGrouped()
  await store.fetchSummary()
}

// ─── Display helpers ─────────────────────────────────────────────

function nextStatusLabel(s) {
  return (
    {
      incomplete: 'Mark in progress',
      in_progress: 'Mark complete',
      complete: 'Mark closed',
      closed: 'Reopen',
    }[s] ?? ''
  )
}

function dueChipText(task) {
  if (task.status === 'complete') return 'Complete'
  if (task.status === 'closed') return 'Closed'
  const due = new Date(task.due_date)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diff = Math.round((due - now) / 86400000)
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  if (diff <= 7) return `${diff} days`
  return new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function dueChipClass(task) {
  if (task.status === 'complete') return 'bg-green-100 text-green-700'
  if (task.status === 'closed') return 'bg-red-100 text-red-700'
  const due = new Date(task.due_date)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diff = Math.round((due - now) / 86400000)
  if (diff < 0) return 'bg-red-100 text-red-700'
  if (diff === 0) return 'bg-amber-100 text-amber-700'
  if (diff === 1) return 'bg-yellow-100 text-yellow-700'
  return 'bg-gray-100 text-gray-500'
}

function priorityBorder(p) {
  return (
    {
      urgent: 'border-red-500',
      high: 'border-amber-400',
      medium: 'border-blue-400',
      low: 'border-slate-300',
    }[p] ?? 'border-gray-200'
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

function statusLabel(s) {
  return (
    {
      incomplete: 'Incomplete',
      in_progress: 'In Progress',
      complete: 'Complete',
      closed: 'Closed',
    }[s] ?? s
  )
}

function statusClass(s) {
  return (
    {
      incomplete: 'bg-gray-100 text-gray-500',
      in_progress: 'bg-amber-100 text-amber-700',
      complete: 'bg-green-100 text-green-700',
      closed: 'bg-red-100 text-red-700',
    }[s] ?? 'bg-gray-100 text-gray-500'
  )
}

onMounted(async () => {
  await Promise.all([store.fetchGrouped(), store.fetchSummary()])
})
</script>
