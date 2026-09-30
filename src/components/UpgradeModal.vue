<template>
  <Transition name="um-fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]"
      @click.self="$emit('close')"
    >
      <Transition name="um-pop" appear>
        <div
          v-if="show"
          ref="panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upgrade-modal-title"
          class="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-900/10 overflow-hidden"
        >
          <!-- Header -->
          <div class="relative px-6 pt-6 pb-5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
            <button
              type="button"
              @click="$emit('close')"
              aria-label="Close"
              class="absolute top-4 right-4 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10
                     transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448c.019-.104.039-.208.06-.311m2.699 2.699L4.5 19.5"
                />
              </svg>
            </div>

            <h2 id="upgrade-modal-title" class="text-lg font-semibold tracking-tight">
              You've hit the free plan limit
            </h2>
            <p class="text-sm text-blue-100 mt-1">
              Free accounts can hold up to {{ limit }} listings. You have {{ current }}.
              Upgrade for unlimited listings and more.
            </p>
          </div>

          <!-- Features -->
          <div class="px-6 py-5">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Everything in Pro
            </p>
            <ul class="space-y-2.5">
              <li v-for="feature in PRO_FEATURES" :key="feature" class="flex items-start gap-2.5">
                <span
                  class="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5"
                >
                  <svg
                    class="w-2.5 h-2.5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                <span class="text-sm text-slate-700">{{ feature }}</span>
              </li>
            </ul>

            <p v-if="error" class="text-xs text-rose-600 font-medium mt-4">{{ error }}</p>
          </div>

          <!-- Actions -->
          <div class="px-6 pb-6 flex flex-col-reverse sm:flex-row sm:items-center gap-2">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100
                     hover:bg-slate-200 transition-colors
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Maybe later
            </button>
            <button
              type="button"
              @click="upgrade"
              :disabled="busy"
              class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600
                     hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors
                     shadow-sm shadow-blue-600/25
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {{ busy ? 'Redirecting…' : 'Upgrade to Pro — $29/month' }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useSubscriptionStore } from '@/stores/subscription'
import { PRO_FEATURES } from '@/lib/plans'

const props = defineProps({
  show: { type: Boolean, default: false },
  detail: { type: Object, default: null },
})
const emit = defineEmits(['close'])

const subscription = useSubscriptionStore()
const busy = ref(false)
const error = ref('')
const panel = ref(null)

const limit = computed(() => props.detail?.limit ?? 5)
const current = computed(() => props.detail?.current ?? limit.value)

async function upgrade() {
  busy.value = true
  error.value = ''
  try {
    await subscription.createCheckoutSession()
  } catch {
    error.value = subscription.error || 'Could not start checkout. Please try again.'
    busy.value = false
  }
}

function onKeydown(e) {
  if (e.key === 'Escape' && props.show) emit('close')
}

watch(
  () => props.show,
  async (open) => {
    if (open) {
      error.value = ''
      busy.value = false
      await nextTick()
      panel.value?.focus?.()
    }
  },
)

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.um-fade-enter-active,
.um-fade-leave-active {
  transition: opacity 0.2s ease;
}
.um-fade-enter-from,
.um-fade-leave-to {
  opacity: 0;
}

.um-pop-enter-active {
  transition:
    transform 0.22s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.22s ease;
}
.um-pop-enter-from {
  transform: translateY(8px) scale(0.98);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .um-fade-enter-active,
  .um-fade-leave-active,
  .um-pop-enter-active {
    transition: none;
  }
}
</style>
