<template>
  <div class="max-w-2xl mx-auto">
    <div class="flex items-center gap-3 mb-6">
      <RouterLink :to="backTo" class="text-gray-400 hover:text-gray-600 text-sm">
        {{ isEdit ? '← Client' : '← Clients' }}
      </RouterLink>
      <h2 class="text-xl font-bold text-gray-800">{{ isEdit ? 'Edit Client' : 'Add Client' }}</h2>
    </div>

    <form @submit.prevent="submit" class="bg-white rounded-xl shadow-sm p-6 space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name[0] }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          v-model="form.email"
          type="email"
          class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email[0] }}</p>
      </div>

      <!-- Phone numbers table -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Phone Numbers</label>

        <div class="border border-gray-200 rounded-md overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th class="text-left px-3 py-2 w-32">Type</th>
                <th class="text-left px-3 py-2">Phone Number</th>
                <th class="px-3 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(row, i) in phones" :key="i">
                <td class="px-3 py-2 align-top">
                  <select
                    v-model="row.type"
                    class="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="mobile">Mobile</option>
                    <option value="office">Office</option>
                    <option value="fax">Fax</option>
                    <option value="home">Home</option>
                    <option value="other">Other</option>
                  </select>
                </td>
                <td class="px-3 py-2 align-top">
                  <PhoneInput
                    v-model="row.phone"
                    placeholder="(555) 123-4567"
                    class="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p v-if="errors[`phones.${i}.phone`]" class="text-xs text-red-600 mt-1">
                    {{ errors[`phones.${i}.phone`][0] }}
                  </p>
                </td>
                <td class="px-3 py-2 align-top text-right">
                  <button
                    type="button"
                    @click="removePhoneRow(i)"
                    class="text-gray-400 hover:text-red-600 text-sm"
                    title="Remove"
                  >
                    ✕
                  </button>
                </td>
              </tr>
              <tr v-if="!phones.length">
                <td colspan="3" class="px-3 py-4 text-center text-gray-400 text-sm">No phone numbers added.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          type="button"
          @click="addPhoneRow"
          class="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          + Add Phone Number
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Client Type <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.type"
            required
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="both">Buyer + Seller</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
          <select
            v-model="form.source"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">None / Unknown</option>
            <option>Referral</option>
            <option>Website</option>
            <option>Social Media</option>
            <option>Cold Call</option>
            <option>Open House</option>
            <option>Zillow</option>
            <option>Realtor.com</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <!-- Preferences & Qualification -->
      <div class="bg-white rounded-xl shadow-sm p-6 space-y-4 border border-gray-200">
        <div>
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Preferences & Qualification
          </h3>
          <p class="text-xs text-gray-400 mt-0.5">
            Optional — helps track buyer readiness and seller timeline.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="budget-min" class="block text-sm font-medium text-gray-700 mb-1.5">Budget Min ($)</label>
            <input
              id="budget-min"
              v-model="form.budget_min"
              type="number"
              min="0"
              step="1000"
              placeholder="e.g. 400000"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p v-if="errors.budget_min" class="text-xs text-red-600 mt-1">{{ errors.budget_min[0] }}</p>
          </div>
          <div>
            <label for="budget-max" class="block text-sm font-medium text-gray-700 mb-1.5">Budget Max ($)</label>
            <input
              id="budget-max"
              v-model="form.budget_max"
              type="number"
              min="0"
              step="1000"
              placeholder="e.g. 650000"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p v-if="errors.budget_max" class="text-xs text-red-600 mt-1">{{ errors.budget_max[0] }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="pre-approval" class="block text-sm font-medium text-gray-700 mb-1.5">Pre-Approval ($)</label>
            <input
              id="pre-approval"
              v-model="form.pre_approval_amount"
              type="number"
              min="0"
              step="1000"
              placeholder="e.g. 600000"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p v-if="errors.pre_approval_amount" class="text-xs text-red-600 mt-1">
              {{ errors.pre_approval_amount[0] }}
            </p>
          </div>
          <div>
            <label for="preferred-contact" class="block text-sm font-medium text-gray-700 mb-1.5">
              Preferred Contact
            </label>
            <select
              id="preferred-contact"
              v-model="form.preferred_contact"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Not specified</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="text">Text</option>
            </select>
          </div>
          <div>
            <label for="timeline" class="block text-sm font-medium text-gray-700 mb-1.5">Timeline</label>
            <select
              id="timeline"
              v-model="form.timeline"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Not specified</option>
              <option value="asap">ASAP</option>
              <option value="1_3_months">1–3 Months</option>
              <option value="3_6_months">3–6 Months</option>
              <option value="6_12_months">6–12 Months</option>
              <option value="12_plus_months">12+ Months</option>
            </select>
          </div>
        </div>
      </div>

      <p v-if="submitError" class="text-sm text-red-600">{{ submitError }}</p>

      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          :disabled="loading"
          class="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Saving...' : isEdit ? 'Update Client' : 'Add Client' }}
        </button>
        <RouterLink :to="backTo" class="px-6 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
          Cancel
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useClientStore } from '@/stores/client'
import { isValidPhone } from '@/lib/phone'
import PhoneInput from '@/components/PhoneInput.vue'

