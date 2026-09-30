<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-800">Deal Pipeline</h2>
      <div class="flex gap-2">
        <RouterLink
          to="/deals"
          class="border border-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
        >
          ☰ List View
        </RouterLink>
        <RouterLink
          to="/deals/create"
          class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700"
        >
          + Add Deal
        </RouterLink>
      </div>
    </div>

    <div v-if="store.loading" class="text-center py-12 text-gray-400">Loading pipeline...</div>

    <!-- Board -->
    <div v-else class="overflow-x-auto pb-6">
      <div class="flex gap-4" style="min-width: max-content">
        <div
          v-for="stage in STAGES"
          :key="stage.key"
          class="flex flex-col"
          style="width: 272px"
          @dragover.prevent="dragOverStage = stage.key"
          @dragleave.self="dragOverStage = null"
          @drop.prevent="onDrop(stage.key)"
        >
          <!-- Column header -->
          <div :class="stage.headerClass" class="rounded-t-xl px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold">{{ stage.label }}</span>
                <span class="text-xs bg-black/10 px-2 py-0.5 rounded-full font-medium">
                  {{ grouped[stage.key]?.length ?? 0 }}
                </span>
              </div>
              <span class="text-xs font-medium opacity-75">${{ columnTotal(stage.key) }}</span>
            </div>
          </div>

          <!-- Drop column -->
          <div
            :class="[
              'flex-1 rounded-b-xl p-3 space-y-3 transition-colors',
              dragOverStage === stage.key && dragging ? 'bg-blue-50 ring-2 ring-blue-300 ring-inset' : 'bg-gray-100',
            ]"
            style="min-height: 420px"
          >
            <div
              v-for="deal in grouped[stage.key]"
              :key="deal.id"
              draggable="true"
              @dragstart="onDragStart($event, deal, stage.key)"
              @dragend="onDragEnd"
              :class="[
                'bg-white rounded-lg p-4 shadow-sm border border-transparent',
                'hover:shadow-md hover:border-blue-200 transition-all',
                'cursor-grab active:cursor-grabbing select-none',
                dragging?.id === deal.id ? 'opacity-40 scale-95' : '',
              ]"
            >
              <!-- Card header -->
              <div class="mb-2">
                <RouterLink
                  :to="`/deals/${deal.id}`"
                  class="text-sm font-semibold text-gray-800 hover:text-blue-600 leading-snug"
                  @click.stop
                >
                  {{ deal.title }}
                </RouterLink>
                <p class="text-xs text-gray-400 mt-0.5">{{ deal.client?.name }}</p>
              </div>

              <!-- Card property -->
              <p v-if="deal.property" class="text-xs text-gray-500 mb-2 truncate">🏠 {{ deal.property.title }}</p>

              <!-- Card financials -->
              <div class="flex justify-between items-end mt-3 pt-3 border-t border-gray-100">
                <div>
                  <p class="text-xs text-gray-400">Value</p>
                  <p class="text-sm font-bold text-gray-800">${{ Number(deal.deal_value).toLocaleString() }}</p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-400">Commission</p>
                  <p class="text-sm font-bold text-green-600">
                    ${{ Number(deal.commission_amount).toLocaleString() }}
                  </p>
                </div>
              </div>

              <!-- Close date -->
              <p v-if="deal.expected_close_date" class="text-xs text-gray-400 mt-2">
                📅 {{ formatDate(deal.expected_close_date) }}
              </p>
            </div>

            <!-- Empty column state -->
            <div
              v-if="!grouped[stage.key]?.length"
              class="flex items-center justify-center h-20 text-xs text-gray-400 border-2 border-dashed border-gray-300 rounded-lg"
            >
              Drop deals here
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDealStore } from '@/stores/deal'

const store = useDealStore()

const STAGES = [
  { key: 'lead', label: 'Lead', headerClass: 'bg-gray-300 text-gray-800' },
  { key: 'prospect', label: 'Prospect', headerClass: 'bg-blue-300 text-blue-900' },
  { key: 'showing', label: 'Showing', headerClass: 'bg-indigo-300 text-indigo-900' },
  { key: 'offer_made', label: 'Offer Made', headerClass: 'bg-yellow-300 text-yellow-900' },
  { key: 'under_contract', label: 'Under Contract', headerClass: 'bg-orange-300 text-orange-900' },
  { key: 'closed', label: 'Closed', headerClass: 'bg-green-300 text-green-900' },
  { key: 'lost', label: 'Lost', headerClass: 'bg-red-300 text-red-900' },
]

// Deep copy kanban data so we can mutate for optimistic updates
const grouped = ref({})
const dragging = ref(null) // { id, stage, deal }
const dragOverStage = ref(null)

onMounted(async () => {
  await store.fetchKanban()
  grouped.value = JSON.parse(JSON.stringify(store.kanban))
})

function onDragStart(e, deal, stage) {
  dragging.value = { id: deal.id, stage, deal }
  e.dataTransfer.effectAllowed = 'move'
}

function onDragEnd() {
  dragging.value = null
  dragOverStage.value = null
}

async function onDrop(toStage) {
  if (!dragging.value) return

  const { id, stage: fromStage, deal } = dragging.value
  dragging.value = null
  dragOverStage.value = null

  if (fromStage === toStage) return

  // Optimistic update
  const fromList = grouped.value[fromStage] ?? []
  const idx = fromList.findIndex((d) => d.id === id)
  if (idx === -1) return

  fromList.splice(idx, 1)
  deal.stage = toStage
  if (!grouped.value[toStage]) grouped.value[toStage] = []
  grouped.value[toStage].push(deal)

  // API call — revert on failure
  try {
    await store.updateStage(id, toStage)
  } catch {
    grouped.value[toStage] = grouped.value[toStage].filter((d) => d.id !== id)
    deal.stage = fromStage
    fromList.splice(idx, 0, deal)
    alert('Failed to update stage. Please try again.')
  }
}

function columnTotal(stage) {
  const total = (grouped.value[stage] ?? []).reduce((sum, d) => sum + Number(d.deal_value), 0)
  if (total >= 1_000_000) return `${(total / 1_000_000).toFixed(1)}M`
  if (total >= 1_000) return `${(total / 1_000).toFixed(0)}K`
  return total.toLocaleString()
}

function formatDate(s) {
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
