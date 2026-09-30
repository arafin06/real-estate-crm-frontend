import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/axios'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref([])
  const task = ref(null)
  const summary = ref({ overdue: 0, today: 0, upcoming: 0, total: 0 })
  const grouped = ref({
    overdue: [],
    today: [],
    tomorrow: [],
    this_week: [],
    later: [],
    complete: [],
    closed: [],
  })
  const meta = ref({})
  const loading = ref(false)

  async function fetchTasks(params = {}) {
    loading.value = true
    try {
      const { data } = await api.get('/tasks', { params })
      tasks.value = data.data
      meta.value = {
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total,
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchSummary() {
    const { data } = await api.get('/tasks/summary')
    summary.value = data
  }

  async function fetchGrouped() {
    loading.value = true
    try {
      const { data } = await api.get('/tasks/grouped')
      grouped.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchTask(id) {
    const { data } = await api.get(`/tasks/${id}`)
    task.value = data
    return data
  }

  async function createTask(payload) {
    const { data } = await api.post('/tasks', payload)
    return data
  }

  async function updateTask(id, payload) {
    const { data } = await api.patch(`/tasks/${id}`, payload)
    return data
  }

  async function deleteTask(id) {
    await api.delete(`/tasks/${id}`)
    tasks.value = tasks.value.filter((t) => t.id !== id)
    // Remove from grouped
    Object.keys(grouped.value).forEach((key) => {
      grouped.value[key] = grouped.value[key].filter((t) => t.id !== id)
    })
  }

  // Cycle: incomplete → in_progress → complete → closed → incomplete
  async function cycleStatus(task) {
    const next =
      {
        incomplete: 'in_progress',
        in_progress: 'complete',
        complete: 'closed',
        closed: 'incomplete',
      }[task.status] ?? 'incomplete'

    await api.patch(`/tasks/${task.id}`, { status: next })
    await fetchGrouped()
    await fetchSummary()
  }

  // ─── Recurring occurrences ────────────────────────
  async function completeOccurrence(taskId, note = null) {
    const { data } = await api.post(`/tasks/${taskId}/complete-occurrence`, { note })
    await fetchGrouped()
    await fetchSummary()
    return data
  }

  // ─── Subtasks ─────────────────────────────────────
  async function createSubtask(taskId, payload) {
    const { data } = await api.post(`/tasks/${taskId}/subtasks`, payload)
    return data
  }

  async function updateSubtask(subtaskId, payload) {
    const { data } = await api.patch(`/tasks/${subtaskId}`, payload)
    return data
  }

  async function deleteSubtask(subtaskId) {
    await api.delete(`/tasks/${subtaskId}`)
  }

  // ─── Notes ────────────────────────────────────────
  async function addNote(taskId, content) {
    const { data } = await api.post(`/tasks/${taskId}/notes`, { content })
    return data
  }

  async function deleteNote(taskId, noteId) {
    await api.delete(`/tasks/${taskId}/notes/${noteId}`)
  }

  return {
    tasks,
    task,
    summary,
    grouped,
    meta,
    loading,
    fetchTasks,
    fetchSummary,
    fetchGrouped,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    cycleStatus,
    completeOccurrence,
    createSubtask,
    updateSubtask,
    deleteSubtask,
    addNote,
    deleteNote,
  }
})
