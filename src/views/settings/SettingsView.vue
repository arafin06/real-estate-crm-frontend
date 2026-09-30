<template>
  <div class="max-w-3xl space-y-5 pb-6">
    <!-- Success / cancelled banner from the Stripe redirect -->
    <Transition name="st-fade">
      <div
        v-if="banner"
        :class="[
          'flex items-start gap-3 rounded-2xl border px-4 py-3.5',
          banner.tone === 'success'
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-amber-50 border-amber-200',
        ]"
        role="status"
      >
        <span
          :class="[
            'w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5',
            banner.tone === 'success' ? 'bg-emerald-500' : 'bg-amber-500',
          ]"
        >
          <svg
            v-if="banner.tone === 'success'"
            class="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <svg v-else class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0 3.75h.007" />
          </svg>
        </span>
        <div class="flex-1 min-w-0">
          <p
            :class="[
              'text-sm font-semibold',
              banner.tone === 'success' ? 'text-emerald-800' : 'text-amber-800',
            ]"
          >
            {{ banner.title }}
          </p>
          <p :class="['text-xs mt-0.5', banner.tone === 'success' ? 'text-emerald-700' : 'text-amber-700']">
            {{ banner.body }}
          </p>
        </div>
        <button
          type="button"
          @click="banner = null"
          aria-label="Dismiss"
          :class="[
            'p-1 rounded-lg shrink-0 transition-colors',
            banner.tone === 'success'
              ? 'text-emerald-500 hover:bg-emerald-100'
              : 'text-amber-500 hover:bg-amber-100',
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Transition>

    <!-- ─── Pill tabs ──────────────────────────────────── -->
    <div class="inline-flex gap-1 p-1 bg-slate-100 rounded-xl" role="tablist" aria-label="Settings sections">
      <button
        v-for="t in TABS"
        :key="t.key"
        :id="`tab-${t.key}`"
        role="tab"
        type="button"
        :aria-selected="tab === t.key"
        :aria-controls="`panel-${t.key}`"
        :tabindex="tab === t.key ? 0 : -1"
        @click="tab = t.key"
        @keydown="onTabKeydown"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
          tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800',
        ]"
      >
        {{ t.label }}
      </button>
    </div>

    <!-- ─── Profile ────────────────────────────────────── -->
    <section
      v-show="tab === 'profile'"
      id="panel-profile"
      role="tabpanel"
      aria-labelledby="tab-profile"
      class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div class="px-6 py-5 border-b border-gray-100">
        <h3 class="text-sm font-bold text-slate-800">Profile</h3>
        <p class="text-xs text-slate-400 mt-0.5">How you appear across the CRM.</p>
      </div>

      <form class="px-6 py-5 space-y-5" @submit.prevent="saveProfile">
        <!-- Avatar -->
        <div class="flex items-center gap-5">
          <button
            type="button"
            @click="avatarInput?.click()"
            :aria-label="avatarPreview ? 'Change profile photo' : 'Upload profile photo'"
            class="relative w-20 h-20 rounded-full overflow-hidden shrink-0 group
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <img v-if="avatarPreview" :src="avatarPreview" alt="" class="w-full h-full object-cover" />
            <span
              v-else
              class="w-full h-full bg-slate-200 text-slate-500 text-xl font-bold flex items-center justify-center"
            >
              {{ initials }}
            </span>

            <!-- Hover overlay -->
            <span
              class="absolute inset-0 bg-slate-900/55 text-white flex flex-col items-center justify-center gap-0.5
                     opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
              <span class="text-[10px] font-semibold">Change</span>
            </span>

            <!-- Uploading spinner -->
            <span
              v-if="avatarBusy"
              class="absolute inset-0 bg-white/70 flex items-center justify-center"
            >
              <span class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
            </span>
          </button>

          <div class="min-w-0">
            <p class="text-sm font-semibold text-slate-800">Profile photo</p>
            <p class="text-xs text-slate-400 mt-0.5">JPG, PNG or WebP, up to 2&nbsp;MB.</p>
            <p v-if="avatarError" class="text-xs text-rose-600 font-medium mt-1.5">{{ avatarError }}</p>
          </div>

          <input
            ref="avatarInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            class="sr-only"
            @change="onAvatarPicked"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="profile-name" class="block text-xs font-semibold text-slate-500 mb-1.5">Name</label>
            <input
              id="profile-name"
              v-model="profile.name"
              type="text"
              :class="fieldClass(profileErrors.name)"
              :aria-invalid="!!profileErrors.name"
            />
            <p v-if="profileErrors.name" class="text-xs text-rose-600 mt-1">{{ profileErrors.name[0] }}</p>
          </div>

          <div>
            <label for="profile-email" class="block text-xs font-semibold text-slate-500 mb-1.5">Email</label>
            <input
              id="profile-email"
              v-model="profile.email"
              type="email"
              :class="fieldClass(profileErrors.email)"
              :aria-invalid="!!profileErrors.email"
            />
            <p v-if="profileErrors.email" class="text-xs text-rose-600 mt-1">{{ profileErrors.email[0] }}</p>
          </div>

          <div class="sm:col-span-2 sm:max-w-xs">
            <label for="profile-phone" class="block text-xs font-semibold text-slate-500 mb-1.5">Phone</label>
            <PhoneInput
              id="profile-phone"
              v-model="profile.phone"
              :class="fieldClass(profileErrors.phone)"
              :aria-invalid="!!profileErrors.phone"
            />
            <p v-if="profileErrors.phone" class="text-xs text-rose-600 mt-1">{{ profileErrors.phone[0] }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3 pt-1">
          <button
            type="submit"
            :disabled="profileBusy"
            class="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700
                   disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm shadow-blue-600/25
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            {{ profileBusy ? 'Saving…' : 'Save changes' }}
          </button>
          <Transition name="st-fade">
            <p v-if="profileSaved" class="text-xs font-semibold text-emerald-600">Profile updated</p>
          </Transition>
        </div>
      </form>
    </section>

    <!-- ─── Security ───────────────────────────────────── -->
    <section
      v-show="tab === 'security'"
      id="panel-security"
      role="tabpanel"
      aria-labelledby="tab-security"
      class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div class="px-6 py-5 border-b border-gray-100">
        <h3 class="text-sm font-bold text-slate-800">Password</h3>
        <p class="text-xs text-slate-400 mt-0.5">Use at least 8 characters.</p>
      </div>

      <form class="px-6 py-5 space-y-4 max-w-sm" @submit.prevent="savePassword">
        <div>
          <label for="pw-current" class="block text-xs font-semibold text-slate-500 mb-1.5">Current password</label>
          <input
            id="pw-current"
            v-model="password.current_password"
            type="password"
            autocomplete="current-password"
            :class="fieldClass(passwordErrors.current_password)"
            :aria-invalid="!!passwordErrors.current_password"
          />
          <p v-if="passwordErrors.current_password" class="text-xs text-rose-600 mt-1">
            {{ passwordErrors.current_password[0] }}
          </p>
        </div>

        <div>
          <label for="pw-new" class="block text-xs font-semibold text-slate-500 mb-1.5">New password</label>
          <input
            id="pw-new"
            v-model="password.new_password"
            type="password"
            autocomplete="new-password"
            :class="fieldClass(passwordErrors.new_password)"
            :aria-invalid="!!passwordErrors.new_password"
          />
          <p v-if="passwordErrors.new_password" class="text-xs text-rose-600 mt-1">
            {{ passwordErrors.new_password[0] }}
          </p>
        </div>

        <div>
          <label for="pw-confirm" class="block text-xs font-semibold text-slate-500 mb-1.5">
            Confirm new password
          </label>
          <input
            id="pw-confirm"
            v-model="password.new_password_confirmation"
            type="password"
            autocomplete="new-password"
            :class="fieldClass(null)"
          />
        </div>

        <div class="flex items-center gap-3 pt-1">
          <button
            type="submit"
            :disabled="passwordBusy"
            class="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700
                   disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm shadow-blue-600/25
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            {{ passwordBusy ? 'Saving…' : 'Update password' }}
          </button>
          <Transition name="st-fade">
            <p v-if="passwordSaved" class="text-xs font-semibold text-emerald-600">Password updated</p>
          </Transition>
        </div>
      </form>
    </section>

    <!-- ─── Subscription ───────────────────────────────── -->
    <section
      v-show="tab === 'subscription'"
      id="panel-subscription"
      role="tabpanel"
      aria-labelledby="tab-subscription"
      class="space-y-5"
    >
      <!-- PRO -->
      <div
        v-if="plan === 'pro'"
        class="rounded-2xl overflow-hidden shadow-sm bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
      >
        <div class="px-6 py-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <span class="inline-block text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                Pro
              </span>
              <h3 class="text-xl font-semibold tracking-tight mt-2.5">Pro Plan Active</h3>
              <p class="text-sm text-blue-100 mt-1">
                Unlimited listings. Billing is managed securely by Stripe.
              </p>
            </div>
            <span class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </span>
          </div>

          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2 mt-5">
            <li v-for="feature in PRO_FEATURES" :key="feature" class="flex items-start gap-2 text-sm text-blue-50">
              <svg
                class="w-3.5 h-3.5 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {{ feature }}
            </li>
          </ul>

          <button
            type="button"
            @click="manageBilling"
            :disabled="billingBusy"
            class="mt-6 bg-white text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50
                   disabled:opacity-60 disabled:cursor-not-allowed transition-colors
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
          >
            {{ billingBusy ? 'Opening…' : 'Manage billing' }}
          </button>
          <p v-if="billingError" class="text-xs text-blue-100 font-medium mt-2">{{ billingError }}</p>
        </div>
      </div>

      <!-- INACTIVE -->
      <div v-else-if="plan === 'inactive'" class="bg-white rounded-2xl shadow-sm border border-rose-200 overflow-hidden">
        <div class="px-6 py-6">
          <div class="flex items-start gap-3">
            <span class="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </span>
            <div class="flex-1 min-w-0">
              <span class="inline-block text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md">
                Inactive
              </span>
              <h3 class="text-base font-semibold text-slate-900 mt-2">Your last payment failed</h3>
              <p class="text-sm text-slate-500 mt-1 leading-relaxed">
                We couldn't charge your card, so your Pro subscription is paused. Update your payment
                method to restore unlimited listings.
              </p>

              <div class="flex flex-wrap items-center gap-2 mt-4">
                <button
                  type="button"
                  @click="manageBilling"
                  :disabled="billingBusy"
                  class="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700
                         disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm shadow-blue-600/25
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  {{ billingBusy ? 'Opening…' : 'Reactivate' }}
                </button>
                <span class="text-xs text-slate-400">Opens the Stripe billing portal</span>
              </div>
              <p v-if="billingError" class="text-xs text-rose-600 font-medium mt-2">{{ billingError }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- FREE -->
      <template v-else>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <span class="inline-block text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                  Free
                </span>
                <h3 class="text-base font-semibold text-slate-900 mt-2.5">Free plan</h3>
                <p class="text-sm text-slate-500 mt-1">
                  Up to {{ FREE_LISTING_LIMIT }} property listings.
                </p>
              </div>
            </div>

            <!-- Usage -->
            <div class="mt-5">
              <div class="flex items-baseline justify-between mb-1.5">
                <p class="text-xs font-semibold text-slate-500">
                  <template v-if="listingsUsed === null">Checking usage…</template>
                  <template v-else>{{ listingsUsed }} of {{ FREE_LISTING_LIMIT }} listings used</template>
                </p>
                <p v-if="listingsUsed !== null && atLimit" class="text-xs font-semibold text-rose-600">
                  Limit reached
                </p>
              </div>
              <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  :class="[
                    'h-full rounded-full transition-all duration-700 ease-out',
                    atLimit ? 'bg-rose-500' : 'bg-blue-500',
                  ]"
                  :style="{ width: usagePct + '%' }"
                ></div>
              </div>
              <p v-if="listingsUsed !== null && atLimit" class="text-xs text-slate-400 mt-1.5">
                Delete a listing or upgrade to add more.
              </p>
            </div>
          </div>
        </div>

        <!-- Upgrade card -->
        <div class="rounded-2xl overflow-hidden shadow-sm bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
          <div class="px-6 py-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-xl font-semibold tracking-tight">Upgrade to Pro</h3>
                <p class="text-sm text-blue-100 mt-1">Everything unlocked, cancel any time.</p>
              </div>
              <p class="text-right shrink-0">
                <span class="text-2xl font-bold">$29</span>
                <span class="block text-xs text-blue-200">per month</span>
              </p>
            </div>

            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2 mt-5">
              <li v-for="feature in PRO_FEATURES" :key="feature" class="flex items-start gap-2 text-sm text-blue-50">
                <svg
                  class="w-3.5 h-3.5 mt-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {{ feature }}
              </li>
            </ul>

            <button
              type="button"
              @click="upgrade"
              :disabled="billingBusy"
              class="mt-6 w-full sm:w-auto bg-white text-blue-700 px-5 py-2.5 rounded-xl text-sm font-semibold
                     hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
            >
              {{ billingBusy ? 'Redirecting…' : 'Upgrade to Pro — $29/month' }}
            </button>
            <p v-if="billingError" class="text-xs text-blue-100 font-medium mt-2">{{ billingError }}</p>
            <p class="text-xs text-blue-200 mt-3">Secure checkout by Stripe. Cancel any time.</p>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSubscriptionStore } from '@/stores/subscription'
