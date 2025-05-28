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
          @click="createTime()"
        >
          <q-tooltip>Agregar tiempo</q-tooltip>
        </q-btn>
      </div>
      <div class="col-12 full-width">
        <q-table
          flat
          bordered
          title="Tiempos"
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
                <q-btn flat dense color="primary" icon="las la-edit" @click="editTime(props.row)"
                  ><q-tooltip>Editar registro</q-tooltip></q-btn
                >
                <q-btn
                  flat
                  dense
                  color="negative"
                  icon="las la-trash"
                  @click="deleteTime(props.row)"
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
        <h5 class="q-my-md">{{ title }} tiempo</h5>
      </div>
      <q-separator />
      <q-form @submit="onSubmit" @reset="onReset">
        <div class="row q-pa-md q-col-gutter-md">
          <div class="col-12">
            <q-checkbox v-model="referenceTime" label="Tiene tiempo de suplemento" />
          </div>
          <div class="col-4">
            <q-select
              v-model="formTimes.operation"
              :options="operations"
              filled
              label="Operación"
            />
          </div>
          <div class="col-8">
            <q-select v-model="formTimes.garment" :options="garments" filled label="Prenda" />
          </div>
          <div v-if="referenceTime" class="col-6">
            <q-input
              v-model="formTimes.standardReference"
              filled
              label="Referencia estándar"
              type="number"
            />
          </div>
          <div class="col-6">
            <q-input
              v-model="formTimes.standardTime"
              filled
              label="Tiempo estándar"
              type="number"
              :disable="referenceTime"
            />
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
<script lang="ts" setup>
import { watch } from 'vue'
import type { QTable } from 'quasar'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import type { Garments } from 'src/common/interfaces/garments.interface'
import type { Operation } from 'src/common/interfaces/operation.interface'
import type { Time } from 'src/common/interfaces/times.interface'
import { onMounted, ref } from 'vue'

const $q = useQuasar()

const buttonName = ref<string>('Guardar')
const columns = ref<QTable['columns']>([
  {
    name: 'operation',
    required: true,
    label: 'Operación',
    align: 'left',
    field: (row) => row.operation.code,
  },
  {
    name: 'standardReference',
    required: true,
    label: 'Referencia estándar',
    align: 'left',
    field: (row) => (row.standardReference ? row.standardReference : 'N/A'),
  },
  {
    name: 'standardTime',
    required: true,
    label: 'Tiempo estándar',
    align: 'left',
    field: (row) => row.standardTime,
  },
  {
    name: 'garment',
    required: true,
    label: 'Prenda',
    align: 'left',
    field: (row) => row.garment.code,
  },
])
const fixed = ref<boolean>(false)
const formTimes = ref<Time>({
  _id: '',
  operation: null,
  standardReference: null,
  standardTime: null,
  garment: null,
})
const garments = ref<Array<string>>([])
const lstGarments = ref<Array<Garments>>([])
const lstOperations = ref<Array<Operation>>([])
const operations = ref<Array<string>>([])
const referenceTime = ref<boolean>(false)
const rows = ref<Array<Time>>([])
const title = ref<string>('Crear')

onMounted(() => {
  getTimes()
  getGarments()
  getOperations()
})

watch(
  () => [referenceTime.value, formTimes.value.standardReference],
  ([time, formVal]) => {
    if (time && formVal) {
      formTimes.value.standardTime = Number(
        Number.parseFloat((Number(formVal) * 1.085).toString()).toFixed(2),
      )
    }
  },
)

function onSubmit() {
  if (title.value === 'Crear') {
    saveTime()
  } else {
    updateTime()
  }
}

function saveTime(): void {
  $q.loading.show({ message: 'Guardando tiempo' })
  const dataToSend = setDataToSend(formTimes.value)
  api.post('/times', dataToSend).then(() => {
    onReset()
    $q.notify({
      message: 'Tiempo guardado correctamente',
      position: 'top',
      color: 'positive'
    })
    fixed.value = false
    getTimes()
  })
  .catch((error) => {
    $q.notify({
      message: error.message,
      color: 'negative',
      position: 'center'
    })
  })
  .finally(() => {
    $q.loading.hide()
  })
}