const props = defineProps({ id: String })
const router = useRouter()
const route = useRoute()
const store = useClientStore()

const isEdit = computed(() => !!props.id)

// An explicit ?back= wins; otherwise edit mode returns to the client being
// edited. Only same-origin paths are honoured so the param can't redirect off-site.
const backTo = computed(() => {
  const back = route.query.back
  if (typeof back === 'string' && back.startsWith('/')) return back
  return props.id ? `/clients/${props.id}` : '/clients'
})
const loading = ref(false)
const submitError = ref('')
const errors = ref({})
const phones = ref([])

const form = reactive({
  name: '',
  email: '',
  type: 'buyer',
  source: '',
  budget_min: '',
  budget_max: '',
  preferred_contact: '',
  timeline: '',
  pre_approval_amount: '',
})

onMounted(async () => {
  if (isEdit.value) {
    const c = await store.fetchClient(props.id)
    Object.assign(form, {
      name: c.name,
      email: c.email ?? '',
      type: c.type,
      source: c.source ?? '',
      budget_min: c.budget_min ?? '',
      budget_max: c.budget_max ?? '',
      preferred_contact: c.preferred_contact ?? '',
      timeline: c.timeline ?? '',
      pre_approval_amount: c.pre_approval_amount ?? '',
    })
    phones.value = (c.phones ?? []).map((p) => ({ type: p.type, phone: p.phone }))
  } else {
    phones.value = [{ type: 'mobile', phone: '' }]
  }
})

function addPhoneRow() {
  phones.value.push({ type: 'mobile', phone: '' })
}

function removePhoneRow(i) {
  phones.value.splice(i, 1)
}

async function submit() {
  loading.value = true
  submitError.value = ''
  errors.value = {}

  const invalidIndex = phones.value.findIndex((p) => p.phone.trim() !== '' && !isValidPhone(p.phone))
  if (invalidIndex !== -1) {
    errors.value = { [`phones.${invalidIndex}.phone`]: ['Enter a valid 10-digit US phone number.'] }
    submitError.value = 'Please fix the phone number(s) below.'
    loading.value = false
    return
  }

  const filledPhones = phones.value.filter((p) => p.phone.trim() !== '')

  const payload = { ...form }
  if (!payload.email) delete payload.email
  if (!payload.source) delete payload.source
  // Empty strings fail the numeric / enum rules, so drop unset optionals.
  for (const key of ['budget_min', 'budget_max', 'preferred_contact', 'timeline', 'pre_approval_amount']) {
    if (payload[key] === '' || payload[key] === null) delete payload[key]
  }
  payload.phones = filledPhones.map((p) => ({ type: p.type, phone: p.phone }))

  try {
    if (isEdit.value) {
      await store.updateClient(props.id, payload)
    } else {
      await store.createClient(payload)
    }
    router.push(backTo.value)
  } catch (e) {
    if (e.response?.status === 422) errors.value = e.response.data.errors ?? {}
    submitError.value = e.response?.data?.message || 'Something went wrong.'
  } finally {
    loading.value = false
  }
}
</script>
