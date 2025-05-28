<template>
  <q-page>
    <div class="row q-pa-md">
      <h5 class="q-mt-sm q-mb-sm">Control de calidad</h5>
    </div>
    <q-card>
      <q-form @submit="onSubmit" @reset="onReset">
        <div class="row q-pa-md q-col-gutter-md">
          <div class="col-md-2 col-12">
            <q-input v-model="formQuality.date" label="Fecha" type="date" />
          </div>
          <div class="col-md-2 col-12">
            <q-input v-model="formQuality.productionOrder" label="Orden de producción" />
          </div>
          <div class="col-md-2 col-12">
            <q-select
              v-model="formQuality.garmentCode"
              filled
              label="Código de prenda"
              :options="garments"
            />
          </div>
          <div class="col-md-2 col-12">
            <q-input v-model="formQuality.operation" label="Operación" />
          </div>
          <div class="col-md-2 col-12">
            <q-input v-model="formQuality.unitsChecked" label="Unidades revisadas" type="number" />
          </div>
          <div class="col-md-2 col-12">
            <q-input v-model="formQuality.initQuality" type="time" label="Hora inicial" />
          </div>
          <div class="col-md-2 col-12">
            <q-input v-model="formQuality.endQuality" type="time" label="Hora final" />
          </div>
          <div class="col-md-4 col-12">
            <q-select
              v-model="formQuality.operator"
              :options="userOptions"
              filled
              label="Operador"
            />
          </div>
          <div class="col-12 q-mt-md" style="text-align: end">
            <q-separator />
            <q-btn
              v-if="buttonName === 'Actualizar'"
              flat
              type="reset"
              color="negative"
              class="q-mt-md"
              >Cancelar</q-btn
            >
            <q-btn flat type="submit" color="positive" class="q-mt-md">{{ buttonName }}</q-btn>
          </div>
        </div>
      </q-form>

      <div class="col-12 full-width q-pa-sm">
        <q-table
          flat
          bordered
          title="Últimos registros"
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
                <q-btn flat dense color="primary" icon="las la-edit" @click="editCutting(props.row)"
                  ><q-tooltip>Editar registro</q-tooltip></q-btn
                >
                <q-btn
                  flat
                  dense
                  color="negative"
                  icon="las la-trash"
                  @click="deleteCutting(props.row)"
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
    </q-card>
  </q-page>
</template>
<script lang="ts" setup>
import { api } from 'src/boot/axios'
import { QTable, useQuasar } from 'quasar'
import type { Garments } from 'src/common/interfaces/garments.interface'
import type { Quality } from 'src/common/interfaces/quality.interface'
import { onMounted, ref } from 'vue'
import type { User } from 'src/common/interfaces/user.interface'
const $q = useQuasar()

const buttonName = ref<string>('Guardar')
const columns = ref<QTable['columns']>([
  {
    name: 'date',
    required: true,
    label: 'Fecha',
    align: 'left',
    field: (row) => row.date,
    format: (val) => val,
    sortable: true,
  },
  {
    name: 'productionOrder',
    required: true,
    label: 'Orden de producción',
    align: 'left',
    field: (row) => row.productionOrder,
    format: (val) => val,
    sortable: true,
  },
  {
    name: 'garmentCode',
    required: true,
    label: 'Código de prenda',
    align: 'left',
    field: (row) => row.garmentCode,
    format: (val) => val.code,
    sortable: true,
  },
  {
    name: 'operation',
    required: true,
    label: 'Operación',
    align: 'left',
    field: (row) => row.operation,
    format: (val) => val,
    sortable: true,
  },
  {
    name: 'unitsChecked',
    required: true,
    label: 'Unidades revisadas',
    align: 'left',
    field: (row) => row.unitsChecked,
    format: (val) => val,
    sortable: true,
  },
  {
    name: 'initQuality',
    required: true,
    label: 'Hora inicio',
    align: 'left',
    field: (row) => row.initQuality,
    format: (val) => val,
    sortable: true,
  },
  {
    name: 'endQuality',
    required: true,
    label: 'Hora final',
    align: 'left',
    field: (row) => row.endQuality,
    format: (val) => val,
    sortable: true,
  },
  {
    name: 'operator',
    required: true,
    label: 'Operador',
    align: 'left',
    field: (row) => row.operator,
    format: (val) => `${(<User>val)?.name} ${(<User>val)?.lastname}`,
    sortable: true,
  },
])
const formQuality = ref<Quality>({
  date: null,
  productionOrder: null,
  garmentCode: null,
  operation: null,
  unitsChecked: null,
  initQuality: null,
  endQuality: null,
  operator: null,
})
const garments = ref<Array<string>>([])
const lstGarments = ref<Array<Garments>>([])
const lstUsers = ref<Array<User>>([])
const rows = ref<Array<Quality>>([])
const userOptions = ref<Array<string>>([])