import PhoneInput from '@/components/PhoneInput.vue'
import api from '@/lib/axios'
import { PRO_FEATURES, FREE_LISTING_LIMIT } from '@/lib/plans'

const auth = useAuthStore()
const subscription = useSubscriptionStore()
const route = useRoute()
const router = useRouter()

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'security', label: 'Security' },
  { key: 'subscription', label: 'Subscription' },
]

const tab = ref('profile')
const banner = ref(null)

const plan = computed(() => auth.user?.subscription_status ?? 'free')
const initials = computed(() => {
  const name = auth.user?.name?.trim()
  if (!name) return '?'
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
})

// ─── Profile ───────────────────────────────────────────
const profile = reactive({ name: '', email: '', phone: '' })
const profileErrors = ref({})
const profileBusy = ref(false)
const profileSaved = ref(false)

const avatarInput = ref(null)
const avatarBusy = ref(false)
const avatarError = ref('')
const localAvatar = ref(null)

const avatarPreview = computed(() => localAvatar.value ?? auth.user?.avatar_url ?? null)

function hydrate() {
  profile.name = auth.user?.name ?? ''
  profile.email = auth.user?.email ?? ''
  profile.phone = auth.user?.phone ?? ''
}

function fieldClass(errors) {
  return [
    'w-full rounded-xl px-3 py-2 text-sm text-slate-800 bg-white border transition-colors',
    'focus:outline-none focus:ring-2 focus:border-transparent',
    errors
      ? 'border-rose-300 focus:ring-rose-500'
      : 'border-gray-200 hover:border-gray-300 focus:ring-blue-500',
  ]
}

