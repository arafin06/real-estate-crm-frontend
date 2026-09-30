/**
 * Single source of truth for phone number normalization, validation, and
 * display formatting on the frontend. Mirrors app/Support/PhoneNumber.php —
 * storage is always digits-only (10-digit US numbers), formatting for
 * display/tel: links is derived from that, never stored.
 */

/** Strip everything but digits, dropping a leading US country code (1). */
export function normalizePhone(raw) {
  if (!raw) return ''
  let digits = String(raw).replace(/\D+/g, '')
  if (digits.length === 11 && digits.startsWith('1')) {
    digits = digits.slice(1)
  }
  return digits
}

/** A normalized value is valid only if it's a standard 10-digit US number. */
export function isValidPhone(raw) {
  return normalizePhone(raw).length === 10
}

/** (XXX) XXX-XXXX for a valid 10-digit number; falls back to raw digits otherwise. */
export function formatPhone(raw) {
  const digits = normalizePhone(raw)
  if (!digits) return ''
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return digits
}

export function phoneTelLink(raw) {
  const digits = normalizePhone(raw)
  return digits ? `tel:${digits}` : ''
}

/**
 * Formats however many digits are currently present, the way a live phone
 * input should look mid-keystroke: "8" -> "8", "8553" -> "(855) 3",
 * "8553659" -> "(855) 365-9", "8553659200" -> "(855) 365-9200".
 */
export function formatPhoneProgressive(raw) {
  const digits = normalizePhone(raw).slice(0, 10)
  const len = digits.length

  if (len === 0) return ''
  if (len < 4) return digits
  if (len < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

/**
 * Pure state-transition function for a live-formatted phone <input>.
 * Given what was on screen before this edit, what the browser's native
 * editing just produced, and where the cursor landed, it returns the
 * digits-only value, the reformatted display string, and where the cursor
 * should end up — so typing, pasting, and backspacing over a "(", ")",
 * space or "-" all feel natural instead of getting stuck on the separator.
 *
 * `inputType` is the native InputEvent#inputType ('deleteContentBackward',
 * 'deleteContentForward', 'insertText', 'insertFromPaste', ...).
 */
export function nextPhoneInputState({ prevFormatted = '', rawValue = '', cursor = rawValue.length, inputType = '' }) {
  let value = rawValue

  const isSingleCharDeletion =
    (inputType === 'deleteContentBackward' || inputType === 'deleteContentForward') &&
    value.length === prevFormatted.length - 1

  if (isSingleCharDeletion) {
    const deletedChar = prevFormatted[cursor]
    // A separator character carries no digit of its own — deleting it should
    // remove the adjacent real digit instead, or the field feels stuck.
    if (deletedChar && !/\d/.test(deletedChar)) {
      value =
        inputType === 'deleteContentBackward'
          ? value.slice(0, cursor - 1) + value.slice(cursor)
          : value.slice(0, cursor) + value.slice(cursor + 1)
    }
  }

  const digitsBeforeCursor = value.slice(0, cursor).replace(/\D/g, '').length
  const digits = normalizePhone(value).slice(0, 10)
  const formatted = formatPhoneProgressive(digits)

  let newCursor = formatted.length
  let count = 0
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) count++
    if (count === digitsBeforeCursor) {
      newCursor = i + 1
      break
    }
  }
  if (digitsBeforeCursor === 0) newCursor = 0

  return { digits, formatted, cursor: newCursor }
}
