import { useAuthStore } from 'src/stores/auth.store'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export default function isNotAuthenticatedGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) {
    next(); // Allow access to login page
  } else {
    // If authenticated, redirect them away from login page
    if (authStore.isAdmin) {
      next({ name: 'dashboard' });
    } else {
      next({ name: 'screen-control' });
    }
  }
}