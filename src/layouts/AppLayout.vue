<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- ─── Sidebar ─────────────────────────────────── -->
    <aside class="w-64 bg-slate-900 flex flex-col fixed h-screen z-30">
      <!-- Logo -->
      <div class="px-5 py-5 border-b border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/40">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
              />
            </svg>
          </div>
          <div>
            <p class="text-white font-bold text-base tracking-tight leading-none">RE CRM</p>
            <p class="text-slate-500 text-xs mt-0.5">Real Estate Platform</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        <p class="text-slate-600 text-xs font-semibold uppercase tracking-widest px-3 pt-1 pb-2">Main Menu</p>

        <!-- Dashboard -->
        <RouterLink
          to="/dashboard"
          :class="navClass('/dashboard')"
          class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z"
            />
          </svg>
          Dashboard
        </RouterLink>

        <!-- Properties -->
        <RouterLink
          to="/properties"
          :class="navClass('/properties')"
          class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21"
            />
          </svg>
          Properties
        </RouterLink>

        <!-- Clients -->
        <RouterLink
          to="/clients"
          :class="navClass('/clients')"
          class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>
          Clients
        </RouterLink>

        <!-- Deals -->
        <RouterLink
          to="/deals"
          :class="navClass('/deals')"
          class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
            />
          </svg>
          Deals
        </RouterLink>

        <!-- Tasks -->
        <RouterLink
          to="/tasks"
          :class="navClass('/tasks')"
          class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Tasks
          <span
            v-if="overdueCount > 0"
            class="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none"
          >
            {{ overdueCount }}
          </span>
        </RouterLink>

        <p class="text-slate-600 text-xs font-semibold uppercase tracking-widest px-3 pt-5 pb-2">Account</p>

        <!-- Settings -->
        <RouterLink
          to="/settings"
          :class="navClass('/settings')"
          class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Settings
        </RouterLink>
      </nav>

      <!-- User section -->
      <div class="px-4 py-4 border-t border-slate-800">
        <div class="flex items-center gap-3">
          <img
            v-if="auth.user?.avatar_url"
            :src="auth.user.avatar_url"
            alt=""
            class="w-9 h-9 rounded-full object-cover shrink-0 shadow-lg"
          />
          <div
            v-else
            class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-lg"
          >
            {{ userInitial }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white text-sm font-semibold truncate">{{ auth.user?.name }}</p>
            <p class="text-slate-500 text-xs capitalize truncate">
              {{ auth.user?.role?.replace('_', ' ') }}
            </p>
          </div>
          <button
            @click="handleLogout"
            title="Sign out"
            class="text-slate-500 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-slate-800 shrink-0"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- ─── Main Content ──────────────────────────────── -->
    <div class="flex-1 ml-64 flex flex-col min-h-screen">
      <!-- Top bar -->
      <header
        class="bg-white border-b border-gray-200 px-6 py-3.5 sticky top-0 z-20 flex items-center justify-between"
      >
        <div>
          <h1 class="text-base font-semibold text-gray-900">{{ pageTitle }}</h1>
          <p class="text-xs text-gray-400 mt-0.5">{{ pageSubtitle }}</p>
        </div>
        <div class="flex items-center gap-3">
          <span
            :class="
              auth.user?.subscription_status === 'pro'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-500 border border-gray-200'
            "
            class="text-xs font-semibold px-3 py-1.5 rounded-full"
          >
            {{ auth.user?.subscription_status === 'pro' ? '✦ Pro Plan' : 'Free Plan' }}
          </span>
        </div>
      </header>

      <!-- Page -->
      <main class="flex-1 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/lib/axios'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const overdueCount = ref(0)

const userInitial = computed(() => auth.user?.name?.charAt(0).toUpperCase() ?? '?')

const PAGE_META = {
  dashboard: { title: 'Dashboard', subtitle: 'Your performance at a glance' },
  properties: { title: 'Properties', subtitle: 'Manage your listings' },
  'property-create': { title: 'Add Property', subtitle: 'Create a new listing' },
  'property-edit': { title: 'Edit Property', subtitle: 'Update listing details' },
  'property-detail': { title: 'Property Detail', subtitle: '' },
  clients: { title: 'Clients', subtitle: 'Manage your contacts' },
  'client-create': { title: 'Add Client', subtitle: 'Create a new contact' },
  'client-edit': { title: 'Edit Client', subtitle: 'Update contact info' },
  'client-detail': { title: 'Client Detail', subtitle: '' },
  deals: { title: 'Deals', subtitle: 'Track your pipeline' },
  'deal-kanban': { title: 'Deal Pipeline', subtitle: 'Drag and drop to update stages' },
  'deal-create': { title: 'New Deal', subtitle: 'Create a new deal' },
  'deal-edit': { title: 'Edit Deal', subtitle: 'Update deal details' },
  'deal-detail': { title: 'Deal Detail', subtitle: '' },
  tasks: { title: 'Tasks', subtitle: 'Follow-ups and reminders' },
  'task-create': { title: 'New Task', subtitle: 'Add a follow-up or reminder' },
  'task-edit': { title: 'Edit Task', subtitle: 'Update task details' },
  'task-detail': { title: 'Task Detail', subtitle: '' },
  settings: { title: 'Settings', subtitle: 'Manage your account' },
}

const pageTitle = computed(() => PAGE_META[route.name]?.title ?? 'RE CRM')
const pageSubtitle = computed(() => PAGE_META[route.name]?.subtitle ?? '')

function navClass(prefix) {
  const active = route.path === prefix || (prefix !== '/dashboard' && route.path.startsWith(prefix))
  return active
    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
    : 'text-slate-400 hover:text-white hover:bg-slate-800'
}

async function fetchOverdueCount() {
  try {
    const { data } = await api.get('/tasks/summary')
    overdueCount.value = data.overdue ?? 0
  } catch {
    /* silent — tasks module may not exist yet */
  }
}

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'login' })
}

onMounted(fetchOverdueCount)
</script>
