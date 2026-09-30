<template>
  <input
    ref="inputRef"
    type="tel"
    inputmode="numeric"
    autocomplete="tel"
    :value="displayValue"
    v-bind="$attrs"
    @input="onInput"
    @keydown="onKeydown"
  />
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { normalizePhone, formatPhoneProgressive, nextPhoneInputState } from '@/lib/phone'

// modelValue is always the digits-only value (e.g. "855365920", possibly
// fewer than 10 digits while the user is still typing). Formatting for
// display is derived here and never leaves this component.
const props = defineProps({
  modelValue: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

defineOptions({ inheritAttrs: false })

const inputRef = ref(null)
const displayValue = ref(formatPhoneProgressive(props.modelValue))

watch(
  () => props.modelValue,
  (val) => {
    // Keep the display in sync when the parent sets/resets the value
    // externally (e.g. loading an existing phone number into edit mode).
    if (normalizePhone(displayValue.value) !== normalizePhone(val || '')) {
      displayValue.value = formatPhoneProgressive(val || '')
    }
  },
)

// Block any keystroke that isn't a digit or an editing/navigation key —
// stops "+", "-", "(", ")", letters, etc. from ever reaching the field.
function onKeydown(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return
  const allowed = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
  ]
  if (allowed.includes(e.key)) return
  if (!/^\d$/.test(e.key)) {
    e.preventDefault()
  }
}

function onInput(e) {
  const input = e.target
  const cursor = input.selectionStart ?? input.value.length

  const { digits, formatted, cursor: newCursor } = nextPhoneInputState({
    prevFormatted: displayValue.value,
    rawValue: input.value,
    cursor,
    inputType: e.inputType,
  })

  displayValue.value = formatted
  emit('update:modelValue', digits)

  nextTick(() => {
    inputRef.value?.setSelectionRange(newCursor, newCursor)
  })
}
</script>
