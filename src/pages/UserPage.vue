<template>
  <q-page>
    <div class="row q-pa-md">
      <div class="col-12 items-end q-mb-md" style="text-align: end">
        <q-btn
          class="text-end"
          square
          color="white"
          glossy
          text-color="black"
          icon="las la-plus"
          @click="createUser"
        >
          <q-tooltip>Agregar usuario</q-tooltip>
        </q-btn>
      </div>
      <div class="col-12 full-width">
        <q-table
          flat
          bordered
          title="Usuarios"
          :rows="rows"
          :columns="columns"
          row-key="name"
          no-data-label="No hay datos para mostrar en el momento."
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width>Acciones</q-th>
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <tr>
              <td style="display: table-cell !important">
                <q-btn flat dense color="primary" icon="las la-edit" @click="editUser(props.row)"
                  ><q-tooltip>Editar rol</q-tooltip></q-btn
                >
                <q-btn
                  flat
                  dense
                  color="negative"
                  icon="las la-trash"
                  @click="deleteUser(props.row)"
                  ><q-tooltip>Eliminar usuario</q-tooltip></q-btn
                >
              </td>
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <template v-if="col.name === 'role'">
                  <q-chip
                    :color="getRoleColor(props.row.role.name)"
                    :icon="getRoleIcon(props.row.role.name)"
                    outline
                  >
                    {{ props.row.role.name }}
                  </q-chip>
                </template>
                <template v-else>
                  {{ col.value }}
                </template>
              </q-td>
            </tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
  <q-dialog
    v-model="fixed"
    persistent
    backdrop-filter="blur(5px)"
    transition-show="fade"
    transition-hide="fade"
  >
    <q-card>
      <div class="col-12 q-ma-md" style="text-align: start">
        <q-btn
          class="float-right"
          square
          dense
          color="white"
          text-color="black"
          icon="las la-times"
          @click="onReset"
        >
          <q-tooltip>Cerrar</q-tooltip>
        </q-btn>
        <h5 class="q-my-md">{{ title }} usuario</h5>
      </div>
      <q-separator />
      <q-form @submit="onSubmit" @reset="onReset">
        <div class="row q-pa-md q-col-gutter-md">
          <div class="col-6">
            <q-input v-model="formUser.name" filled label="Nombre"></q-input>
          </div>
          <div class="col-6">
            <q-input v-model="formUser.lastname" filled label="Apellidos"></q-input>
          </div>
          <div class="col-6">
            <q-select v-model="formUser.role" :options="typeOptions" filled label="Rol"></q-select>
          </div>
          <div class="col-6">
            <q-select
              v-model="formUser.position"
              :options="positionOptions"
              filled
              label="Posición"
            ></q-select>
          </div>
          <div class="col-12 q-mt-md" style="text-align: end">
            <q-separator />
            <q-btn flat type="submit" color="positive" class="q-mt-md">{{buttonTitle}}</q-btn>
          </div>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { QTable, useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import type { Roles } from 'src/common/interfaces/roles.interface'
import type { Role, User } from 'src/common/interfaces/user.interface'
import { POSITIONENUM } from 'src/common/interfaces/user.interface'
import { onMounted, ref } from 'vue'

const $q = useQuasar()

const buttonTitle = ref<string>('Guardar')
const columns = ref<QTable['columns']>([
  {
    name: 'name',
    required: true,
    label: 'Nombre',
    align: 'left',
    field: (row) => row.name,
  },
  {
    name: 'lastname',
    required: true,
    label: 'Apellido',
    align: 'left',
    field: (row) => row.lastname,
  },
  {
    name: 'position',
    required: true,
    label: 'Puesto',
    align: 'left',
    field: (row) => row.position,
  },
  {
    name: 'role',
    required: true,
    label: 'Rol',
    align: 'left',
    field: (row) => row.rol?.name || 'Sin rol',
    format: (val: Roles) => val.name,
  },
])
const fixed = ref<boolean>(false)
const formUser = ref<User>({
  _id: '',
  name: '',
  lastname: '',
  role: '',
  position: '',
})
const positionOptions = ref<Array<POSITIONENUM>>(Object.values(POSITIONENUM))
const roles = ref<Array<Roles>>([])
const rows = ref<Array<User>>([])
const title = ref<string>('Crear')
const typeOptions = ref<Array<string>>([''])

onMounted(() => {
  getRoles()
  getUsers()
})
function onSubmit(): void {
  saveUser()
}

function onReset() {
  fixed.value = false
  formUser.value = {
    _id: '',
    name: '',
    lastname: '',
    role: '',
    position: '',
  }
  title.value = 'Crear'
  buttonTitle.value = 'Guardar'
}

function createUser() {
  fixed.value = true
  title.value = 'Crear'
  buttonTitle.value = 'Guardar'
}

function saveUser(): void {
  const role = roles.value.find((x) => x.name === formUser.value.role)
  if (title.value === 'Crear') {
    $q.loading.show({ message: 'Guardando usuario' })
    console.log('el rol que encontro', role)
    const dataToSend = {
      ...formUser.value,
      role: role ? (role._id ?? '') : '',
    }
    delete dataToSend._id
    api
      .post('users', dataToSend)
      .then(() => {
        onReset()
        $q.notify({
          message: 'Usuario guardado correctamente',
          position: 'top',
          color: 'positive',
        })
        fixed.value = false
      })
      .catch((error) => {
        $q.notify({
          message: error.message,
          position: 'top',
          color: 'negative',
        })
      })
      .finally(() => {
        $q.loading.hide()
        getUsers()
      })
  } else {
    $q.loading.show({ message: 'Actualizando usuario' })
    const id = formUser.value._id
    const dataToSend = {
      ...formUser.value,
      role: role ? (role._id ?? '') : '',
    }
    delete dataToSend._id
    api
      .patch(`users/${id}`, dataToSend)
      .then(() => {
        onReset()
        $q.notify({
          message: 'Usuario actualizado correctamente',
          position: 'top',
          color: 'positive',
        })
        fixed.value = false
      })
      .catch((error) => {
        $q.notify({
          message: error.message,
          position: 'top',
          color: 'negative',
        })
      })
      .finally(() => {
        $q.loading.hide()
        getUsers()
      })
  }
}

function editUser(data: User): void {
  console.log('lo que llega al edit', data)
  fixed.value = true
  title.value = 'Editar'
  buttonTitle.value = 'Actualizar'
  setUser(data)
}

function deleteUser(data: User): void {
  console.log('que se elimina', data)
  $q.dialog({
    title: 'Eliminar usuario',
    message: '¿Está seguro de eliminar este usuario?',
    ok: {
      push: true,
      color: 'negative',
      label: 'Sí',
    },
    cancel: {
      push: true,
      color: 'primary',
      label: 'No',
    },
  }).onOk(() => {
    deleteUserAction(data)
  })
}

function getUsers(): void {
  $q.loading.show({ message: 'Cargando usuarios...' })
  api
    .get<Array<User>>('users')
    .then((response) => {
      rows.value = response.data
    })
    .catch((error) => {
      $q.notify({
        message: error.message,
        position: 'top',
        color: 'negative',
      })
    })
    .finally(() => {
      $q.loading.hide()
    })
}

function deleteUserAction(data: User): void {
  $q.loading.show({ message: 'Eliminando usuario...' })
  api
    .delete(`users/${data._id}`)
    .then((res) => {
      console.log('respuesta al eliminar',res)
      $q.notify({
        message: 'Usuario eliminado correctamente',
        position: 'top',
        color: 'positive',
      })
    })
    .catch((error) => {
      $q.notify({
        message: error.message,
        position: 'top',
        color: 'negative',
      })
    })
    .finally(() => {
      $q.loading.hide()
      getUsers()
    })
}

function getRoles(): void {
  $q.loading.show({ message: 'Cargando roles...' })
  api
    .get<Array<Roles>>('roles')
    .then((response) => {
      console.log('los roles', response.data)
      typeOptions.value = response.data.map((item: Roles) => item.name)
      roles.value = response.data
    })
    .catch((error) => {
      $q.notify({
        message: error.message,
        position: 'top',
        color: 'negative',
      })
    })
    .finally(() => {
      $q.loading.hide()
    })
}

function setUser(data: User): void {
  console.log('lo que llega en el user', data);
  formUser.value = {
    _id: data._id ?? '',
    name: data.name,
    lastname: data.lastname,
    role: (<Role>data.role).name,
    position: data.position,
  }
}

function getRoleColor(role: string): string {
  switch (role) {
    case 'gerente':
      return 'green' // Verde para Gerente
    case 'administrador':
      return 'yellow' // Amarillo para Administrador
    case 'operario':
      return 'blue' // Azul para Operario
    default:
      return 'grey' // Color predeterminado
  }
}

function getRoleIcon(role: string): string {
  switch (role) {
    case 'gerente':
      return 'account_circle'
    case 'administrador':
      return 'supervisor_account'
    case 'operario':
      return 'handyman'
    default:
      return 'help'
  }
}
</script>