async function saveProfile() {
  profileBusy.value = true
  profileErrors.value = {}
  profileSaved.value = false
  try {
    await auth.updateProfile({
      name: profile.name,
      email: profile.email,
      phone: profile.phone || null,
    })
    hydrate()
    flash(profileSaved)
  } catch (e) {
    profileErrors.value = e.response?.data?.errors ?? {}
  } finally {
    profileBusy.value = false
  }
}

async function onAvatarPicked(e) {
  const file = e.target.files?.[0]
  if (!file) return

  avatarError.value = ''

  // Show the picked image straight away rather than waiting on the round trip.
  const objectUrl = URL.createObjectURL(file)
  const previous = localAvatar.value
  localAvatar.value = objectUrl
  avatarBusy.value = true

  const form = new FormData()
  form.append('avatar', file)

  try {
    await auth.updateAvatar(form)
    // The server URL is now authoritative; drop the local blob.
    localAvatar.value = null
    URL.revokeObjectURL(objectUrl)
  } catch (err) {
    localAvatar.value = previous
    URL.revokeObjectURL(objectUrl)
    avatarError.value = err.response?.data?.errors?.avatar?.[0] ?? 'Could not upload that image.'
  } finally {
    avatarBusy.value = false
    e.target.value = ''
  }
}

