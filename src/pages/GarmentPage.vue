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
          @click="createGarment()"
        >
          <q-tooltip>Agregar prenda</q-tooltip>
        </q-btn>
      </div>
      <div class="col-12 full-width">
        <q-table
          flat
          bordered
          title="Prendas"
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
                <q-btn flat dense color="primary" icon="las la-edit" @click="editGarment(props.row)"
                  ><q-tooltip>Editar registro</q-tooltip></q-btn
                >
                <q-btn
                  flat
                  dense
                  color="negative"
                  icon="las la-trash"
                  @click="deleteGarment(props.row)"
                  ><q-tooltip>Eliminar registro</q-tooltip></q-btn
                >
              </td>
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.value }}
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
          @click="closeDialog()"
        >
          <q-tooltip>Cerrar</q-tooltip>
        </q-btn>
        <h5 class="q-my-md">{{ title }} prenda</h5>
      </div>
      <q-separator />
      <q-form @submit="onSubmit" @reset="onReset">
        <div class="row q-pa-md q-col-gutter-md">
          <div class="col-4">
            <q-input v-model="formGarment.code" filled label="Código"></q-input>
          </div>
          <div class="col-8">
            <q-input v-model="formGarment.name" filled label="Nombre"></q-input>
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
import { onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'
import type { Garments } from 'src/common/interfaces/garments.interface'

const $q = useQuasar()

const buttonName = ref<string>('Guardar')
const fixed = ref<boolean>(false)
const columns = ref<QTable['columns']>([
  {
    name: 'code',
    required: true,
    label: 'Codigo',
    align: 'left',
    field: (row) => row.code,
  },
  {
    name: 'name',
    required: true,
    label: 'Nombre',
    align: 'left',
    field: (row) => row.name,
  },
])
const formGarment = ref<Garments>({
  _id: '',
  code: '',
  name: '',
})
const title = ref<string>('Crear')
const rows = ref<Array<Garments>>([])

onMounted(() => {
  getGarments()
})

function getGarments(): void {
  $q.loading.show({
    message: 'Cargando prendas...',
  })
  api
    .get('garments')
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

function onSubmit(): void {
  console.log('Submit')
  if (title.value === 'Crear') {
    saveGarment()
  } else {
    updateGarment()
  }
}

function saveGarment(): void {
  $q.loading.show({ message: 'Guardando prenda' })
  delete formGarment.value._id
  api
    .post('garments', formGarment.value)
    .then(() => {
      onReset()
      $q.notify({
        message: 'Prenda guardada correctamente',
        position: 'top',
        color: 'positive',
      })
      fixed.value = false
      getGarments()
    })
    .catch((error) => {
      $q.notify({
        message: error.message,
        position: 'center',
        color: 'negative',
      })
    })
    .finally(() => {
      $q.loading.hide()
    })
}

function updateGarment(): void {
  const id = formGarment.value._id
  delete formGarment.value._id
  $q.loading.show({ message: 'Actualizando prenda' })
  api
    .patch(`garments/${id}`, formGarment.value)
    .then(() => {
      onReset()
      $q.notify({
        message: 'Prenda actualizada correctamente',
        position: 'top',
        color: 'positive',
      })
      fixed.value = false
    })
    .catch((error) => {
      $q.notify({
        message: error.message,
        position: 'center',
        color: 'negative',
      })
    })
    .finally(() => {
      $q.loading.hide()
    })
}
function onReset() {
  formGarment.value = {
    _id: '',
    code: '',
    name: '',
  }
}

function editGarment(row: Garments): void {
  buttonName.value = 'Actualizar'
  formGarment.value = {
    _id: row?._id ?? '',
    code: row.code,
    name: row.name,
  }
  title.value = 'Editar'
  fixed.value = true
}

function deleteGarment(row: Garments): void {
  $q.dialog({
    title: 'Eliminar prenda',
    message: '¿Está seguro de eliminar esta prenda?',
    persistent: true,
    ok: {
      label: 'Si',
      color: 'positive',
    },
    cancel: {
      label: 'No',
      color: 'negative',
    },
  }).onOk(() => {
    $q.loading.show({ message: 'Eliminando prenda' })
    api
      .delete(`garments/${row._id}`)
      .then(() => {
        $q.notify({
          message: 'Prenda eliminada correctamente',
          position: 'top',
          color: 'positive',
        })
        getGarments()
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
  })
}

function createGarment() {
  title.value = 'Crear'
  buttonName.value = 'Guardar'
  fixed.value = true
}

function closeDialog() {
  fixed.value = false
  onReset()
}
</script>
