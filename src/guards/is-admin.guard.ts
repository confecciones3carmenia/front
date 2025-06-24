import { useAuthStore } from "src/stores/auth.store";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

const isAdminGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore();
  if (authStore.isAdmin) {
    next(); // Allow access to the route
  } else {
    next({ name: 'screen-control' }); // Redirect non-admins
  }
};

export default isAdminGuard