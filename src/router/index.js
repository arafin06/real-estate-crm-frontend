import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // Public
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { guest: true },
  },

  // Protected — wrapped in AppLayout
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue') },
      {
        path: 'properties',
        name: 'properties',
        component: () => import('@/views/properties/PropertyListView.vue'),
      },
      {
        path: 'properties/create',
        name: 'property-create',
        component: () => import('@/views/properties/PropertyFormView.vue'),
      },
      {
        path: 'properties/:id/edit',
        name: 'property-edit',
        component: () => import('@/views/properties/PropertyFormView.vue'),
        props: true,
      },
      {
        path: 'properties/:id',
        name: 'property-detail',
        component: () => import('@/views/properties/PropertyDetailView.vue'),
        props: true,
      },
      {
        path: 'clients',
        name: 'clients',
        component: () => import('@/views/clients/ClientListView.vue'),
      },
      {
        path: 'clients/create',
        name: 'client-create',
        component: () => import('@/views/clients/ClientFormView.vue'),
      },
      {
        path: 'clients/:id/edit',
        name: 'client-edit',
        component: () => import('@/views/clients/ClientFormView.vue'),
        props: true,
      },
      {
        path: 'clients/:id',
        name: 'client-detail',
        component: () => import('@/views/clients/ClientDetailView.vue'),
        props: true,
      },
      {
        path: 'deals',
        name: 'deals',
        component: () => import('@/views/deals/DealListView.vue'),
      },
      {
        path: 'deals/kanban',
        name: 'deal-kanban',
        component: () => import('@/views/deals/DealKanbanView.vue'),
      },
      {
        path: 'deals/create',
        name: 'deal-create',
        component: () => import('@/views/deals/DealFormView.vue'),
      },
      {
        path: 'deals/:id/edit',
        name: 'deal-edit',
        component: () => import('@/views/deals/DealFormView.vue'),
        props: true,
      },
      {
        path: 'deals/:id',
        name: 'deal-detail',
        component: () => import('@/views/deals/DealDetailView.vue'),
        props: true,
      },
      {
        path: 'tasks',
        name: 'tasks',
        component: () => import('@/views/tasks/TaskListView.vue'),
      },
      {
        path: 'tasks/create',
        name: 'task-create',
        component: () => import('@/views/tasks/TaskFormView.vue'),
      },
      {
        path: 'tasks/:id/edit',
        name: 'task-edit',
        component: () => import('@/views/tasks/TaskFormView.vue'),
        props: true,
      },
      {
        path: 'tasks/:id',
        name: 'task-detail',
        component: () => import('@/views/tasks/TaskDetailView.vue'),
        props: true,
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/settings/SettingsView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login' }
  }
  if (to.meta.guest && auth.isLoggedIn) {
    return { name: 'dashboard' }
  }
})

export default router
