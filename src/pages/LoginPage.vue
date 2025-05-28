<template>
  <q-page class="row items-center">
    <!-- Panel de login a la izquierda -->
    <div class="col-12 col-md-6 q-pa-md">
      <div class="q-mt-xl q-mx-md">
        <!-- Logo -->
        <div class="q-mb-xl text-center">
          <img
            src="../assets/letreros_1-142x34.png"
            alt="logo confecciones 3C"
            class="logo-blanco"
          />
        </div>

        <!-- Formulario de login -->
        <q-form @submit.prevent="onSubmit" class="q-gutter-md q-ma-xl">
          <!-- Input de Email -->
          <q-input
            class="q-ml-none"
            v-model="emailForm.email"
            label="Email"
            type="email"
            outlined
            placeholder="email@example.com"
            :rules="[(val) => (val && val.length > 0) || 'Por favor ingrese su email']"
          />

          <!-- Input de Password -->
          <q-input
            class="q-ml-none"
            v-model="emailForm.password"
            label="Password"
            outlined
            :type="isPwd ? 'password' : 'text'"
            placeholder="Ingrese la contraseña"
            :rules="[(val) => (val && val.length > 0) || 'Por favor ingrese su contraseña']"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <!-- Botón de Login -->
          <q-btn type="submit" label="Login" color="negative" class="full-width q-py-sm q-mt-lg" />
        </q-form>
      </div>
    </div>

    <!-- Imagen a la derecha -->
    <div class="col-md-6 bg-img" style="display: none">
      <div class="absolute-bottom text-center q-pa-sm text-white">
        @Todos los derechos reservados Ing. Juan García - 2025
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar'
import type { Login } from 'src/common/interfaces'
import { useAuthStore } from 'src/stores/auth.store'
import { ref } from 'vue'

const $q = useQuasar()
const authStore = useAuthStore()

const emailForm = ref<Login>({
  email: '',
  password: '',
})
const isPwd = ref<boolean>(true)

async function onSubmit() {
  $q.loading.show({ message: 'Iniciando sesión...' })
  await authStore
    .login(emailForm.value.email, emailForm.value.password)
    .then(() => {
      return
    })
    .catch(() => {
      $q.notify({
        message: 'Credenciales no válidas',
        position: 'center',
        color: 'negative',
      })
      clearForm()
    })
    .finally(() => {
      $q.loading.hide()
    })

  function clearForm(): void {
    emailForm.value = {
      email: '',
      password: '',
    }
  }
}
</script>

<style scoped>
.bg-img {
  background-image: url('src/assets/login-confecciones.png');
  background-size: cover;
  background-position: center;
}

@media (min-width: 768px) {
  .bg-img {
    display: block !important;
    position: relative;
    min-height: 100vh;
  }
}

.q-input {
  margin-bottom: 20px;
}
</style>
