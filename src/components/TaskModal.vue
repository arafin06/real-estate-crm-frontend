<template>
  <!-- Backdrop -->
  <Transition name="tm-fade">
    <div v-if="show" class="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-40" @click="$emit('close')"></div>
  </Transition>

  <!-- Slide panel -->
  <Transition name="tm-slide">
    <div
      v-if="show"
      role="dialog"
      aria-modal="true"
      :aria-label="t ? `Task details: ${t.title}` : 'Task details'"
      class="fixed right-0 top-0 h-dvh w-full sm:max-w-[520px] bg-white shadow-xl shadow-slate-900/10 z-50 flex flex-col sm:border-l sm:border-slate-200"
    >
      <!-- Loading -->
      <div v-if="loading" class="flex-1 flex items-center justify-center">
        <div class="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <template v-else-if="t">
        <!-- ─── Header ──────────────────────────────────────────── -->
        <header class="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <div class="flex items-start gap-3">
            <!-- Completion toggle -->
            <button
              type="button"
              @click="cycleStatus"
              :title="nextStatusHint"
              :aria-label="nextStatusHint"
              :class="statusCircleClass"
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-colors
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <svg
                v-if="t.status === 'complete'"
                class="w-3.5 h-3.5 text-white"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <div v-else-if="t.status === 'in_progress'" class="w-1.5 h-1.5 bg-white rounded-full"></div>
              <svg
                v-else-if="t.status === 'closed'"
                class="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Title + badges -->
            <div class="flex-1 min-w-0">
              <h2
                :class="[
                  'text-lg font-semibold tracking-tight leading-snug break-words',
                  isOpenStatus(t.status) ? 'text-slate-900' : 'text-slate-400 line-through',
                ]"
              >
                {{ t.title }}
              </h2>

              <div class="flex flex-wrap items-center gap-1.5 mt-2">
                <span :class="statusBadge(t.status)" class="text-[11px] font-semibold px-2 py-0.5 rounded-md">
                  {{ statusLabel(t.status) }}
                </span>
                <span :class="priorityBadge(t.priority)" class="text-[11px] font-semibold px-2 py-0.5 rounded-md">
                  {{ priorityLabel(t.priority) }}
                </span>
                <span
                  v-if="t.is_recurring"
                  class="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
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

            <!-- Secondary actions -->
            <div class="flex items-center gap-1 shrink-0">
              <RouterLink
                :to="`/tasks/${t.id}/edit?back=${route.path}`"
                @click="$emit('close')"
                class="text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg
                       transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Full Edit
              </RouterLink>
              <button
                type="button"
                @click="$emit('close')"
                aria-label="Close"
                class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Save flash -->
          <Transition name="tm-fade">
            <p
              v-if="saved"
              role="status"
              class="text-xs text-emerald-600 font-medium mt-3 flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              Saved
            </p>
          </Transition>
        </header>

        <!-- ─── Scrollable body ─────────────────────────────────── -->
        <div class="flex-1 overflow-y-auto">
          <!-- Task details -->
          <section class="px-5 sm:px-6 py-5 space-y-5">
            <!-- Status -->
            <fieldset>
              <legend class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Status</legend>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <label
                  v-for="opt in STATUS_OPTIONS"
                  :key="opt.key"
                  :class="[
                    'relative flex items-center gap-2 px-2.5 py-2 rounded-xl border cursor-pointer select-none transition-all',
                    t.status === opt.key
                      ? opt.selectedClass
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                  ]"
                >
                  <input
                    type="radio"
                    name="task-status"
                    class="peer sr-only"
                    :value="opt.key"
                    :checked="t.status === opt.key"
                    @change="selectStatus(opt.key)"
                  />
                  <span
                    class="absolute inset-0 rounded-xl pointer-events-none peer-focus-visible:ring-2
                           peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-1"
                  ></span>
                  <span
                    :class="[
                      'w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                      t.status === opt.key ? opt.dotClass : 'border-slate-300',
                    ]"
                  >
                    <span v-if="t.status === opt.key" class="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </span>
                  <span class="text-xs font-semibold truncate">{{ opt.label }}</span>
                </label>
              </div>
            </fieldset>

            <!-- Priority -->
            <fieldset>
              <legend class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Priority</legend>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <label
                  v-for="opt in PRIORITY_OPTIONS"
                  :key="opt.key"
                  :class="[
                    'relative flex items-center gap-2 px-2.5 py-2 rounded-xl border cursor-pointer select-none transition-all',
                    t.priority === opt.key
                      ? opt.selectedClass
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                  ]"
                >
                  <input
                    type="radio"
                    name="task-priority"
                    class="peer sr-only"
                    :value="opt.key"
                    :checked="t.priority === opt.key"
                    @change="selectPriority(opt.key)"
                  />
                  <span
                    class="absolute inset-0 rounded-xl pointer-events-none peer-focus-visible:ring-2
                           peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-1"
                  ></span>
                  <span
                    :class="[
                      'w-2 h-2 rounded-full shrink-0 transition-colors',
                      t.priority === opt.key ? opt.dotClass : 'bg-slate-300',
                    ]"
                  ></span>
                  <span class="text-xs font-semibold truncate">{{ opt.label }}</span>
                </label>
              </div>
            </fieldset>

            <!-- Due date -->
            <div>
              <label
                :for="`task-due-${t.id}`"
                class="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2"
              >
                Due Date
              </label>
              <div class="flex flex-wrap items-center gap-2">
                <input
                  :id="`task-due-${t.id}`"
                  type="date"
                  v-model="t.due_date"
                  @change="save('due_date', t.due_date)"
                  class="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200
                         hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <span :class="dueChipClass" class="text-xs font-medium px-2 py-1 rounded-md">
                  {{ dueChipText }}
                </span>
              </div>
            </div>

            <!-- Description -->
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Description</p>
              <p v-if="t.description" class="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {{ t.description }}
              </p>
              <p v-else class="text-sm text-slate-400 italic">No description added.</p>
            </div>

            <!-- Client / Deal -->
            <div v-if="t.client || t.deal" class="space-y-2">
              <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Linked To</p>

              <RouterLink
                v-if="t.client"
                :to="`/clients/${t.client.id}`"
                @click="$emit('close')"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-200 bg-white
                       hover:border-slate-300 hover:bg-slate-50 transition-colors group
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span
                  class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-xs font-bold
                         flex items-center justify-center shrink-0 uppercase"
                >
                  {{ initials(t.client.name) }}
                </span>
                <span class="flex-1 min-w-0">
                  <span class="block text-sm font-semibold text-slate-800 truncate">{{ t.client.name }}</span>
                  <span class="block text-xs text-slate-400">Client</span>
                </span>
                <svg
                  class="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </RouterLink>

              <RouterLink
                v-if="t.deal"
                :to="`/deals/${t.deal.id}`"
                @click="$emit('close')"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-200 bg-white
                       hover:border-slate-300 hover:bg-slate-50 transition-colors group
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span
                  class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25"
                    />
                  </svg>
                </span>
                <span class="flex-1 min-w-0">
                  <span class="block text-sm font-semibold text-slate-800 truncate">{{ t.deal.title }}</span>
                  <span class="block text-xs text-slate-400">Deal</span>
                </span>
                <svg
                  class="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </RouterLink>
            </div>
          </section>

          <!-- ─── Recurring timeline ────────────────────────────── -->
          <section v-if="t.is_recurring" class="px-5 sm:px-6 py-5 border-t border-slate-100">
            <div class="flex items-center justify-between gap-3 mb-3">
              <h3 class="text-sm font-semibold text-slate-800">Recurring Timeline</h3>
              <span class="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {{ recurrenceDesc }}
              </span>
            </div>

            <!-- Current occurrence -->
            <div class="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 mb-4">
              <div class="flex items-center justify-between gap-2 mb-1.5">
                <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Current Occurrence</p>
                <span class="text-xs font-semibold text-slate-600">Due {{ formatDate(t.due_date) }}</span>
              </div>
              <p class="text-xs text-slate-500 mb-3 leading-relaxed">
                Completing this logs it to the timeline and advances the next due date.
              </p>
              <label :for="`occ-note-${t.id}`" class="sr-only">Note for this completion</label>
              <textarea
                :id="`occ-note-${t.id}`"
                v-model="occurrenceNote"
                rows="2"
                placeholder="Optional note (e.g. called client, sent email)..."
                class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700
                       placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-transparent resize-none mb-2.5 transition-colors"
              ></textarea>
              <button
                type="button"
                @click="completeOccurrence"
                :disabled="completingOcc"
                class="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-semibold
                       hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                {{ completingOcc ? 'Completing…' : 'Complete This Occurrence' }}
              </button>
            </div>

            <!-- History -->
            <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Completion History ({{ t.occurrences?.length ?? 0 }})
            </p>

            <div
              v-if="!t.occurrences?.length"
              class="rounded-xl border border-dashed border-slate-200 py-5 text-center text-xs text-slate-400"
            >
              No completions logged yet.
            </div>

            <ul v-else class="space-y-2.5">
              <li
                v-for="occ in t.occurrences"
                :key="occ.id"
                class="flex gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5"
              >
                <span
                  class="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5"
                >
                  <svg class="w-2.5 h-2.5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span class="text-xs font-semibold text-slate-700">{{ occ.user?.name ?? 'Agent' }}</span>
                    <span class="text-xs text-slate-400">was due {{ formatDate(occ.due_date) }}</span>
                  </div>
                  <p class="text-xs text-slate-400 mt-0.5">Completed {{ formatDateTime(occ.completed_at) }}</p>
                  <p v-if="occ.note" class="text-sm text-slate-700 mt-1.5 leading-relaxed whitespace-pre-wrap">
                    {{ occ.note }}
                  </p>
                </div>
              </li>
            </ul>
          </section>

          <!-- ─── Subtasks ──────────────────────────────────────── -->
          <section v-if="t.subtasks?.length" class="px-5 sm:px-6 py-5 border-t border-slate-100">
            <div class="flex items-center justify-between gap-3 mb-3">
              <h3 class="text-sm font-semibold text-slate-800">
                Subtasks
                <span class="text-slate-400 font-medium">({{ t.subtasks.length }})</span>
              </h3>
              <span class="text-xs font-medium text-slate-500">{{ doneSubtasks }}/{{ t.subtasks.length }} done</span>
            </div>

            <div class="h-1 bg-slate-100 rounded-full mb-3 overflow-hidden">
              <div
                class="h-full bg-emerald-500 rounded-full transition-all duration-500"
                :style="{ width: subtaskPct + '%' }"
              ></div>
            </div>

            <ul class="space-y-1">
              <li
                v-for="sub in t.subtasks"
                :key="sub.id"
                class="flex items-center gap-3 py-2 px-2.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <button
                  type="button"
                  @click="toggleSub(sub)"
                  :aria-label="`${nextStatusFor(sub.status)}: ${sub.title}`"
                  :title="nextStatusFor(sub.status)"
                  :class="[
                    'w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
                    sub.status === 'complete'
                      ? 'bg-emerald-500 border-emerald-500'
                      : sub.status === 'in_progress'
                        ? 'bg-amber-400 border-amber-400'
                        : sub.status === 'closed'
                          ? 'bg-rose-400 border-rose-400'
                          : 'border-slate-300 hover:border-blue-400 bg-white',
                  ]"
                >
                  <svg
                    v-if="sub.status === 'complete'"
                    class="w-2.5 h-2.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span v-else-if="sub.status === 'in_progress'" class="w-1 h-1 bg-white rounded-full"></span>
                </button>
                <span
                  :class="[
                    'flex-1 text-sm font-medium truncate',
                    isOpenStatus(sub.status) ? 'text-slate-700' : 'text-slate-400 line-through',
                  ]"
                >
                  {{ sub.title }}
                </span>
                <span class="text-xs text-slate-400 shrink-0">{{ formatDate(sub.due_date) }}</span>
              </li>
            </ul>
          </section>

          <!-- ─── Notes ─────────────────────────────────────────── -->
          <section class="px-5 sm:px-6 py-5 border-t border-slate-100">
            <h3 class="text-sm font-semibold text-slate-800 mb-3">
              Notes
              <span class="text-slate-400 font-medium">({{ t.notes?.length ?? 0 }})</span>
            </h3>

            <!-- Composer -->
            <div class="rounded-xl border border-slate-200 bg-white focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500 transition-all mb-4">
              <label :for="`note-${t.id}`" class="sr-only">Add a note</label>
              <textarea
                :id="`note-${t.id}`"
                v-model="newNote"
                rows="2"
                placeholder="Add a note or update…"
                class="w-full bg-transparent px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400
                       focus:outline-none resize-none"
              ></textarea>
              <div class="flex justify-end px-2 pb-2">
                <button
                  type="button"
                  @click="addNote"
                  :disabled="!newNote.trim() || savingNote"
                  class="bg-slate-900 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold
                         hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                >
                  {{ savingNote ? 'Adding…' : 'Add Note' }}
                </button>
              </div>
            </div>

            <!-- Empty state -->
            <div
              v-if="!t.notes?.length"
              class="rounded-xl border border-dashed border-slate-200 py-7 px-4 text-center"
            >
              <p class="text-sm font-medium text-slate-500">No notes yet</p>
              <p class="text-xs text-slate-400 mt-1">Add a note to keep track of updates.</p>
            </div>

            <!-- Note cards -->
            <ul v-else class="space-y-2">
              <li
                v-for="note in t.notes"
                :key="note.id"
                class="group rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-3 hover:border-slate-200 transition-colors"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <span class="text-xs font-semibold text-slate-700">{{ note.user?.name ?? 'Agent' }}</span>
                    <span class="text-xs text-slate-400 ml-2">{{ formatDateTime(note.created_at) }}</span>
                  </div>
                  <button
                    type="button"
                    @click="removeNote(note.id)"
                    :aria-label="`Delete note by ${note.user?.name ?? 'Agent'}`"
                    class="text-xs font-medium text-slate-400 hover:text-rose-600 shrink-0 transition-all
                           opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:opacity-100
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
                  >
                    Delete
                  </button>
                </div>
                <p class="text-sm text-slate-700 mt-1 leading-relaxed whitespace-pre-wrap">{{ note.content }}</p>
              </li>
            </ul>
          </section>

          <div class="h-6"></div>
        </div>
      </template>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '@/stores/task'