onMounted(() => {
  getQualities()
  getGarments()
  getUsers()
})

function onSubmit() {
  saveQuality()
}

function saveQuality() {
  const message =
    buttonName.value === 'Actualizar'
      ? 'Actualizado registro de control'
      : 'Guardando registro de control de calidad...'
  $q.loading.show({ message })
  const id = buttonName.value === 'Actualizar' ? formQuality.value._id : null
  const user = lstUsers.value.find(
    (u) => `${u.name} ${u.lastname}` === <string>formQuality.value.operator,
  )
  const garmet = lstGarments.value.find((g) => g.code === formQuality.value.garmentCode)

  const dataToSend: Quality = {
    date: formQuality.value.date,
    productionOrder: formQuality.value.productionOrder,
    garmentCode: garmet?._id ?? '',
    operation: formQuality.value.operation,
    unitsChecked: formQuality.value.unitsChecked,
    initQuality: formQuality.value.initQuality,
    endQuality: formQuality.value.endQuality,
    operator: user?._id ?? '',
  }
  if (buttonName.value === 'Actualizar') {
    api
      .patch(`quality/${id}`, dataToSend)
      .then(() => {
        $q.notify({
          message: 'Registro actualizado correctamente',
          position: 'center',
          color: 'positive',
        })
        getQualities()
        onReset()
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
  } else {
    api
      .post('quality', dataToSend)
      .then(() => {
        $q.notify({
          message: 'Registro guardado correctamente',
          position: 'center',
          color: 'positive',
        })
        getQualities()
        onReset()
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
}

function onReset() {
  buttonName.value = 'Guardar'
  formQuality.value = {
    date: null,
    productionOrder: null,
    garmentCode: null,
    operation: null,
    unitsChecked: null,
    initQuality: null,
    endQuality: null,
    operator: null,
  }
}

function editCutting(row: Quality) {
  buttonName.value = 'Actualizar'
  formQuality.value = {
    ...row,
    operator: `${(<User>row.operator)?.name} ${(<User>row.operator)?.lastname}`,
    garmentCode: (<Garments>row.garmentCode).code,
  }
}

function deleteCutting(row: Quality) {
  $q.dialog({
    title: 'Eliminar control de calidad',
    message: '¿Está seguro de eliminar este registro?',
    persistent: true,
    ok: {
      label: 'Sí',
      color: 'positive',
      push: true,
    },
    cancel: {
      label: 'No',
      color: 'negative',
      push: true,
    },
  }).onOk(() => {
    $q.loading.show({ message: 'Eliminando registro...' })
    api
      .delete(`quality/${row._id}`)
      .then(() => {
        $q.notify({
          message: 'Control de calidad eliminado correctamente',
          position: 'center',
          color: 'positive',
        })
        getQualities()
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
  })
}

function getQualities(): void {
  $q.loading.show({ message: 'Cargando controles de calidad...' })
  api
    .get('quality')
    .then((response) => {
      console.log('la data que llega', response.data)
      rows.value = response.data
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

function getGarments(): void {
  $q.loading.show({ message: 'Cargando prendas...' })
  api
    .get('garments')
    .then((response) => {
      lstGarments.value = response.data
      garments.value = lstGarments.value.map((garment) => garment.code)
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

function getUsers(): void {
  $q.loading.show({ message: 'Cargando usuarios...' })
  api
    .get('users')
    .then((response) => {
      lstUsers.value = response.data
      userOptions.value = lstUsers.value.map((user) => `${user.name} ${user.lastname}`)
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
</script>
