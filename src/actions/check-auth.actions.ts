import { isAxiosError } from 'axios'
import { api } from 'src/boot/axios'
import type { AuthResponse, AuthSuccessResponse } from 'src/common/interfaces'

export const checkAuthAction = async (): Promise<AuthSuccessResponse | {ok: boolean, message: string} | undefined> => {
  try {
    const localToken = localStorage.getItem('token')
    let userAuth: AuthResponse 
    if (localToken && localToken.length < 10) {
      return { ok: false, message: 'El token no es valido' }
    }
    try {
      const { data } = await api.get<AuthResponse>('/auth/check-status');
      console.log('el usuario que llega al front', data);
      userAuth = data;
    } catch (error) {
      return {
        ok: false,
        message: (error as Error).message ?? 'Error al validar la sesión',
      };
    }
    return {
      ok: true,
      user: userAuth.auth,
      token: userAuth.token 
    }
  } 
  catch (error) {
    if (isAxiosError(error)) {
      return {
        ok: false,
        message: error.message ?? 'Error al validar la sesión',
      }
    }
    throw new Error('No se pudo validar la sesión')
  }
}