// ─── Security ──────────────────────────────────────────
const password = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
})
const passwordErrors = ref({})
const passwordBusy = ref(false)
const passwordSaved = ref(false)

async function savePassword() {
  passwordBusy.value = true
  passwordErrors.value = {}
  passwordSaved.value = false
  try {
    await auth.updatePassword({ ...password })
    password.current_password = ''
    password.new_password = ''
    password.new_password_confirmation = ''
    flash(passwordSaved)
  } catch (e) {
    passwordErrors.value = e.response?.data?.errors ?? {}
  } finally {
    passwordBusy.value = false
  }
}

// ─── Subscription ──────────────────────────────────────
const billingBusy = ref(false)
const billingError = ref('')
const listingsUsed = ref(null)

const usagePct = computed(() => {
  if (listingsUsed.value === null) return 0
  return Math.min(100, Math.round((listingsUsed.value / FREE_LISTING_LIMIT) * 100))
})

const atLimit = computed(() => (listingsUsed.value ?? 0) >= FREE_LISTING_LIMIT)

async function fetchUsage() {
  try {
    // per_page=1 — we only want the total from the paginator.
    const { data } = await api.get('/properties', { params: { per_page: 1 } })
    listingsUsed.value = data.total ?? 0
  } catch {
    listingsUsed.value = 0
  }
}

