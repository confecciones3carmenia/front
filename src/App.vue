<template>
  <router-view />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { AUTHSTATUS } from './common/enums/auth-status.enum'
import { useAuthStore } from './stores/auth.store'

const authStore = useAuthStore()
const router = useRouter();
const route = useRoute();

authStore.$subscribe(
  (_, state) => {
    if (state.authStatus === AUTHSTATUS.Checking) {
      authStore.checkAuthStatus()
      return
    }

    if (route.path.includes('/login') && state.authStatus === AUTHSTATUS.Authenticated) {
      router.replace({ name: 'dashboard' })
      return
    }
  },
  {
    immediate: true,
  },
)
</script>
