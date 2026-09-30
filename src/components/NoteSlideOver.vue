<template>
  <!-- Backdrop -->
  <Transition name="ns-fade">
    <div v-if="show" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" @click="$emit('close')"></div>
  </Transition>

  <!-- Panel -->
  <Transition name="ns-slide">
    <div
      v-if="show"
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-slideover-title"
      class="fixed right-0 top-0 h-dvh w-full max-w-[30vw] sm:min-w-[420px] bg-white shadow-2xl z-50 flex flex-col"
    >
      <!-- Header -->
      <div class="px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
            </div>
            <div class="min-w-0">
              <h3 id="note-slideover-title" class="text-base font-bold text-gray-900">Notes</h3>
              <p class="text-xs text-gray-400 truncate">{{ title }}</p>
            </div>
          </div>
          <button
            type="button"
            @click="$emit('close')"
            aria-label="Close"
            class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Add note -->
        <div class="bg-gray-50 rounded-2xl p-4">
          <label :for="fieldId" class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Add Note
          </label>
          <textarea
            :id="fieldId"
            v-model="newNote"
            rows="3"
            maxlength="5000"
            placeholder="Log a call, meeting, update, or anything relevant..."
            class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          ></textarea>
          <div class="flex items-center justify-between mt-3">
            <span class="text-xs text-gray-400">{{ newNote.length }}/5000</span>
            <button
              type="button"
              @click="submitNote"
              :disabled="!newNote.trim() || saving"
              class="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold
                     hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {{ saving ? 'Saving...' : 'Add Note' }}
            </button>
          </div>
          <p v-if="error" class="text-xs text-rose-600 font-medium mt-2">{{ error }}</p>
        </div>

        <!-- Notes count -->
        <div class="flex items-center gap-2">
          <div class="flex-1 h-px bg-gray-100"></div>
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {{ notes.length }} Note{{ notes.length !== 1 ? 's' : '' }}
          </span>
          <div class="flex-1 h-px bg-gray-100"></div>
        </div>

        <!-- Empty state -->
        <div v-if="!notes.length" class="flex flex-col items-center justify-center py-12 text-gray-400">
          <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
            <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7.5 8.25h9m-9 3H12" />
            </svg>
          </div>
          <p class="text-sm font-medium">No notes yet</p>
          <p class="text-xs mt-0.5">Add your first note above</p>
        </div>

        <!-- Timeline -->
        <div v-else class="space-y-1">
          <div v-for="note in notes" :key="note.id" class="flex gap-3 group">
            <div class="flex flex-col items-center pt-1">
              <div
                class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0"
              >
                {{ note.user?.name?.charAt(0).toUpperCase() ?? 'A' }}
              </div>
              <div class="w-px flex-1 bg-gray-100 mt-2"></div>
            </div>
            <div class="flex-1 pb-5 min-w-0">
              <div
                class="bg-white border border-gray-100 rounded-xl p-3.5 shadow-sm group-hover:border-gray-200 transition-colors"
              >
                <div class="flex items-center justify-between mb-2 gap-2">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="text-xs font-bold text-gray-800 truncate">{{ note.user?.name ?? 'Agent' }}</span>
                    <span class="w-1 h-1 rounded-full bg-gray-300 shrink-0"></span>
                    <span class="text-xs text-gray-400 shrink-0">{{ formatDateTime(note.created_at) }}</span>
                  </div>
                  <button
                    type="button"
                    @click="removeNote(note.id)"
                    :aria-label="`Delete note by ${note.user?.name ?? 'Agent'}`"
                    class="text-gray-300 hover:text-red-500 transition-all p-1 rounded shrink-0
                           opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:opacity-100
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{{ note.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import api from '@/lib/axios'

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '' },
  // e.g. '/clients/5' or '/deals/3'
  apiBasePath: { type: String, required: true },
  initialNotes: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'note-added', 'note-deleted'])

const notes = ref([...props.initialNotes])
const newNote = ref('')
const saving = ref(false)
const error = ref('')

const fieldId = computed(() => `note-input-${props.apiBasePath.replace(/\W/g, '-')}`)

watch(
  () => props.initialNotes,
  (v) => {
    notes.value = [...v]
  },
)

watch(
  () => props.show,
  (v) => {
    if (!v) {
      newNote.value = ''
      error.value = ''
    }
  },
)

function onKeydown(e) {
  if (e.key === 'Escape' && props.show) emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

async function submitNote() {
  if (!newNote.value.trim()) return
  saving.value = true
  error.value = ''
  try {
    const { data } = await api.post(`${props.apiBasePath}/notes`, {
      content: newNote.value.trim(),
    })
    notes.value.unshift(data)
    newNote.value = ''
    emit('note-added', data)
  } catch (e) {
    error.value = e.response?.data?.message || 'Could not save that note.'
  } finally {
    saving.value = false
  }
}

async function removeNote(noteId) {
  if (!confirm('Delete this note?')) return
  try {
    await api.delete(`${props.apiBasePath}/notes/${noteId}`)
    notes.value = notes.value.filter((n) => n.id !== noteId)
    emit('note-deleted', noteId)
  } catch (e) {
    error.value = e.response?.data?.message || 'Could not delete that note.'
  }
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

<style scoped>
.ns-fade-enter-active,
.ns-fade-leave-active {
  transition: opacity 0.2s ease;
}
.ns-fade-enter-from,
.ns-fade-leave-to {
  opacity: 0;
}
.ns-slide-enter-active,
.ns-slide-leave-active {
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}
.ns-slide-enter-from,
.ns-slide-leave-to {
  transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
  .ns-fade-enter-active,
  .ns-fade-leave-active,
  .ns-slide-enter-active,
  .ns-slide-leave-active {
    transition: none;
  }
}
</style>
