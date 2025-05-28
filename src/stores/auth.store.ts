import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Auth, AuthSuccessResponse } from 'src/common/interfaces'
import { AUTHSTATUS } from 'src/common/enums/auth-status.enum'
import { checkAuthAction, loginActions } from 'src/actions'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref<AUTHSTATUS>(AUTHSTATUS.Checking)
  const user = ref<Auth | undefined>()
  const token = ref(useLocalStorage('token', ''))

  const login = async (email: string, password: string) => {
    try {
      const loginResponse = await loginActions(email, password)
      console.log(loginResponse, 'login response')
      if (!loginResponse.ok) {
        logout()
        throw new Error('Credenciales invalidas')
      }
      console.log('login response en el auth', loginResponse);
      user.value = (loginResponse as AuthSuccessResponse).user
      token.value = (loginResponse as AuthSuccessResponse).token
      authStatus.value = AUTHSTATUS.Authenticated
      return true
    } catch (error) {
      logout()
      throw error
    }
  }

  const checkAuthStatus = async (): Promise<boolean> => {
    try {

      const statusResponse = await checkAuthAction()
      console.log('status response', statusResponse)
      if (!statusResponse?.ok) {
        logout()
        return false
      }

      authStatus.value = AUTHSTATUS.Authenticated
      user.value = (statusResponse as AuthSuccessResponse).user
      token.value = (statusResponse as AuthSuccessResponse).token
      return true
    } catch {
      logout()
      return false
    }
  }

  const logout = (): boolean => {
    try {
      user.value = undefined
      token.value = null
      authStatus.value = AUTHSTATUS.NotAuthenticated
      localStorage.removeItem('user')
      localStorage.removeItem('token')

    } catch (err) {
      console.error('Error during logout:', err)
      return false
    }
    return false
  }

  return {
    user,
    token,
    authStatus,

    isChecking: computed(() => authStatus.value === AUTHSTATUS.Checking),
    isAuthenticated: computed(() => authStatus.value === AUTHSTATUS.Authenticated),
    isAdmin: computed(
      () =>
        user.value?.user?.role.name === 'administrador' ||
        user.value?.user?.role.name === 'gerente',
    ),

    userName: computed(() => `${user.value?.user.name} ${user.value?.user.lastname}`),

    login,
    logout,
    checkAuthStatus,
  }
})