import api from '@/lib/axios'

const props = defineProps({
  show: { type: Boolean, default: false },
  taskId: { type: [Number, String], default: null },
})
const emit = defineEmits(['close', 'updated'])

const store = useTaskStore()
// The modal is an overlay on whatever page opened it, so "back" from Full
// Edit is simply the current page.
const route = useRoute()
const t = ref(null)
const loading = ref(false)

const newNote = ref('')
const savingNote = ref(false)
const occurrenceNote = ref('')
const completingOcc = ref(false)
const saved = ref(false)
let savedTimer = null

// ─── Option tables ─────────────────────────────────────
const STATUS_OPTIONS = [
  {
    key: 'incomplete',
    label: 'Incomplete',
    selectedClass: 'border-slate-400 bg-slate-50 text-slate-800',
    dotClass: 'border-slate-500 bg-slate-500',
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    selectedClass: 'border-amber-400 bg-amber-50 text-amber-900',
    dotClass: 'border-amber-500 bg-amber-500',
  },
  {
    key: 'complete',
    label: 'Completed',
    selectedClass: 'border-emerald-400 bg-emerald-50 text-emerald-900',
    dotClass: 'border-emerald-500 bg-emerald-500',
  },
  {
    key: 'closed',
    label: 'Closed',
    selectedClass: 'border-rose-300 bg-rose-50 text-rose-900',
    dotClass: 'border-rose-400 bg-rose-400',
  },
]

