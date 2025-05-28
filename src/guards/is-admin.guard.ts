import { useAuthStore } from "src/stores/auth.store";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

const isAdminGuard = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const authStore = useAuthStore()
    
    if (authStore.isAdmin) {
        // Redirect to dashboard only if not already on the dashboard
        if (to.name === 'dashboard') {
            next()
        } else {
            next({ name: 'dashboard' })
        }
    } else {
        // Redirect to screen-control only if not already on screen-control
        if (to.name === 'screen-control') {
            next()
        } else {
            next({ name: 'screen-control' })
        }
    }
}

export default isAdminGuard