import isAdminGuard from 'src/guards/is-admin.guard'
import isAuthenticatedGuard from 'src/guards/is-authenticated.guard'
import isNotAuthenticatedGuard from 'src/guards/is-not-authenticated.guard'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    beforeEnter: [isNotAuthenticatedGuard],
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
      },
    ],
  },
  {
    path: '',
    beforeEnter: [isAuthenticatedGuard],
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/dashboard',
        beforeEnter: [isAdminGuard],
        name: 'dashboard',
        component: () => import('pages/DashboardPage.vue'),
      },
      {
        path: '/screen-control',
        name: 'screen-control',
        component: () => import('pages/ScreenControlPage.vue'),
      },
      {
        path: '/usuarios',
        component: () => import('pages/UserPage.vue'),
      },
      {
        path: '/roles',
        component: () => import('pages/RolesPage.vue'),
      },
      {
        path: '/prendas',
        component: () => import('pages/GarmentPage.vue'),
      },
      {
        path: '/tiempos',
        component: () => import('pages/TimesPage.vue'),
      },
      {
        path: '/operaciones',
        component: () => import('pages/OperationPage.vue'),
      },
      {
        path: '/corte',
        component: () => import('pages/CuttingPage.vue'),
      },
      {
        path: '/bordado',
        component: () => import('pages/EmbroideryPage.vue'),
      },
      {
        path: '/estampado',
        component: () => import('pages/StampFusedPage.vue'),
      },
      {
        path: '/calidad',
        component: () => import('pages/QualityPage.vue'),
      },
      {
        path: '/confeccion',
        component: () => import('pages/ConfectionPage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
