<template>
  <div class="space-y-6 pb-6">
    <!-- ─── Greeting ───────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">{{ greeting }}, {{ firstName }}</h2>
        <p class="text-sm text-gray-400 mt-0.5">{{ todayLabel }} · Here's your business at a glance</p>
      </div>
      <div class="flex gap-2 flex-wrap">
        <RouterLink
          to="/properties/create"
          class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Property
        </RouterLink>
        <RouterLink
          to="/clients/create"
          class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Client
        </RouterLink>
        <RouterLink
          to="/deals/create"
          class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Deal
        </RouterLink>
        <RouterLink
          to="/tasks/create"
          class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/25 transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Task
        </RouterLink>
      </div>
    </div>

    <!-- ─── Loading ────────────────────────────────────── -->
    <div v-if="loading" class="flex items-center justify-center py-24">
      <div class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-sm text-gray-400">Loading dashboard...</p>
      </div>
    </div>

    <!-- ─── Error ──────────────────────────────────────── -->
    <div v-else-if="error" class="bg-white rounded-2xl shadow-sm py-16 px-6 text-center">
      <p class="text-sm font-semibold text-gray-700">Could not load the dashboard</p>
      <p class="text-xs text-gray-400 mt-1">{{ error }}</p>
      <button
        @click="fetchDashboard"
        class="mt-4 text-xs font-semibold bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
      >
        Try again
      </button>
    </div>

    <template v-else-if="data">
      <!-- ─── Summary Cards ───────────────────────────── -->
      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <!-- Active Listings -->
        <div class="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow">
          <div class="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21"
              />
            </svg>
          </div>
          <p class="text-3xl font-black text-blue-600">{{ data.summary.active_listings }}</p>
          <p class="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wide">Active Listings</p>
        </div>

        <!-- Open Deals -->
        <div class="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-violet-500 hover:shadow-md transition-shadow">
          <div class="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center mb-3">
            <svg
              class="w-5 h-5 text-violet-600"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </div>
          <p class="text-3xl font-black text-violet-600">{{ data.summary.open_deals }}</p>
          <p class="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wide">Open Deals</p>
        </div>

        <!-- Pipeline Value -->
        <div class="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
          <div class="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center mb-3">
            <svg
              class="w-5 h-5 text-indigo-600"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
              />
            </svg>
          </div>
          <p class="text-3xl font-black text-indigo-600">${{ formatCompact(data.summary.pipeline_value) }}</p>
          <p class="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wide">Pipeline Value</p>
        </div>

        <!-- Commission YTD -->
        <div class="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-emerald-500 hover:shadow-md transition-shadow">
          <div class="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center mb-3">
            <svg
              class="w-5 h-5 text-emerald-600"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p class="text-3xl font-black text-emerald-600">${{ formatCompact(data.summary.commission_ytd) }}</p>
          <p class="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wide">Commission YTD</p>
        </div>

        <!-- Conversion Rate -->
        <div class="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-amber-500 hover:shadow-md transition-shadow">
          <div class="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center mb-3">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
              />
            </svg>
          </div>
          <p class="text-3xl font-black text-amber-600">{{ data.summary.conversion_rate }}%</p>
          <p class="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wide">
            {{ data.summary.closed_deals }}/{{ data.summary.total_deals }} Deals
          </p>
        </div>

        <!-- Overdue Tasks -->
        <div
          :class="[
            'bg-white rounded-2xl p-5 shadow-sm border-l-4 hover:shadow-md transition-shadow',
            data.summary.overdue_tasks > 0 ? 'border-red-500' : 'border-gray-200',
          ]"
        >
          <div
            :class="[
              'w-9 h-9 rounded-xl flex items-center justify-center mb-3',
              data.summary.overdue_tasks > 0 ? 'bg-red-50' : 'bg-gray-50',
            ]"
          >
            <svg
              :class="['w-5 h-5', data.summary.overdue_tasks > 0 ? 'text-red-500' : 'text-gray-400']"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p :class="['text-3xl font-black', data.summary.overdue_tasks > 0 ? 'text-red-600' : 'text-gray-300']">
            {{ data.summary.overdue_tasks }}
          </p>
          <RouterLink
            to="/tasks"
            :class="[
              'text-xs font-semibold mt-1 block uppercase tracking-wide transition-colors',
              data.summary.overdue_tasks > 0 ? 'text-red-400 hover:text-red-600' : 'text-gray-400',
            ]"
          >
            {{ data.summary.overdue_tasks > 0 ? 'View overdue →' : 'Overdue Tasks' }}
          </RouterLink>
        </div>
      </div>

      <!-- ─── Charts Row ───────────────────────────────── -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <!-- Monthly Performance -->
        <div class="xl:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <div class="flex items-start justify-between mb-5 gap-4 flex-wrap">
            <div>
              <h3 class="text-sm font-bold text-gray-800">Monthly Performance</h3>
              <p class="text-xs text-gray-400 mt-0.5">Closed deals — last 6 months</p>
            </div>
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <span class="w-3 h-3 rounded-sm bg-blue-500 inline-block"></span>
                Deals closed
              </span>
              <span class="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <span class="w-3 h-3 rounded-sm bg-emerald-400 inline-block"></span>
                Commission
              </span>
            </div>
          </div>

          <div class="relative" style="height: 220px">
            <canvas
              ref="chartRef"
              role="img"
              aria-label="Bar chart of deals closed and commission earned per month"
            ></canvas>
          </div>

          <!-- 6-month totals -->
          <div class="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">
            <div>
              <p class="text-xs text-gray-400 font-medium mb-0.5">Deals Closed</p>
              <p class="text-base font-bold text-gray-800">{{ monthlyTotals.count }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 font-medium mb-0.5">Total Volume</p>
              <p class="text-base font-bold text-gray-800">${{ formatCompact(monthlyTotals.value) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 font-medium mb-0.5">Commission Earned</p>
              <p class="text-base font-bold text-emerald-600">${{ formatCompact(monthlyTotals.commission) }}</p>
            </div>
          </div>
        </div>

        <!-- Pipeline by stage -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <div class="mb-5">
            <h3 class="text-sm font-bold text-gray-800">Deal Pipeline</h3>
            <p class="text-xs text-gray-400 mt-0.5">All stages · {{ data.summary.total_deals }} total</p>
          </div>

          <div class="space-y-4">
            <div v-for="stage in PIPELINE_STAGES" :key="stage.key">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-2">
                  <span :class="['w-2.5 h-2.5 rounded-full shrink-0', stage.dotColor]"></span>
                  <span class="text-xs font-semibold text-gray-700">{{ stage.label }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-bold text-gray-800">{{ stageData(stage.key)?.count ?? 0 }}</span>
                  <span class="text-xs text-gray-400">
                    deal{{ (stageData(stage.key)?.count ?? 0) !== 1 ? 's' : '' }}
                  </span>
                </div>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  :class="['h-full rounded-full transition-all duration-700 ease-out', stage.barColor]"
                  :style="{ width: stageBarWidth(stage.key) + '%' }"
                ></div>
              </div>
              <div v-if="stageData(stage.key)?.total_value > 0" class="text-right mt-0.5">
                <span class="text-xs text-gray-400">${{ formatCompact(stageData(stage.key).total_value) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── Bottom Row ───────────────────────────────── -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <!-- Tasks Due Today -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg
                  class="w-4 h-4 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 class="text-sm font-bold text-gray-800">Due Today</h3>
              <span
                v-if="data.tasks_due_today.length"
                class="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full"
              >
                {{ data.tasks_due_today.length }}
              </span>
            </div>
            <RouterLink to="/tasks" class="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors">
              All tasks →
            </RouterLink>
          </div>

          <!-- Empty state -->
          <div v-if="!data.tasks_due_today.length" class="flex flex-col items-center justify-center py-12">
            <div class="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-3">
              <svg class="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p class="text-sm font-semibold text-gray-700">All clear for today!</p>
            <p class="text-xs text-gray-400 mt-0.5">No tasks due today.</p>
          </div>

          <div v-else class="flex-1 divide-y divide-gray-50">
            <div
              v-for="task in data.tasks_due_today"
              :key="task.id"
              class="flex items-start gap-3 px-6 py-3.5 hover:bg-gray-50 transition-colors"
            >
              <div :class="['w-2 h-2 rounded-full shrink-0 mt-2', priorityDot(task.priority)]"></div>
              <div class="flex-1 min-w-0">
                <RouterLink
                  :to="`/tasks/${task.id}`"
                  class="block text-sm font-semibold text-gray-800 hover:text-blue-600 truncate transition-colors"
                >
                  {{ task.title }}
                </RouterLink>
                <div class="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span
                    :class="[
                      'text-xs font-semibold px-1.5 py-0.5 rounded-full capitalize',
                      priorityBadge(task.priority),
                    ]"
                  >
                    {{ task.priority }}
                  </span>
                  <span v-if="task.client" class="text-xs text-gray-400">{{ task.client.name }}</span>
                  <span v-if="task.deal" class="text-xs text-blue-500 font-medium truncate max-w-24">
                    {{ task.deal.title }}
                  </span>
                </div>
              </div>
              <RouterLink
                :to="`/tasks/${task.id}`"
                :aria-label="`Open ${task.title}`"
                class="text-gray-300 hover:text-blue-500 transition-colors shrink-0 mt-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </RouterLink>
            </div>
          </div>

          <!-- Overdue banner -->
          <div
            v-if="data.summary.overdue_tasks > 0"
            class="flex items-center justify-between px-6 py-3 bg-red-50 border-t border-red-100 shrink-0"
          >
            <p class="text-xs font-bold text-red-600">
              {{ data.summary.overdue_tasks }} task{{ data.summary.overdue_tasks !== 1 ? 's' : '' }} overdue
            </p>
            <RouterLink to="/tasks" class="text-xs font-bold text-red-600 hover:text-red-800 transition-colors">
              Review →
            </RouterLink>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                  />
                </svg>
              </div>
              <h3 class="text-sm font-bold text-gray-800">Recent Activity</h3>
            </div>
            <RouterLink to="/deals" class="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors">
              All deals →
            </RouterLink>
          </div>

          <div v-if="!data.recent_activity.length" class="flex flex-col items-center justify-center py-12">
            <div class="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
              <svg class="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.75 12h16.5" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-gray-700">No activity yet</p>
            <p class="text-xs text-gray-400 mt-0.5">Deal updates will appear here</p>
          </div>

          <div v-else class="flex-1 overflow-y-auto" style="max-height: 316px">
            <div
              v-for="(act, i) in data.recent_activity"
              :key="act.id"
              class="flex gap-3 px-6 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <div class="flex flex-col items-center pt-1.5">
                <div :class="['w-2 h-2 rounded-full shrink-0', activityDot(act.action)]"></div>
                <div v-if="i < data.recent_activity.length - 1" class="w-px flex-1 bg-gray-100 mt-1"></div>
              </div>
              <div class="flex-1 min-w-0 pb-0.5">
                <p class="text-xs font-semibold text-gray-700 leading-snug">{{ act.description }}</p>
                <div class="flex items-center gap-2 mt-0.5">
                  <RouterLink
                    v-if="act.deal"
                    :to="`/deals/${act.deal.id}`"
                    class="text-xs text-blue-600 hover:underline font-medium truncate max-w-40"
                  >
                    {{ act.deal.title }}
                  </RouterLink>
                  <span class="text-xs text-gray-400 shrink-0">{{ timeAgo(act.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── Top Clients ──────────────────────────────── -->
      <div v-if="data.top_clients.length" class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-gray-800">Top Clients</h3>
            <p class="text-xs text-gray-400 mt-0.5">Ranked by total deal volume</p>
          </div>
          <RouterLink to="/clients" class="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            All clients →
          </RouterLink>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-8">#</th>
                <th class="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Client</th>
                <th class="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Deals</th>
                <th class="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Volume</th>
                <th class="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Commission
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(c, i) in data.top_clients" :key="c.client_id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'text-base font-black',
                      i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-400' : 'text-gray-200',
                    ]"
                  >
                    {{ i + 1 }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <RouterLink
                    :to="`/clients/${c.client_id}`"
                    class="font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                  >
                    {{ c.client?.name ?? 'Unknown' }}
                  </RouterLink>
                </td>
                <td class="px-6 py-4 text-right text-gray-600 font-medium">{{ c.deal_count }}</td>
                <td class="px-6 py-4 text-right font-bold text-gray-800">${{ formatCompact(c.total_value) }}</td>
                <td class="px-6 py-4 text-right font-bold text-emerald-600">
                  ${{ formatCompact(c.total_commission) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/lib/axios'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const auth = useAuthStore()
const data = ref(null)
const loading = ref(true)
const error = ref('')
const chartRef = ref(null)
let chartInstance = null

// ─── Greeting ────────────────────────────────────────────
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
})

const firstName = computed(() => auth.user?.name?.split(' ')[0] ?? 'Agent')

const todayLabel = computed(() =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
)

// ─── Pipeline stage definitions ───────────────────────────
const PIPELINE_STAGES = [
  { key: 'lead', label: 'Lead', dotColor: 'bg-gray-400', barColor: 'bg-gray-400' },
  { key: 'prospect', label: 'Prospect', dotColor: 'bg-blue-400', barColor: 'bg-blue-400' },
  { key: 'showing', label: 'Showing', dotColor: 'bg-indigo-400', barColor: 'bg-indigo-400' },
  { key: 'offer_made', label: 'Offer Made', dotColor: 'bg-yellow-400', barColor: 'bg-yellow-400' },
  { key: 'under_contract', label: 'Under Contract', dotColor: 'bg-orange-400', barColor: 'bg-orange-400' },
  { key: 'closed', label: 'Closed', dotColor: 'bg-emerald-500', barColor: 'bg-emerald-500' },
  { key: 'lost', label: 'Lost', dotColor: 'bg-red-400', barColor: 'bg-red-400' },
]

// ─── Pipeline helpers ─────────────────────────────────────
function stageData(key) {
  return data.value?.pipeline?.find((p) => p.stage === key)
}

const pipelineMax = computed(() => {
  if (!data.value) return 1
  return Math.max(...data.value.pipeline.map((p) => p.count), 1)
})

function stageBarWidth(key) {
  const count = stageData(key)?.count ?? 0
  return Math.round((count / pipelineMax.value) * 100)
}

const monthlyTotals = computed(() => {
  const months = data.value?.monthly ?? []
  return {
    count: months.reduce((s, m) => s + m.count, 0),
    value: months.reduce((s, m) => s + m.total_value, 0),
    commission: months.reduce((s, m) => s + m.total_commission, 0),
  }
})

// ─── Fetch ────────────────────────────────────────────────
async function fetchDashboard() {
  loading.value = true
  error.value = ''
  try {
    const { data: res } = await api.get('/dashboard')
    data.value = res
  } catch (e) {
    error.value = e.response?.data?.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

// ─── Chart ───────────────────────────────────────────────
function buildChart() {
  if (!chartRef.value || !data.value) return
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  const ctx = chartRef.value.getContext('2d')
  const monthly = data.value.monthly

  const blueGrad = ctx.createLinearGradient(0, 0, 0, 220)
  blueGrad.addColorStop(0, 'rgba(37, 99, 235, 0.90)')
  blueGrad.addColorStop(1, 'rgba(37, 99, 235, 0.15)')

  const greenGrad = ctx.createLinearGradient(0, 0, 0, 220)
  greenGrad.addColorStop(0, 'rgba(16, 185, 129, 0.85)')
  greenGrad.addColorStop(1, 'rgba(16, 185, 129, 0.10)')

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: monthly.map((m) => m.label),
      datasets: [
        {
          label: 'Deals Closed',
          data: monthly.map((m) => m.count),
          backgroundColor: blueGrad,
          borderColor: '#2563EB',
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          yAxisID: 'y',
        },
        {
          label: 'Commission',
          data: monthly.map((m) => m.total_commission),
          backgroundColor: greenGrad,
          borderColor: '#10B981',
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          yAxisID: 'y2',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0F172A',
          titleFont: { size: 12, weight: 'bold', family: 'inherit' },
          bodyFont: { size: 11, family: 'inherit' },
          padding: 12,
          cornerRadius: 10,
          callbacks: {
            label: (c) => {
              if (c.datasetIndex === 0) return `  ${c.raw} deal${c.raw !== 1 ? 's' : ''} closed`
              return `  $${Number(c.raw).toLocaleString()} commission`
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { font: { size: 11, family: 'inherit' }, color: '#94A3B8' },
        },
        y: {
          position: 'left',
          beginAtZero: true,
          border: { display: false },
          ticks: { precision: 0, font: { size: 11 }, color: '#94A3B8' },
          grid: { color: '#F1F5F9' },
        },
        y2: {
          position: 'right',
          beginAtZero: true,
          border: { display: false },
          grid: { display: false },
          ticks: {
            font: { size: 11 },
            color: '#94A3B8',
            callback: (v) => '$' + formatCompact(v),
          },
        },
      },
    },
  })
}

watch(data, async () => {
  await nextTick()
  buildChart()
})

onMounted(fetchDashboard)
onUnmounted(() => {
  if (chartInstance) chartInstance.destroy()
})

// ─── Display helpers ──────────────────────────────────────
function formatCompact(n) {
  if (!n) return '0'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K'
  return Number(n).toLocaleString()
}

function timeAgo(s) {
  const diff = Date.now() - new Date(s).getTime()
  const mins = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function priorityDot(p) {
  return (
    {
      urgent: 'bg-rose-500',
      high: 'bg-amber-500',
      medium: 'bg-blue-500',
      low: 'bg-slate-400',
    }[p] ?? 'bg-gray-400'
  )
}

function priorityBadge(p) {
  return (
    {
      urgent: 'bg-rose-100 text-rose-700',
      high: 'bg-amber-100 text-amber-800',
      medium: 'bg-blue-50 text-blue-700',
      low: 'bg-slate-100 text-slate-600',
    }[p] ?? 'bg-gray-100 text-gray-600'
  )
}

function activityDot(action) {
  return (
    {
      created: 'bg-blue-400',
      stage_changed: 'bg-amber-400',
      note_added: 'bg-purple-400',
    }[action] ?? 'bg-gray-400'
  )
}
</script>