const PRIORITY_OPTIONS = [
  {
    key: 'low',
    label: 'Low',
    selectedClass: 'border-slate-300 bg-slate-50 text-slate-700',
    dotClass: 'bg-slate-400',
  },
  {
    key: 'medium',
    label: 'Medium',
    selectedClass: 'border-blue-300 bg-blue-50 text-blue-800',
    dotClass: 'bg-blue-500',
  },
  {
    key: 'high',
    label: 'High',
    selectedClass: 'border-amber-400 bg-amber-50 text-amber-900',
    dotClass: 'bg-amber-500',
  },
  {
    key: 'urgent',
    label: 'Urgent',
    selectedClass: 'border-rose-400 bg-rose-50 text-rose-900',
    dotClass: 'bg-rose-500',
  },
]

const CYCLE = {
  incomplete: 'in_progress',
  in_progress: 'complete',
  complete: 'closed',
  closed: 'incomplete',
}

const NEXT_HINT = {
  incomplete: 'Mark in progress',
  in_progress: 'Mark complete',
  complete: 'Mark closed',
  closed: 'Reopen task',
}

// ─── Load task when panel opens ────────────────────────
watch(
  () => props.taskId,
  async (id) => {
    if (!id) {
      t.value = null
      return
    }
    loading.value = true
    try {
      const { data } = await api.get(`/tasks/${id}`)
      t.value = data
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)

watch(
  () => props.show,
  (v) => {
    if (!v) {
      newNote.value = ''
      occurrenceNote.value = ''
    }
  },
)

function onKeydown(e) {
  if (e.key === 'Escape' && props.show) emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  clearTimeout(savedTimer)
})

// ─── Status / priority ─────────────────────────────────
function isOpenStatus(s) {
  return s === 'incomplete' || s === 'in_progress'
}

function nextStatusFor(s) {
  return NEXT_HINT[s] ?? ''
}

const nextStatusHint = computed(() => nextStatusFor(t.value?.status))

const statusCircleClass = computed(() => ({
  'bg-emerald-500 border-emerald-500': t.value?.status === 'complete',
  'bg-amber-400 border-amber-400': t.value?.status === 'in_progress',
  'bg-rose-400 border-rose-400': t.value?.status === 'closed',
  // must not overlap with in_progress, or both background classes get applied
  'border-slate-300 hover:border-blue-400 bg-white': t.value?.status === 'incomplete',
}))

async function cycleStatus() {
  if (!t.value) return
  await selectStatus(CYCLE[t.value.status] ?? 'incomplete')
}

async function selectStatus(value) {
  if (!t.value || t.value.status === value) return
  t.value.status = value
  await save('status', value)
}

async function selectPriority(value) {
  if (!t.value || t.value.priority === value) return
  t.value.priority = value
  await save('priority', value)
}

// ─── Quick save ────────────────────────────────────────
async function save(field, value) {
  if (!t.value) return
  try {
    await api.patch(`/tasks/${t.value.id}`, { [field]: value })
    flashSaved()
    emit('updated', { id: t.value.id, [field]: value })
    store.fetchGrouped()
    store.fetchSummary()
  } catch (e) {
    console.error('Save error', e)
  }
}

function flashSaved() {
  saved.value = true
  clearTimeout(savedTimer)
  savedTimer = setTimeout(() => {
    saved.value = false
  }, 2000)
}

// ─── Recurring ─────────────────────────────────────────
const recurrenceDesc = computed(() => {
  if (!t.value?.is_recurring) return ''
  const map = { daily: 'day', weekly: 'week', biweekly: '2 weeks', monthly: 'month', yearly: 'year' }
  const n = t.value.recurrence_interval || 1
  const unit = map[t.value.recurrence_type] ?? ''
  if (t.value.recurrence_type === 'biweekly') return 'Every 2 weeks'
  return `Every ${n > 1 ? n + ' ' : ''}${unit}${n > 1 ? 's' : ''}`
})

async function completeOccurrence() {
  completingOcc.value = true
  try {
    t.value = await store.completeOccurrence(t.value.id, occurrenceNote.value || null)
    occurrenceNote.value = ''
    emit('updated')
  } finally {
    completingOcc.value = false
  }
}

// ─── Notes ─────────────────────────────────────────────
async function addNote() {
  if (!newNote.value.trim()) return
  savingNote.value = true
  try {
    const note = await store.addNote(t.value.id, newNote.value.trim())
    t.value.notes = [note, ...(t.value.notes ?? [])]
    newNote.value = ''
    emit('updated')
  } finally {
    savingNote.value = false
  }
}

async function removeNote(noteId) {
  if (!confirm('Delete this note?')) return
  await store.deleteNote(t.value.id, noteId)
  t.value.notes = t.value.notes.filter((n) => n.id !== noteId)
  emit('updated')
}

// ─── Subtasks ──────────────────────────────────────────
const doneSubtasks = computed(
  () => t.value?.subtasks?.filter((s) => s.status === 'complete').length ?? 0,
)

const subtaskPct = computed(() => {
  const total = t.value?.subtasks?.length ?? 0
  return total ? Math.round((doneSubtasks.value / total) * 100) : 0
})

async function toggleSub(sub) {
  const next = CYCLE[sub.status] ?? 'incomplete'
  await store.updateSubtask(sub.id, { status: next })
  sub.status = next
}

// ─── Display helpers ───────────────────────────────────
function statusLabel(s) {
  return STATUS_OPTIONS.find((o) => o.key === s)?.label ?? s
}

function priorityLabel(p) {
  return PRIORITY_OPTIONS.find((o) => o.key === p)?.label ?? p
}

function statusBadge(s) {
  return (
    {
      incomplete: 'bg-slate-100 text-slate-600',
      in_progress: 'bg-amber-100 text-amber-800',
      complete: 'bg-emerald-100 text-emerald-700',
      closed: 'bg-rose-100 text-rose-700',
    }[s] ?? 'bg-slate-100 text-slate-600'
  )
}

function priorityBadge(p) {
  return (
    {
      low: 'bg-slate-100 text-slate-600',
      medium: 'bg-blue-50 text-blue-700',
      high: 'bg-amber-100 text-amber-800',
      urgent: 'bg-rose-100 text-rose-700',
    }[p] ?? 'bg-slate-100 text-slate-600'
  )
}

const dueChipText = computed(() => {
  const task = t.value
  if (!task) return ''
  if (!isOpenStatus(task.status)) return statusLabel(task.status)
  const diff = daysUntilDue(task.due_date)
  if (diff === null) return 'No due date'
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  return `Due in ${diff}d`
})

const dueChipClass = computed(() => {
  const task = t.value
  if (!task || !isOpenStatus(task.status)) return 'bg-slate-100 text-slate-500'
  const diff = daysUntilDue(task.due_date)
  if (diff === null) return 'bg-slate-100 text-slate-500'
  if (diff < 0) return 'bg-rose-100 text-rose-700'
  if (diff === 0) return 'bg-amber-100 text-amber-800'
  return 'bg-slate-100 text-slate-500'
})

function daysUntilDue(due) {
  if (!due) return null
  const d = new Date(due)
  if (Number.isNaN(d.getTime())) return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.round((d - now) / 86400000)
}

function initials(name) {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
}

function formatDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateTime(s) {
  if (!s) return ''
  return new Date(s).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.tm-fade-enter-active,
.tm-fade-leave-active {
  transition: opacity 0.2s ease;
}
.tm-fade-enter-from,
.tm-fade-leave-to {
  opacity: 0;
}

.tm-slide-enter-active,
.tm-slide-leave-active {
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}
.tm-slide-enter-from,
.tm-slide-leave-to {
  transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
  .tm-fade-enter-active,
  .tm-fade-leave-active,
  .tm-slide-enter-active,
  .tm-slide-leave-active {
    transition: none;
  }
}
</style>
