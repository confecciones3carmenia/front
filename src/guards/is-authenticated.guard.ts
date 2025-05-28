import { useAuthStore } from 'src/stores/auth.store'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export default function isAuthenticatedGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    // Allow navigation if the user is authenticated
    next()
  } else {
    // Redirect to login only if not already on the login page
    if (to.name === 'login') {
      next()
    } else {
      next({ name: 'login' })
    }
  }
}