function updateTime(): void {
  $q.loading.show({ message: 'Actualizando tiempo' })
  const id = formTimes.value._id
  const dataToSend = setDataToSend(formTimes.value)
  api.patch(`/times/${id}`, dataToSend).then(() => {
    onReset()
    $q.notify({
      message: 'Tiempo actualizado correctamente',
      position: 'top',
      color: 'positive'
    })
    fixed.value = false
    getTimes()
  })
  .catch((error) => {
    $q.notify({
      message: error.message,
      color: 'negative',
      position: 'center'
    })
  })
  .finally(() => {
    $q.loading.hide()
  })
}

function setDataToSend(formData: Time): Time {
  const garment = lstGarments.value.find((g) => g.code === formData?.garment)
  const operation = lstOperations.value.find((o) => o.code === formData?.operation)
  return {
    operation: operation?._id ?? '',
    standardReference: Number(formData?.standardReference),
    standardTime: Number(formData?.standardTime),
    garment: garment?._id ?? '',
  }
}

function onReset() {
  buttonName.value = 'Guardar'
  referenceTime.value = false
  formTimes.value = {
    _id: '',
    operation: null,
    standardReference: null,
    standardTime: null,
    garment: null,
  }
}

function closeDialog() {
  fixed.value = false
  onReset()
}

function editTime(row: Time) {
  title.value = 'Editar'
  buttonName.value = 'Actualizar'
  fixed.value = true
  formTimes.value = { ...row, operation: (<Operation>row.operation).code, garment: (<Garments>row.garment).code }
  console.log('el row', row);
  console.log('el value form', formTimes.value);
}

function deleteTime(row: Time) {
  $q.dialog({
    title: 'Eliminar tiempo',
    message: '¿Está seguro de eliminar el registro?',
    persistent: true,
    ok: {
      label: 'Sí',
      color: 'positive',
    },
    cancel: {
      label: 'No',
      color: 'primary',
    },
  }).onOk(() => {
    $q.loading.show({
      message: 'Eliminando registro...',
    })
    api
      .delete(`/times/${row._id}`)
      .then(() => {
        getTimes()
        $q.notify({
          message: 'Registro eliminado con éxito',
          color: 'positive',
          position: 'center',
        })
      })
      .catch((error) => {
        $q.notify({
          message: error.message,
          color: 'negative',
          position: 'center',
        })
      })
      .finally(() => {
        $q.loading.hide()
      })
  })
}

function createTime() {
  title.value = 'Crear'
  buttonName.value = 'Guardar'
  fixed.value = true
}

function getTimes(): void {
  $q.loading.show({
    message: 'Cargando tiempos',
  })
  api
    .get('/times')
    .then((response) => {
      console.log('response', response)
      rows.value = response.data
    })
    .catch((error) => {
      $q.notify({
        message: error.message,
        color: 'negative',
        position: 'center',
      })
    })
    .finally(() => {
      $q.loading.hide()
    })
}

function getGarments(): void {
  $q.loading.show({
    message: 'Cargando prendas',
  })
  api
    .get('/garments')
    .then((response) => {
      lstGarments.value = response.data
      garments.value = lstGarments.value.map((garment) => garment.code)
    })
    .catch((error) => {
      $q.notify({
        message: error.message,
        color: 'negative',
        position: 'center',
      })
    })
    .finally(() => {
      $q.loading.hide()
    })
}

function getOperations(): void {
  $q.loading.show({
    message: 'Cargando operaciones',
  })
  api
    .get('/operations')
    .then((response) => {
      lstOperations.value = response.data
      operations.value = lstOperations.value
        .map((operation) => operation.code)
        .filter((code): code is string => code !== null)
    })
    .catch((error) => {
      $q.notify({
        message: error.message,
        color: 'negative',
        position: 'center',
      })
    })
    .finally(() => {
      $q.loading.hide()
    })
}
</script>
