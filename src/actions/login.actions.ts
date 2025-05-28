import { isAxiosError } from "axios";
import { api } from "src/boot/axios";
import type { AuthErrorResponse, AuthResponse, AuthSuccessResponse } from "src/common/interfaces";

export const loginActions = async(email: string, password: string): Promise<AuthSuccessResponse|AuthErrorResponse> => {
    try {
        const { data } = await api.post<AuthResponse>('/auth/login', {email, password})
        console.log('data en el login', data);
        return {
            ok: true,
            user: data.auth,
            token: data.token
        }
            
    } catch (error) {
        if (isAxiosError(error)) { 
            return {
                ok: false,
                message: error.message ?? 'Error al iniciar sesión'
            }
        }
        throw new Error('No se pudo realizar la petición')
    }
}