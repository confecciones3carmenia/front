<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-negative">
      <q-toolbar>
        <q-btn flat dense round icon="las la-bars" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> </q-toolbar-title>

        <div>
          <img
            src="../assets/letreros_1-142x34.png"
            alt="logo confecciones 3C"
            class="logo-blanco"
          />
        </div>
        <div>
          <q-btn
            to="/login"
            flat
            dense
            round
            icon="las la-sign-out-alt"
            aria-label="Cerrar sesión"
            @click="handleLogout"
            ><q-tooltip>Cerrar sesión</q-tooltip></q-btn
          >
        </div>
      </q-toolbar>
    </q-header>

    <q-footer elevated class="row items-end" style="background-color: #727272">
      <q-toolbar class="col glossy text-white">
        <q-space />
        <p>
          <small><i>@Todos los derechos reservados Ing. Juan García 2025</i></small>
        </p>
      </q-toolbar>
    </q-footer>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="drawer-with-footer">
      <q-list>
        <q-item-label header>
          <h6 class="text-center q-mt-none q-mb-none">Confecciones 3C</h6>
        </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
      <div class="drawer-footer">
        <img src="../assets/letreros_1-142x34.png" alt="logo confecciones 3C" />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import type { EssentialLinkProps } from 'src/common/interfaces/menus.interface'
import { useAuthStore } from 'src/stores/auth.store'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const authStore = useAuthStore()

const linksList: EssentialLinkProps[] = [
  {
    title: 'Dashboard',
    icon: 'las la-chart-line',
    to: 'dashboard',
  },
  {
    title: 'Pantalla de control',
    icon: 'las la-clock',
    to: 'screen-control',
  },
  {
    title: 'Administración',
    icon: 'las la-cogs',
    subLinks: [
      {
        title: 'Usuarios',
        icon: 'las la-user-tie',
        to: 'usuarios',
      },
      {
        title: 'Empleados',
        icon: 'las la-users',
        to: 'empleados',
      },
      {
        title: 'Roles',
        icon: 'las la-address-book',
        to: 'roles',
      },
    ],
  },
  {
    title: 'Recursos',
    icon: 'las la-box',
    subLinks: [
      {
        title: 'Prendas',
        icon: 'las la-tshirt',
        to: 'prendas',
      },
      {
        title: 'Operaciones',
        icon: 'las la-tools',
        to: 'operaciones',
      },
      {
        title: 'Tiempos',
        icon: 'las la-clock',
        to: 'tiempos',
      },
    ],
  },
  {
    title: 'Control',
    icon: 'las la-tasks',
    subLinks: [
      {
        title: 'Corte',
        icon: 'las la-cut',
        to: 'corte',
      },
      {
        title: 'Bordado',
        icon: 'las la-icons',
        to: 'bordado',
      },
      {
        title: 'Estampado y fusionado',
        icon: 'las la-print',
        to: 'estampado',
      },
      {
        title: 'Calidad',
        icon: 'las la-check-double',
        to: 'calidad',
      },
      {
        title: 'Confección',
        icon: 'las la-history',
        to: 'confeccion',
      },
    ],
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function handleLogout() {
  try {
    authStore.logout()
  } catch (error) {
    console.error('Error during logout:', error)
    $q.notify({
      message: (error as string) ?? 'Error al cerrar sesión',
      position: 'top',
      color: 'negative',
    })
  }
}
</script>
<style lang="scss">
.logo-blanco {
  filter: invert(1) brightness(2);
}

.drawer-with-footer {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.drawer-footer {
  margin-top: auto;
  text-align: center;
  padding: 16px;
}
</style>
