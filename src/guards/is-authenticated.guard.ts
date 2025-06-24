import { useAuthStore } from 'src/stores/auth.store'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export default function isAuthenticatedGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    next(); // Allow access
  } else {
    next({ name: 'login' }); // Redirect to login
  }
}