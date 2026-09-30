<template>
  <div v-if="!loaded" class="flex items-center justify-center py-24">
    <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>

  <div v-else class="max-w-full space-y-5">
    <!-- ── Hero Header ────────────────────────────────── -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div :class="typeGradient(client.type)" class="h-2"></div>

      <div class="px-6 py-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <!-- Left: Avatar + name -->
        <div class="flex items-center gap-4 min-w-0">
          <div
            :class="typeAvatarBg(client.type)"
            class="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shrink-0 shadow-lg"
          >
            {{ client.name.charAt(0).toUpperCase() }}
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-2xl font-black text-gray-900">{{ client.name }}</h1>
              <span :class="typeClass(client.type)" class="text-xs font-bold px-2.5 py-1 rounded-full">
                {{ typeLabel(client.type) }}
              </span>
              <span v-if="client.source" class="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                via {{ client.source }}
              </span>
            </div>
            <div class="flex items-center gap-4 mt-1.5 text-sm text-gray-500 flex-wrap">
              <a
                v-if="client.email"
                :href="`mailto:${client.email}`"
                class="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                {{ client.email }}
              </a>
              <a
                v-if="primaryPhone"
                :href="primaryPhone.tel_link"
                class="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                {{ primaryPhone.formatted }}
              </a>
              <span class="flex items-center gap-1 text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5"
                  />
                </svg>
                Client since {{ formatDate(client.created_at) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            @click="notesOpen = true"
            class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12" />
            </svg>
            Notes
            <span
              v-if="client.notes?.length"
              class="bg-slate-300 text-slate-700 text-xs font-bold px-1.5 py-0.5 rounded-full leading-none"
            >
              {{ client.notes.length }}
            </span>
          </button>
          <button
            type="button"
            @click="taskCreateOpen = true"
            class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Task
          </button>
          <RouterLink
            :to="`/deals/create?client_id=${client.id}`"
            class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-xl transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Deal
          </RouterLink>
          <RouterLink
            :to="`/clients/${client.id}/edit?back=/clients/${client.id}`"
            class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm shadow-blue-600/25"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
              />
            </svg>
            Edit
          </RouterLink>
        </div>
      </div>

      <!-- ── Stats bar ────────────────────────────────── -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-0 border-t border-gray-100 divide-x divide-gray-100">
        <div class="px-5 py-3.5 text-center">
          <p class="text-xl font-black text-violet-600">{{ client.deals?.length ?? 0 }}</p>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-0.5">Deals</p>
        </div>
        <div class="px-5 py-3.5 text-center">
          <p class="text-xl font-black text-emerald-600">${{ formatCompact(totalDealValue) }}</p>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-0.5">Pipeline</p>
        </div>
        <div class="px-5 py-3.5 text-center">
          <p class="text-xl font-black text-amber-600">{{ openTaskCount }}</p>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-0.5">Open Tasks</p>
        </div>
        <div class="px-5 py-3.5 text-center">
          <p class="text-xl font-black text-slate-700">{{ client.notes?.length ?? 0 }}</p>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-0.5">Notes</p>
        </div>
        <div class="px-5 py-3.5 text-center">
          <p :class="['text-xl font-black', client.pre_approval_amount ? 'text-blue-600' : 'text-gray-300']">
            {{ client.pre_approval_amount ? '$' + formatCompact(client.pre_approval_amount) : '—' }}
          </p>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-0.5">Pre-Approved</p>
        </div>
      </div>
    </div>

    <!-- ── Main Grid ───────────────────────────────────── -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <!-- ── Left Column ─────────────────────────────── -->
      <div class="xl:col-span-1 space-y-5">
        <!-- Contact details -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Details</h3>
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75"
                  />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-xs text-gray-400 font-medium">Email</p>
                <a
                  v-if="client.email"
                  :href="`mailto:${client.email}`"
                  class="text-sm text-blue-600 hover:underline font-medium break-all"
                >
                  {{ client.email }}
                </a>
                <p v-else class="text-sm text-gray-400">Not provided</p>
              </div>
            </div>

            <div v-if="client.preferred_contact" class="flex items-start gap-3">
              <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400 font-medium">Preferred Contact</p>
                <p class="text-sm font-medium text-gray-700 capitalize">{{ client.preferred_contact }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Phone numbers (managed inline) -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Numbers</h3>
            <span v-if="client.phones?.length" class="text-xs text-gray-400 font-medium">
              {{ client.phones.length }}
            </span>
          </div>

          <div v-if="!client.phones?.length" class="px-6 py-5 text-sm text-gray-400">
            No phone numbers yet.
          </div>

          <ul v-else class="divide-y divide-gray-50">
            <li v-for="p in client.phones" :key="p.id" class="px-6 py-3">
              <template v-if="editingId === p.id">
                <select
                  v-model="editType"
                  aria-label="Phone type"
                  class="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="mobile">Mobile</option>
                  <option value="office">Office</option>
                  <option value="fax">Fax</option>
                  <option value="home">Home</option>
                  <option value="other">Other</option>
                </select>
                <PhoneInput
                  v-model="editPhone"
                  placeholder="(555) 123-4567"
                  aria-label="Phone number"
                  class="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p v-if="editError" class="text-xs text-red-600 mt-1">{{ editError }}</p>
                <div class="flex gap-3 mt-2">
                  <button type="button" @click="saveEdit(p)" class="text-xs text-blue-600 hover:text-blue-700 font-semibold">
                    Save
                  </button>
                  <button type="button" @click="cancelEdit" class="text-xs text-gray-500 hover:text-gray-700 font-semibold">
                    Cancel
                  </button>
                </div>
              </template>

              <template v-else>
                <div class="flex items-center justify-between gap-2 group">
                  <div class="min-w-0">
                    <p class="text-xs text-gray-400 capitalize">{{ p.type }}</p>
                    <a :href="p.tel_link" class="text-sm text-blue-600 hover:underline font-medium">
                      {{ p.formatted }}
                    </a>
                  </div>
                  <div class="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <button type="button" @click="startEdit(p)" class="text-xs text-gray-500 hover:text-blue-600 font-semibold">
                      Edit
                    </button>
                    <button type="button" @click="removePhone(p.id)" class="text-xs text-gray-500 hover:text-red-600 font-semibold">
                      Delete
                    </button>
                  </div>
                </div>
              </template>
            </li>
          </ul>

          <!-- Add phone -->
          <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/50 space-y-2">
            <select
              v-model="newType"
              aria-label="New phone type"
              class="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mobile">Mobile</option>
              <option value="office">Office</option>
              <option value="fax">Fax</option>
              <option value="home">Home</option>
              <option value="other">Other</option>
            </select>
            <PhoneInput
              v-model="newPhone"
              placeholder="(555) 123-4567"
              aria-label="New phone number"
              class="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p v-if="addError" class="text-xs text-red-600">{{ addError }}</p>
            <button
              type="button"
              @click="submitPhone"
              :disabled="!newPhone || addingPhone"
              class="w-full bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {{ addingPhone ? 'Adding...' : '+ Add Phone' }}
            </button>
          </div>
        </div>

        <!-- Buyer profile -->
        <div v-if="client.type === 'buyer' || client.type === 'both'" class="bg-white rounded-2xl shadow-sm p-6">
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Buyer Profile</h3>
          <div class="space-y-3">
            <div v-if="client.budget_min || client.budget_max">
              <p class="text-xs text-gray-400 font-medium mb-1">Budget Range</p>
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-gray-800">
                  {{ client.budget_min ? '$' + Number(client.budget_min).toLocaleString() : 'Any' }}
                </span>
                <span class="text-gray-300">→</span>
                <span class="text-sm font-bold text-gray-800">
                  {{ client.budget_max ? '$' + Number(client.budget_max).toLocaleString() : 'Any' }}
                </span>
              </div>
            </div>

            <div v-if="client.pre_approval_amount">
              <p class="text-xs text-gray-400 font-medium mb-1">Pre-Approved Amount</p>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-sm font-bold text-emerald-600">
                  ${{ Number(client.pre_approval_amount).toLocaleString() }}
                </span>
                <span class="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                  Qualified
                </span>
              </div>
            </div>

            <div v-if="client.timeline">
              <p class="text-xs text-gray-400 font-medium mb-1">Purchase Timeline</p>
              <span class="text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                {{ timelineLabel(client.timeline) }}
              </span>
            </div>

            <div
              v-if="!client.budget_min && !client.budget_max && !client.pre_approval_amount && !client.timeline"
              class="text-sm text-gray-400 py-2"
            >
              No buyer preferences recorded yet.
              <RouterLink :to="`/clients/${client.id}/edit?back=/clients/${client.id}`" class="text-blue-600 hover:underline ml-1">
                Add them →
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Lead info -->
        <div class="bg-white rounded-2xl shadow-sm p-5">
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Lead Information</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between gap-3">
              <span class="text-gray-400">Source</span>
              <span class="font-medium text-gray-700">{{ client.source || 'Unknown' }}</span>
            </div>
            <div class="flex justify-between gap-3 items-center">
              <span class="text-gray-400">Type</span>
              <span :class="typeClass(client.type)" class="font-semibold text-xs px-2 py-0.5 rounded-full">
                {{ typeLabel(client.type) }}
              </span>
            </div>
            <div class="flex justify-between gap-3">
              <span class="text-gray-400">Added</span>
              <span class="font-medium text-gray-700">{{ formatDate(client.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Right / Main Column ─────────────────────── -->
      <div class="xl:col-span-2 space-y-5">
        <!-- Tab bar -->
        <div class="bg-white rounded-2xl shadow-sm p-1.5 flex gap-1" role="tablist" aria-label="Client sections">
          <button
            v-for="tab in TABS"
            :key="tab.key"
            :id="`ctab-${tab.key}`"
            role="tab"
            type="button"
            :aria-selected="activeTab === tab.key"
            :aria-controls="`cpanel-${tab.key}`"
            :tabindex="activeTab === tab.key ? 0 : -1"
            @click="activeTab = tab.key"
            @keydown="onTabKeydown"
            :class="[
              'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              activeTab === tab.key
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
            ]"
          >
            {{ tab.label }}
            <span
              v-if="tab.count !== null && tab.count > 0"
              :class="activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'"
              class="text-xs font-bold px-1.5 py-0.5 rounded-full leading-none"
            >
              {{ tab.count }}
            </span>
          </button>
        </div>

        <!-- Overview -->
        <div v-show="activeTab === 'overview'" id="cpanel-overview" role="tabpanel" aria-labelledby="ctab-overview">
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Client Summary</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              <div>
                <p class="text-gray-400 mb-0.5">Full Name</p>
                <p class="font-semibold text-gray-800">{{ client.name }}</p>
              </div>
              <div>
                <p class="text-gray-400 mb-0.5">Client Type</p>
                <span :class="typeClass(client.type)" class="text-xs font-bold px-2.5 py-1 rounded-full inline-block">
                  {{ typeLabel(client.type) }}
                </span>
              </div>
              <div>
                <p class="text-gray-400 mb-0.5">Lead Source</p>
                <p class="font-semibold text-gray-800">{{ client.source || '—' }}</p>
              </div>
              <div>
                <p class="text-gray-400 mb-0.5">Preferred Contact</p>
                <p class="font-semibold text-gray-800 capitalize">{{ client.preferred_contact || '—' }}</p>
              </div>
              <div v-if="client.budget_min || client.budget_max">
                <p class="text-gray-400 mb-0.5">Budget Range</p>
                <p class="font-semibold text-gray-800">
                  {{ client.budget_min ? '$' + Number(client.budget_min).toLocaleString() : 'Any' }}
                  —
                  {{ client.budget_max ? '$' + Number(client.budget_max).toLocaleString() : 'Any' }}
                </p>
              </div>
              <div v-if="client.pre_approval_amount">
                <p class="text-gray-400 mb-0.5">Pre-Approved</p>
                <p class="font-semibold text-emerald-600">
                  ${{ Number(client.pre_approval_amount).toLocaleString() }}
                </p>
              </div>
              <div v-if="client.timeline">
                <p class="text-gray-400 mb-0.5">Timeline</p>
                <p class="font-semibold text-blue-700">{{ timelineLabel(client.timeline) }}</p>
              </div>
              <div>
                <p class="text-gray-400 mb-0.5">Client Since</p>
                <p class="font-semibold text-gray-800">{{ formatDate(client.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Deals -->
        <div v-show="activeTab === 'deals'" id="cpanel-deals" role="tabpanel" aria-labelledby="ctab-deals">
          <div
            v-if="!client.deals?.length"
            class="bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center py-16"
          >
            <div class="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18"
                />
              </svg>
            </div>
            <p class="text-gray-600 font-semibold">No deals yet</p>
            <p class="text-gray-400 text-sm mt-1">Create a deal and link it to this client.</p>
            <RouterLink
              :to="`/deals/create?client_id=${client.id}`"
              class="mt-4 inline-flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors"
            >
              + New Deal
            </RouterLink>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="deal in client.deals"
              :key="deal.id"
              class="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span :class="stageClass(deal.stage)" class="text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
                      {{ stageLabel(deal.stage) }}
                    </span>
                    <span v-if="deal.expected_close_date" class="text-xs text-gray-400">
                      Close {{ formatDate(deal.expected_close_date) }}
                    </span>
                  </div>
                  <RouterLink
                    :to="`/deals/${deal.id}`"
                    class="text-base font-bold text-gray-800 hover:text-blue-600 transition-colors"
                  >
                    {{ deal.title }}
                  </RouterLink>
                  <p v-if="deal.property" class="text-xs text-gray-400 mt-0.5 truncate">
                    {{ deal.property.title }} · {{ deal.property.city }}, {{ deal.property.state }}
                  </p>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-lg font-black text-gray-800">${{ Number(deal.deal_value).toLocaleString() }}</p>
                  <p class="text-xs text-emerald-600 font-semibold mt-0.5">
                    ${{ Number(deal.commission_amount).toLocaleString() }} comm.
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex justify-between gap-4">
              <div>
                <p class="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Total Pipeline</p>
                <p class="text-xl font-black text-emerald-700 mt-0.5">
                  ${{ Number(totalDealValue).toLocaleString() }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Est. Commission</p>
                <p class="text-xl font-black text-emerald-700 mt-0.5">
                  ${{ Number(totalCommission).toLocaleString() }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tasks -->
        <div v-show="activeTab === 'tasks'" id="cpanel-tasks" role="tabpanel" aria-labelledby="ctab-tasks">
          <div
            v-if="!client.tasks?.length"
            class="bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center py-16"
          >
            <div class="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p class="text-gray-600 font-semibold">No tasks linked</p>
            <p class="text-gray-400 text-sm mt-1">Create a task and link it to this client.</p>
            <button
              type="button"
              @click="taskCreateOpen = true"
              class="mt-4 inline-flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              + New Task
            </button>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="task in client.tasks"
              :key="task.id"
              :class="[
                'bg-white rounded-2xl shadow-sm p-4 flex items-start gap-3 border-l-4',
                task.status === 'complete' || task.status === 'closed'
                  ? 'border-gray-200'
                  : task.is_overdue
                    ? 'border-red-400'
                    : priorityBorder(task.priority),
              ]"
            >
              <div
                :class="[
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5',
                  task.status === 'complete'
                    ? 'bg-green-500 border-green-500'
                    : task.status === 'in_progress'
                      ? 'bg-amber-400 border-amber-400'
                      : task.status === 'closed'
                        ? 'bg-red-400 border-red-400'
                        : 'border-gray-300 bg-white',
                ]"
              >
                <svg
                  v-if="task.status === 'complete'"
                  class="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span v-else-if="task.status === 'in_progress'" class="w-1.5 h-1.5 bg-white rounded-full"></span>
              </div>

              <div class="flex-1 min-w-0">
                <p
                  :class="[
                    'text-sm font-semibold',
                    task.status !== 'incomplete' && task.status !== 'in_progress'
                      ? 'text-gray-400 line-through'
                      : 'text-gray-800',
                  ]"
                >
                  {{ task.title }}
                </p>
                <div class="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span :class="priorityClass(task.priority)" class="text-xs font-semibold px-1.5 py-0.5 rounded-full capitalize">
                    {{ task.priority }}
                  </span>
                  <span :class="dueChipClass(task)" class="text-xs font-medium px-1.5 py-0.5 rounded-full">
                    {{ dueChipText(task) }}
                  </span>
                  <RouterLink
                    v-if="task.deal"
                    :to="`/deals/${task.deal.id}`"
                    class="text-xs text-blue-600 font-medium hover:underline truncate"
                  >
                    {{ task.deal.title }}
                  </RouterLink>
                </div>
              </div>

              <div class="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  @click="openTaskModal(task.id)"
                  class="text-xs text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  View
                </button>
                <RouterLink
                  :to="`/tasks/${task.id}/edit?back=/clients/${client.id}`"
                  class="text-xs text-gray-500 hover:text-blue-600 font-semibold bg-gray-100 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  Edit
                </RouterLink>
                <button
                  type="button"
                  @click="confirmDeleteTask(task.id)"
                  class="text-xs text-gray-500 hover:text-red-600 font-semibold bg-gray-100 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div v-show="activeTab === 'notes'" id="cpanel-notes" role="tabpanel" aria-labelledby="ctab-notes">
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <div class="mb-6">
              <label for="inline-note" class="sr-only">Add a note</label>
              <textarea
                id="inline-note"
                v-model="inlineNote"
                rows="3"
                maxlength="5000"
                placeholder="Log a call, meeting, showing, or any interaction..."
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
              <div class="flex justify-between items-center mt-2">
                <span class="text-xs text-gray-400">{{ inlineNote.length }}/5000</span>
                <button
                  type="button"
                  @click="submitInlineNote"
                  :disabled="!inlineNote.trim() || savingNote"
                  class="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  {{ savingNote ? 'Adding...' : 'Add Note' }}
                </button>
              </div>
            </div>

            <div v-if="!client.notes?.length" class="text-center py-10 text-gray-400">
              <p class="text-sm">No notes yet. Log your first interaction above.</p>
            </div>

            <div v-else class="space-y-1">
              <div v-for="note in client.notes" :key="note.id" class="flex gap-3 group">
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
                    class="bg-gray-50 rounded-xl p-3.5 border border-gray-100 group-hover:border-gray-200 transition-colors"
                  >
                    <div class="flex justify-between items-start mb-2 gap-2">
                      <div class="flex items-center gap-2 min-w-0">
                        <span class="text-xs font-bold text-gray-800 truncate">{{ note.user?.name }}</span>
                        <span class="text-xs text-gray-400 shrink-0">{{ formatDateTime(note.created_at) }}</span>
                      </div>
                      <button
                        type="button"
                        @click="removeClientNote(note.id)"
                        class="text-gray-300 hover:text-red-500 transition-all p-1 rounded text-xs font-medium shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        Delete
                      </button>
                    </div>
                    <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{{ note.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Task Modal -->
  <TaskModal :show="taskModalShow" :task-id="taskModalId" @close="closeTaskModal" @updated="reloadClient" />

  <!-- Quick task creation -->
  <TaskCreateModal
    v-if="client"
    :show="taskCreateOpen"
    :client-id="client.id"
    @close="taskCreateOpen = false"
    @created="onTaskCreated"
  />

  <!-- Note Slide Over -->
  <NoteSlideOver
    v-if="client"
    :show="notesOpen"
    :title="client.name"
    :api-base-path="`/clients/${client.id}`"
    :initial-notes="client.notes ?? []"
    @close="notesOpen = false"
    @note-added="onNoteAdded"
    @note-deleted="onNoteDeleted"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useClientStore } from '@/stores/client'
import { useTaskStore } from '@/stores/task'
import { isValidPhone } from '@/lib/phone'
import PhoneInput from '@/components/PhoneInput.vue'
import TaskModal from '@/components/TaskModal.vue'
import TaskCreateModal from '@/components/TaskCreateModal.vue'
import NoteSlideOver from '@/components/NoteSlideOver.vue'

const props = defineProps({ id: String })
const store = useClientStore()
const taskStore = useTaskStore()
const client = ref(null)
const loaded = ref(false)

const activeTab = ref('overview')
const notesOpen = ref(false)
const taskModalShow = ref(false)
const taskModalId = ref(null)
const taskCreateOpen = ref(false)
const inlineNote = ref('')
const savingNote = ref(false)

// Phone management
const newType = ref('mobile')
const newPhone = ref('')
const addingPhone = ref(false)
const addError = ref('')
const editingId = ref(null)
const editType = ref('mobile')
const editPhone = ref('')
const editError = ref('')

const primaryPhone = computed(() => client.value?.phones?.[0] ?? null)

const openTaskCount = computed(
  () =>
    client.value?.tasks?.filter((t) => t.status === 'incomplete' || t.status === 'in_progress').length ?? 0,
)

const TABS = computed(() => [
  { key: 'overview', label: 'Overview', count: null },
  { key: 'deals', label: 'Deals', count: client.value?.deals?.length ?? 0 },
  { key: 'tasks', label: 'Tasks', count: openTaskCount.value },
  { key: 'notes', label: 'Notes', count: client.value?.notes?.length ?? 0 },
])

const totalDealValue = computed(
  () => client.value?.deals?.reduce((s, d) => s + Number(d.deal_value), 0) ?? 0,
)

const totalCommission = computed(
  () => client.value?.deals?.reduce((s, d) => s + Number(d.commission_amount), 0) ?? 0,
)

onMounted(async () => {
  client.value = await store.fetchClient(props.id)
  loaded.value = true
})

async function reloadClient() {
  client.value = await store.fetchClient(props.id)
}

function openTaskModal(id) {
  taskModalId.value = id
  taskModalShow.value = true
}

function closeTaskModal() {
  taskModalShow.value = false
  taskModalId.value = null
}

async function onTaskCreated() {
  await reloadClient()
  activeTab.value = 'tasks'
}

async function confirmDeleteTask(taskId) {
  if (!confirm('Delete this task?')) return
  await taskStore.deleteTask(taskId)
  await reloadClient()
}

function onTabKeydown(e) {
  const tabs = TABS.value
  const i = tabs.findIndex((t) => t.key === activeTab.value)
  let next = null
  if (e.key === 'ArrowRight') next = (i + 1) % tabs.length
  if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length
  if (e.key === 'Home') next = 0
  if (e.key === 'End') next = tabs.length - 1
  if (next === null) return
  e.preventDefault()
  activeTab.value = tabs[next].key
  document.getElementById(`ctab-${tabs[next].key}`)?.focus()
}

// ─── Notes ───────────────────────────────────────────────────────
async function submitInlineNote() {
  if (!inlineNote.value.trim()) return
  savingNote.value = true
  try {
    const note = await store.addNote(client.value.id, inlineNote.value.trim())
    client.value.notes.unshift(note)
    inlineNote.value = ''
  } finally {
    savingNote.value = false
  }
}

async function removeClientNote(noteId) {
  if (!confirm('Delete this note?')) return
  await store.deleteNote(client.value.id, noteId)
  client.value.notes = client.value.notes.filter((n) => n.id !== noteId)
}

function onNoteAdded(note) {
  client.value.notes.unshift(note)
}

function onNoteDeleted(noteId) {
  client.value.notes = client.value.notes.filter((n) => n.id !== noteId)
}

// ─── Phones ──────────────────────────────────────────────────────
async function submitPhone() {
  if (!newPhone.value) return
  addError.value = ''
  if (!isValidPhone(newPhone.value)) {
    addError.value = 'Enter a valid 10-digit US phone number.'
    return
  }
  addingPhone.value = true
  try {
    const phone = await store.addPhone(client.value.id, { type: newType.value, phone: newPhone.value })
    client.value.phones.push(phone)
    newPhone.value = ''
  } catch (e) {
    addError.value = e.response?.data?.message || 'Could not add phone number.'
  } finally {
    addingPhone.value = false
  }
}

function startEdit(p) {
  editingId.value = p.id
  editType.value = p.type
  editPhone.value = p.phone
  editError.value = ''
}

function cancelEdit() {
  editingId.value = null
  editError.value = ''
}

async function saveEdit(p) {
  editError.value = ''
  if (!isValidPhone(editPhone.value)) {
    editError.value = 'Enter a valid 10-digit US phone number.'
    return
  }
  try {
    const updated = await store.updatePhone(client.value.id, p.id, {
      type: editType.value,
      phone: editPhone.value,
    })
    const i = client.value.phones.findIndex((x) => x.id === p.id)
    if (i !== -1) client.value.phones[i] = updated
    editingId.value = null
  } catch (e) {
    editError.value = e.response?.data?.message || 'Could not update phone number.'
  }
}

async function removePhone(phoneId) {
  if (!confirm('Delete this phone number?')) return
  await store.deletePhone(client.value.id, phoneId)
  client.value.phones = client.value.phones.filter((p) => p.id !== phoneId)
}

// ─── Display helpers ─────────────────────────────────────────────
function typeLabel(t) {
  return { buyer: 'Buyer', seller: 'Seller', both: 'Buyer + Seller' }[t] ?? t
}

function typeClass(t) {
  return (
    {
      buyer: 'bg-blue-100 text-blue-700',
      seller: 'bg-purple-100 text-purple-700',
      both: 'bg-green-100 text-green-700',
    }[t] ?? 'bg-gray-100 text-gray-600'
  )
}

function typeGradient(t) {
  return (
    {
      buyer: 'bg-gradient-to-r from-blue-400 to-blue-600',
      seller: 'bg-gradient-to-r from-purple-400 to-purple-600',
      both: 'bg-gradient-to-r from-green-400 to-emerald-600',
    }[t] ?? 'bg-gray-200'
  )
}

function typeAvatarBg(t) {
  return (
    {
      buyer: 'bg-gradient-to-br from-blue-400 to-blue-700',
      seller: 'bg-gradient-to-br from-purple-400 to-purple-700',
      both: 'bg-gradient-to-br from-green-400 to-emerald-700',
    }[t] ?? 'bg-slate-400'
  )
}

function timelineLabel(t) {
  return (
    {
      asap: 'ASAP',
      '1_3_months': '1–3 Months',
      '3_6_months': '3–6 Months',
      '6_12_months': '6–12 Months',
      '12_plus_months': '12+ Months',
    }[t] ?? t
  )
}

const STAGES = {
  lead: { label: 'Lead', cls: 'bg-gray-100 text-gray-600' },
  prospect: { label: 'Prospect', cls: 'bg-blue-100 text-blue-700' },
  showing: { label: 'Showing', cls: 'bg-indigo-100 text-indigo-700' },
  offer_made: { label: 'Offer Made', cls: 'bg-yellow-100 text-yellow-700' },
  under_contract: { label: 'Under Contract', cls: 'bg-orange-100 text-orange-700' },
  closed: { label: 'Closed', cls: 'bg-green-100 text-green-700' },
  lost: { label: 'Lost', cls: 'bg-red-100 text-red-700' },
}

function stageLabel(s) {
  return STAGES[s]?.label ?? s
}

function stageClass(s) {
  return STAGES[s]?.cls ?? 'bg-gray-100 text-gray-600'
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
      urgent: 'bg-rose-100 text-rose-700',
      high: 'bg-amber-100 text-amber-800',
      medium: 'bg-blue-50 text-blue-700',
      low: 'bg-slate-100 text-slate-600',
    }[p] ?? 'bg-gray-100 text-gray-500'
  )
}

function daysUntil(due) {
  const d = new Date(due)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.round((d - now) / 86400000)
}

function dueChipText(task) {
  if (task.status === 'complete' || task.status === 'closed') return 'Done'
  const diff = daysUntil(task.due_date)
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Tomorrow'
  return `${diff}d`
}

function dueChipClass(task) {
  if (task.status === 'complete' || task.status === 'closed') return 'bg-green-100 text-green-700'
  const diff = daysUntil(task.due_date)
  if (diff < 0) return 'bg-red-100 text-red-700'
  if (diff === 0) return 'bg-amber-100 text-amber-700'
  return 'bg-gray-100 text-gray-500'
}

function formatCompact(n) {
  if (!n) return '0'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K'
  return Number(n).toLocaleString()
}

function formatDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
