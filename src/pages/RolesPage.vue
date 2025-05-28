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
          @click="closeModal()"
        >
          <q-tooltip>Agregar rol</q-tooltip>
        </q-btn>
      </div>
      <div class="col-12 full-width">
        <q-table
          flat
          bordered
          title="Roles"
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
                <q-btn flat dense color="primary" icon="las la-edit" @click="editRol(props.row)"
                  ><q-tooltip>Editar rol</q-tooltip></q-btn
                >
                <q-btn
                  flat
                  dense
                  color="negative"
                  icon="las la-trash"
                  :disable="!props.row.isActive"
                  @click="deleteRol(props.row)"
                  ><q-tooltip>Eliminar rol</q-tooltip></q-btn
                >
              </td>
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <template v-if="col.name === 'isActive'">
                  <q-chip
                    :color="props.row.isActive ? 'positive' : 'negative'"
                    :icon="props.row.isActive ? 'check_circle' : 'cancel'"
                    outline
                  >
                    {{ props.row.isActive ? 'Activo' : 'Inactivo' }}
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
          @click="fixed = false"
        >
          <q-tooltip>Cerrar</q-tooltip>
        </q-btn>

        <h5 class="q-my-md">{{ title }} rol</h5>
      </div>
      <q-separator />
      <q-form @submit="onSubmit" @reset="onReset">
        <div class="row q-pa-md q-col-gutter-md">
          <div class="col-6">
            <q-input v-model="formRoles.name" filled label="Nombre del rol"></q-input>
          </div>
          <div class="col-6">
            <q-checkbox
              v-model="formRoles.isActive"
              filled
              label="Activo"
              checked-icon="task_alt"
              unchecked-icon="highlight_off"
            ></q-checkbox>
          </div>
          <div class="col-12 q-mt-md" style="text-align: end">
            <q-separator />
            <q-btn flat type="submit" color="positive" class="q-mt-md">{{ buttonName }}</q-btn>
          </div>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { QTable, useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import type { Roles } from 'src/common/interfaces/roles.interface'
import { onMounted } from 'vue'
import { ref } from 'vue'

const $q = useQuasar()

const buttonName = ref<string>('Guardar')
const columns = ref<QTable['columns']>([
  {
    name: 'name',
    required: true,
    label: 'Nombre',
    align: 'left',
    field: (row) => row.name,
    sortable: true,
  },
  {
    name: 'isActive',
    required: true,
    label: 'Activo',
    align: 'left',
    field: (row) => row.isActive,
    sortable: true,
  },
])
const fixed = ref<boolean>(false)
const formRoles = ref<Roles>({
  _id: '',
  name: '',
  isActive: true,
})
const rows = ref<Array<Roles>>([])
const title = ref<string>('Crear')

onMounted(() => {
  getRoles()
})

function onSubmit(): void {
  saveRole()
}

function onReset(): void {
  formRoles.value = {
    name: '',
    isActive: true,
  }
}

function getRoles(): void {
  $q.loading.show({ message: 'Cargando roles...' })
  api
    .get('roles')
    .then((response) => {
      console.log('los roles', response.data)
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

function saveRole(): void {
  $q.loading.show({ message: 'Guardando rol' })
  if (title.value === 'Crear') {
    api
      .post('roles', formRoles.value)
      .then(() => {
        onReset()
        $q.notify({
          message: 'Rol guardado correctamente',
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
        getRoles()
      })
  } else {
    const id = formRoles.value._id
    delete formRoles.value._id
    api
      .patch(`roles/${id}`, formRoles.value)
      .then(() => {
        onReset()
        $q.notify({
          message: 'Rol actualizado correctamente',
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
        getRoles()
      })
  }
}

function editRol(data: Roles): void {
  console.log('lo que llega al editar', data)
  fixed.value = true
  title.value = 'Editar'
  buttonName.value = 'Actualizar'
  formRoles.value = {
    _id: data._id,
    name: data.name,
    isActive: data.isActive,
  }
}

function deleteRol(data: Roles): void {
  $q.dialog({
    title: 'Eliminar rol',
    message: 'Estas seguro de eliminar el rol?',
    ok: {
      label: 'Aceptar',
      color: 'positive',
      flat: true,
    },
    cancel: {
      label: 'Cancelar',
      color: 'negative',
      flat: true,
    },
    persistent: true,
  }).onOk(() => {
    $q.loading.show({ message: 'Eliminando rol' })
    api
      .delete(`roles/${data._id}`)
      .then(() => {
        $q.notify({
          message: 'Rol eliminado correctamente',
          position: 'top',
          color: 'positive',
        })
        getRoles()
      })
      .catch((error) => {
        $q.notify({
          message: error.message ?? 'Error al eliminar el rol',
          position: 'top',
          color: 'negative',
        })
      })
      .finally(() => {
        $q.loading.hide()
      })
  })
}

function closeModal(): void {
    fixed.value = true
    onReset()
}
</script>