async function upgrade() {
  billingBusy.value = true
  billingError.value = ''
  try {
    await subscription.createCheckoutSession()
  } catch {
    billingError.value = subscription.error
    billingBusy.value = false
  }
}

async function manageBilling() {
  billingBusy.value = true
  billingError.value = ''
  try {
    await subscription.openCustomerPortal()
  } catch {
    billingError.value = subscription.error
    billingBusy.value = false
  }
}

// ─── Misc ──────────────────────────────────────────────
function flash(flagRef) {
  flagRef.value = true
  setTimeout(() => {
    flagRef.value = false
  }, 2500)
}

function onTabKeydown(e) {
  const i = TABS.findIndex((t) => t.key === tab.value)
  let next = null
  if (e.key === 'ArrowRight') next = (i + 1) % TABS.length
  if (e.key === 'ArrowLeft') next = (i - 1 + TABS.length) % TABS.length
  if (e.key === 'Home') next = 0
  if (e.key === 'End') next = TABS.length - 1
  if (next === null) return
  e.preventDefault()
  tab.value = TABS[next].key
  document.getElementById(`tab-${TABS[next].key}`)?.focus()
}

watch(plan, (v) => {
  if (v === 'free') fetchUsage()
})

onMounted(async () => {
  hydrate()

  const flag = route.query.subscription

  if (flag) {
    tab.value = 'subscription'

    banner.value =
      flag === 'success'
        ? {
            tone: 'success',
            title: 'Welcome to Pro!',
            body: 'Your subscription is active. Listings are now unlimited.',
          }
        : {
            tone: 'warning',
            title: 'Checkout cancelled',
            body: 'No charge was made. You can upgrade whenever you are ready.',
          }

    // Clear the query so a refresh doesn't replay the banner.
    router.replace({ query: {} })
  }

  // The webhook updates the plan server-side, so re-read the user rather than
  // trusting whatever localStorage held before checkout.
  try {
    await auth.fetchUser()
    hydrate()
  } catch {
    // Non-fatal — fall back to the cached user.
  }

  if (plan.value === 'free') fetchUsage()
})
</script>

<style scoped>
.st-fade-enter-active,
.st-fade-leave-active {
  transition: opacity 0.2s ease;
}
.st-fade-enter-from,
.st-fade-leave-to {
  opacity: 0;
}
</style>
