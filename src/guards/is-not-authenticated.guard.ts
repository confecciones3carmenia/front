import { useAuthStore } from 'src/stores/auth.store'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export default function isNotAuthenticatedGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    // Allow navigation if the user is not authenticated
    next()
  } else {
    // Redirect to dashboard if already authenticated and not already on the dashboard
    if (to.name === 'dashboard') {
      next()
    } else {
      next({ name: 'dashboard' })
    }
  }
}